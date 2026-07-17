import { describe, expect, it } from "vitest";

import {
  AuditEventSchema,
  EvidenceReferenceSchema,
  WorkItemSchema,
  applyNoticeActionDecisionToSnapshot,
  approvedNoticeActionSummary,
  createNoticeActionWorkItem,
  createNoticeActionWorkflowSnapshot,
  decideNoticeActionWorkItem,
  noticeActionNextStep,
  parseNoticeActionWorkflowSnapshot,
  serializeNoticeActionWorkflowSnapshot,
  stableNoticeActionId,
} from "../packages/core/src/index";

const createdAt = "2026-06-20T19:20:00Z";
const noticeEvidence = EvidenceReferenceSchema.parse({
  schema_version: "0.1.0",
  evidence_id: "evidence-notice-action-test-001",
  evidence_type: "notice",
  source: {
    location_type: "repo_path",
    locator: "sample-data/notices/gst_qst_frequency_change_ocr.txt",
    display_name: "Synthetic GST/QST notice OCR text",
  },
  sensitivity: "confidential",
  created_at: createdAt,
  artifact: {
    content_role: "source",
  },
});

describe("Core notice action work-item flow", () => {
  it("creates proposed Core work items from worker notice action proposals", () => {
    const workItem = createNoticeActionWorkItem(
      {
        action_type: "update_filing_frequency_configuration",
        priority: "high",
        summary:
          "Review and update GST/QST filing-frequency configuration before the next workpaper run.",
        review_gate:
          "Human must confirm the effective date and affected tax account before configuration changes are applied.",
        context: {
          tax_program: "gst_qst",
          filing_frequency: "monthly",
          dates: "2026-04-01",
        },
      },
      {
        source: "sample-data/notices/gst_qst_frequency_change_ocr.txt",
        createdAt,
        evidenceRefs: [noticeEvidence],
      },
    );

    expect(WorkItemSchema.safeParse(workItem).success).toBe(true);
    expect(workItem).toMatchObject({
      work_item_id: stableNoticeActionId(
        "sample-data/notices/gst_qst_frequency_change_ocr.txt",
        "update_filing_frequency_configuration",
      ),
      source_module: "redshieldworks-docs",
      work_item_type: "update_filing_frequency_configuration",
      priority: "high",
      status: "proposed",
      approval: {
        required: true,
        status: "proposed",
        gate: "tax_action",
      },
      implementation: {
        state: "waiting_for_approval",
      },
    });
    expect(workItem.context?.next_step).toBe(
      noticeActionNextStep("update_filing_frequency_configuration"),
    );
    expect(workItem.evidence_refs?.[0].evidence_id).toBe("evidence-notice-action-test-001");
  });

  it("queues approved notice action work items and records a Core audit event", () => {
    const proposed = createNoticeActionWorkItem(
      {
        action_id: "notice-action-testapprove001",
        action_type: "reconcile_gst_qst_payment_or_refund",
        priority: "high",
        summary:
          "Reconcile the GST/QST notice payment, cheque, refund, or credit against workpapers.",
      },
      {
        source: "sample-data/notices/gst_qst_refund_notice_ocr.txt",
        createdAt,
        evidenceRefs: [noticeEvidence],
      },
    );

    const result = decideNoticeActionWorkItem(proposed, {
      decision: "approved",
      decidedAt: "2026-06-20T19:30:00Z",
      actor: {
        actor_type: "human",
        actor_id: "actor-reviewer-001",
      },
      reason: "synthetic test approval",
    });

    expect(WorkItemSchema.safeParse(result.workItem).success).toBe(true);
    expect(AuditEventSchema.safeParse(result.auditEvent).success).toBe(true);
    expect(result.workItem.status).toBe("queued");
    expect(result.workItem.approval).toMatchObject({
      status: "approved",
      approved_by: "actor-reviewer-001",
      approved_at: "2026-06-20T19:30:00Z",
    });
    expect(result.workItem.implementation).toMatchObject({
      state: "queued",
      result_summary: approvedNoticeActionSummary("reconcile_gst_qst_payment_or_refund"),
    });
    expect(result.auditEvent).toMatchObject({
      event_type: "work_item_approved",
      target_id: "notice-action-testapprove001",
      evidence_refs: ["evidence-notice-action-test-001"],
    });
  });

  it("records rejected notice actions without queuing implementation work", () => {
    const proposed = createNoticeActionWorkItem(
      {
        action_id: "notice-action-testreject001",
        action_type: "manual_review",
        priority: "normal",
        summary: "Route this government tax notice to manual review.",
      },
      {
        source: "inline",
        createdAt,
      },
    );

    const result = decideNoticeActionWorkItem(proposed, {
      decision: "rejected",
      decidedAt: "2026-06-20T19:35:00Z",
      actor: {
        actor_type: "human",
        actor_id: "actor-reviewer-001",
      },
      reason: "duplicate notice",
    });

    expect(result.workItem.status).toBe("rejected");
    expect(result.workItem.approval.status).toBe("rejected");
    expect(result.workItem.implementation).toMatchObject({
      state: "rejected_no_action",
      result_summary: "Rejected by reviewer; no action implemented.",
    });
    expect(result.auditEvent.event_type).toBe("work_item_rejected");
    expect(result.auditEvent.workflow_context).toMatchObject({
      previous_status: "proposed",
      new_status: "rejected",
      reason: "duplicate notice",
    });
  });

  it("persists notice action decisions in a durable Core snapshot shape", () => {
    const snapshot = createNoticeActionWorkflowSnapshot({
      source: "sample-data/notices/gst_qst_frequency_change_ocr.txt",
      createdAt,
      evidenceRefs: [noticeEvidence],
      actions: [
        {
          action_type: "update_filing_frequency_configuration",
          priority: "high",
          summary:
            "Review and update GST/QST filing-frequency configuration before the next workpaper run.",
          context: {
            tax_program: "gst_qst",
            filing_frequency: "monthly",
          },
        },
      ],
    });
    const workItemId = snapshot.work_items[0].work_item_id;

    const updated = applyNoticeActionDecisionToSnapshot(snapshot, workItemId, {
      decision: "approved",
      decidedAt: "2026-06-20T19:40:00Z",
      actor: {
        actor_type: "human",
        actor_id: "actor-reviewer-001",
      },
    });
    const serialized = serializeNoticeActionWorkflowSnapshot(updated);
    const reparsed = parseNoticeActionWorkflowSnapshot(serialized);

    expect(reparsed.updated_at).toBe("2026-06-20T19:40:00Z");
    expect(reparsed.work_items).toHaveLength(1);
    expect(reparsed.audit_events).toHaveLength(1);
    expect(reparsed.work_items[0]).toMatchObject({
      work_item_id: workItemId,
      status: "queued",
      approval: {
        status: "approved",
      },
      implementation: {
        state: "queued",
      },
    });
    expect(reparsed.audit_events[0]).toMatchObject({
      event_type: "work_item_approved",
      target_id: workItemId,
    });
  });

  it("rejects stored snapshot decisions for missing work items", () => {
    const snapshot = createNoticeActionWorkflowSnapshot({
      source: "inline",
      createdAt,
      actions: [
        {
          action_type: "manual_review",
          summary: "Route this government tax notice to manual review.",
        },
      ],
    });

    expect(() =>
      applyNoticeActionDecisionToSnapshot(snapshot, "notice-action-missing001", {
        decision: "rejected",
        decidedAt: "2026-06-20T19:45:00Z",
        actor: {
          actor_type: "human",
          actor_id: "actor-reviewer-001",
        },
      }),
    ).toThrow("Notice action work item not found");
  });
});
