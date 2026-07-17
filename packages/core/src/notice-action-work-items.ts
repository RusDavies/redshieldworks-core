import {
  AuditEventSchema,
  WorkItemSchema,
  type AuditEvent,
  type EvidenceReference,
  type WorkItem,
} from "./generated/index";

export type NoticeActionPriority = WorkItem["priority"];
export type NoticeActionDecision = "approved" | "rejected";

export interface NoticeActionProposal {
  action_id?: string;
  action_type: string;
  priority?: NoticeActionPriority;
  summary: string;
  review_gate?: string;
  context?: Record<string, string | number | boolean | null | Array<string | number | boolean | null>>;
  approval_required?: boolean;
  approval_status?: "proposed" | "approved" | "rejected";
  implementation_state?: WorkItem["implementation"] extends infer Implementation
    ? Implementation extends { state?: infer State }
      ? State
      : never
    : never;
}

export interface NoticeActionWorkItemOptions {
  source: string;
  createdAt: string;
  evidenceRefs?: EvidenceReference[];
  sourceModule?: string;
  defaultApprovalGate?: WorkItem["approval"]["gate"];
}

export interface NoticeActionDecisionActor {
  actor_type: AuditEvent["actor"]["actor_type"];
  actor_id: string;
  display_name?: string;
}

export interface NoticeActionDecisionOptions {
  decision: NoticeActionDecision;
  decidedAt: string;
  actor: NoticeActionDecisionActor;
  reason?: string;
}

export interface NoticeActionDecisionResult {
  workItem: WorkItem;
  auditEvent: AuditEvent;
}

export interface NoticeActionWorkflowSnapshot {
  schema_version: "0.1.0";
  updated_at: string;
  work_items: WorkItem[];
  audit_events: AuditEvent[];
}

export interface NoticeActionWorkflowSnapshotOptions extends NoticeActionWorkItemOptions {
  actions: NoticeActionProposal[];
  auditEvents?: AuditEvent[];
}

function stableHexDigest(input: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return Math.abs(hash).toString(16).padStart(8, "0");
}

export function stableNoticeActionId(source: string, actionType: string, index = 1): string {
  return `notice-action-${stableHexDigest(`${source}:${actionType}:${index}`)}`;
}

export function noticeActionNextStep(actionType: string): string {
  const canonicalActionType = actionType.replaceAll("-", "_");

  if (canonicalActionType === "update_filing_frequency_configuration") {
    return "Apply the approved frequency/effective-date values to the filing-period configuration model.";
  }

  if (canonicalActionType === "reconcile_gst_qst_payment_or_refund") {
    return "Match the notice amount and period to GST/QST liability workpapers and bank deposits/payments.";
  }

  if (canonicalActionType === "compare_assessed_balances") {
    return "Compare assessed balances, penalties, interest, and carry-forward fields to return workpapers.";
  }

  return "Review and classify the notice manually before taking further action.";
}

export function approvedNoticeActionSummary(actionType: string): string {
  const canonicalActionType = actionType.replaceAll("-", "_");

  if (canonicalActionType === "update_filing_frequency_configuration") {
    return "Queued an approved filing-frequency configuration update request.";
  }

  if (canonicalActionType === "reconcile_gst_qst_payment_or_refund") {
    return "Queued an approved GST/QST payment/refund reconciliation task.";
  }

  if (canonicalActionType === "compare_assessed_balances") {
    return "Queued an approved notice-of-assessment comparison task.";
  }

  return "Queued an approved manual-review task.";
}

function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createNoticeActionWorkItem(
  action: NoticeActionProposal,
  options: NoticeActionWorkItemOptions,
): WorkItem {
  const workItem = {
    schema_version: "0.1.0",
    work_item_id: action.action_id || stableNoticeActionId(options.source, action.action_type),
    source_module: options.sourceModule || "redshieldworks-docs",
    work_item_type: slug(action.action_type) || "manual-review",
    priority: action.priority || "normal",
    summary: action.summary,
    status: "proposed",
    approval: {
      required: action.approval_required ?? true,
      status: action.approval_status || "proposed",
      gate: options.defaultApprovalGate || "tax_action",
    },
    created_at: options.createdAt,
    evidence_refs: options.evidenceRefs || [],
    context: {
      ...(action.context || {}),
      review_gate: action.review_gate || "",
      next_step: noticeActionNextStep(action.action_type),
    },
    workflow_context: {
      workflow_id: `notice-action-workflow-${action.action_id || stableNoticeActionId(options.source, action.action_type).replace(/^notice-action-/, "")}`,
      workflow_type: "notice-action",
      domain: "tax",
    },
    implementation: {
      state: action.implementation_state || "waiting_for_approval",
    },
  } satisfies WorkItem;

  return WorkItemSchema.parse(workItem);
}

export function decideNoticeActionWorkItem(
  workItem: WorkItem,
  options: NoticeActionDecisionOptions,
): NoticeActionDecisionResult {
  const approved = options.decision === "approved";
  const updatedWorkItem = WorkItemSchema.parse({
    ...workItem,
    status: approved ? "queued" : "rejected",
    approval: {
      ...workItem.approval,
      status: options.decision,
      approved_by: approved ? options.actor.actor_id : undefined,
      approved_at: approved ? options.decidedAt : undefined,
    },
    context: {
      ...(workItem.context || {}),
      decision_reason: options.reason || "",
      next_step: approved
        ? noticeActionNextStep(workItem.work_item_type)
        : "No internal work item created.",
    },
    implementation: {
      ...(workItem.implementation || {}),
      state: approved ? "queued" : "rejected_no_action",
      result_summary: approved
        ? approvedNoticeActionSummary(workItem.work_item_type)
        : "Rejected by reviewer; no action implemented.",
    },
  });

  const auditEvent = AuditEventSchema.parse({
    schema_version: "0.1.0",
    event_id: `audit-event-${options.decision}-${workItem.work_item_id.replace(/^(work-item|notice-action)-/, "")}`,
    event_type: approved ? "work_item_approved" : "work_item_rejected",
    occurred_at: options.decidedAt,
    actor: options.actor,
    module: workItem.source_module,
    summary: approved
      ? `Approved notice action work item ${workItem.work_item_id}.`
      : `Rejected notice action work item ${workItem.work_item_id}.`,
    target_type: "work-item",
    target_id: workItem.work_item_id,
    evidence_refs: workItem.evidence_refs?.map((evidenceRef) => evidenceRef.evidence_id) || [],
    metadata: {
      work_item_type: workItem.work_item_type,
      decision: options.decision,
    },
    workflow_context: {
      workflow_id: workItem.workflow_context?.workflow_id,
      work_item_id: workItem.work_item_id,
      previous_status: workItem.status,
      new_status: updatedWorkItem.status,
      reason: options.reason,
    },
  } satisfies AuditEvent);

  return {
    workItem: updatedWorkItem,
    auditEvent,
  };
}

export function createNoticeActionWorkflowSnapshot(
  options: NoticeActionWorkflowSnapshotOptions,
): NoticeActionWorkflowSnapshot {
  return {
    schema_version: "0.1.0",
    updated_at: options.createdAt,
    work_items: options.actions.map((action, index) =>
      createNoticeActionWorkItem(
        {
          ...action,
          action_id: action.action_id || stableNoticeActionId(options.source, action.action_type, index + 1),
        },
        options,
      ),
    ),
    audit_events: options.auditEvents || [],
  };
}

export function parseNoticeActionWorkflowSnapshot(
  payload: string | NoticeActionWorkflowSnapshot,
): NoticeActionWorkflowSnapshot {
  const snapshot = typeof payload === "string" ? JSON.parse(payload) : payload;

  if (snapshot.schema_version !== "0.1.0") {
    throw new Error("Notice action workflow snapshot schema_version must be 0.1.0");
  }

  if (typeof snapshot.updated_at !== "string" || Number.isNaN(Date.parse(snapshot.updated_at))) {
    throw new Error("Notice action workflow snapshot updated_at must be an ISO date-time string");
  }

  return {
    schema_version: "0.1.0",
    updated_at: snapshot.updated_at,
    work_items: snapshot.work_items.map((workItem: unknown) => WorkItemSchema.parse(workItem)),
    audit_events: snapshot.audit_events.map((auditEvent: unknown) => AuditEventSchema.parse(auditEvent)),
  };
}

export function serializeNoticeActionWorkflowSnapshot(
  snapshot: NoticeActionWorkflowSnapshot,
): string {
  const parsed = parseNoticeActionWorkflowSnapshot(snapshot);

  return `${JSON.stringify(parsed, null, 2)}\n`;
}

export function applyNoticeActionDecisionToSnapshot(
  snapshot: NoticeActionWorkflowSnapshot,
  workItemId: string,
  options: NoticeActionDecisionOptions,
): NoticeActionWorkflowSnapshot {
  const parsed = parseNoticeActionWorkflowSnapshot(snapshot);
  let decisionResult: NoticeActionDecisionResult | undefined;

  const workItems = parsed.work_items.map((workItem) => {
    if (workItem.work_item_id !== workItemId) {
      return workItem;
    }

    decisionResult = decideNoticeActionWorkItem(workItem, options);
    return decisionResult.workItem;
  });

  if (!decisionResult) {
    throw new Error(`Notice action work item not found: ${workItemId}`);
  }

  return {
    schema_version: "0.1.0",
    updated_at: options.decidedAt,
    work_items: workItems,
    audit_events: [...parsed.audit_events, decisionResult.auditEvent],
  };
}
