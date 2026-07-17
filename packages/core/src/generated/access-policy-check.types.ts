// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Access-control enforcement hook request/decision for a proposed action on a resource.
 */
export interface AccessPolicyCheck {
  schema_version: "0.1.0";
  policy_check_id: string;
  actor_id: string;
  resource: RedshieldWorksCoreAccessResource;
  permission: string;
  decision: "allow" | "deny" | "needs_approval" | "needs_step_up" | "not_applicable";
  checked_at: string;
  reason?: string;
  matched_grant_ids?: string[];
  approval_gate?:
    | "external_action"
    | "financial_action"
    | "tax_action"
    | "legal_action"
    | "privacy_sensitive_action"
    | "destructive_action"
    | "production_change"
    | "public_release";
  segregation_of_duties?: {
    required?: boolean;
    conflicting_actor_ids?: string[];
    rule?: string;
  };
  /**
   * Structured scope evidence used when a policy decision depends on assignment to a task, document, evidence item, or resource label.
   */
  assignment_scope?: {
    assigned?: boolean;
    scope_type?:
      "organization" | "workspace" | "entity" | "module" | "resource" | "work_item" | "document" | "evidence";
    scope_id?: string;
    scope_label?: string;
  };
  /**
   * Whether the policy decision requires a recorded human-readable reason before execution can continue.
   */
  reason_required?: boolean;
  /**
   * Evidence that a separate human approval gate has approved or must approve the proposed action, including AI-proposal approval boundaries.
   */
  human_approval_evidence?: {
    required?: boolean;
    status?: "not_required" | "required" | "approved" | "rejected" | "expired";
    work_item_id?: string;
    evidence_ref_id?: string;
    approved_by_actor_id?: string;
    approved_at?: string;
  };
  /**
   * Structured policy hook context for AI operations, including future RSK Security Knightwarden review without embedding raw private prompts or source text.
   */
  ai_operation_context?: {
    ai_artifact_id?: string;
    intake_id?: string;
    requested_capability?:
      | "extract_facts"
      | "classify"
      | "summarize"
      | "build_timeline"
      | "generate_diagnostics"
      | "ask_questions"
      | "draft_text"
      | "propose_actions"
      | "suggest_evidence_links";
    source_evidence_ref_ids?: string[];
    intended_output?:
      | "internal_artifact"
      | "internal_work_item"
      | "external_transmission"
      | "financial_action"
      | "tax_action"
      | "legal_action"
      | "public_release";
    data_exposure?: "metadata_only" | "redacted_content" | "private_content" | "external_provider_content";
    knightwarden_review?: {
      provider: "rsk-security-knightwarden";
      status: "not_configured" | "not_requested" | "requested" | "allow" | "needs_approval" | "deny" | "unavailable";
      review_ref?: string;
      risk_level?: "low" | "medium" | "high" | "critical" | "unknown";
    };
  };
  metadata?: {
    [k: string]: string | number | boolean | null;
  };
}
/**
 * Resource descriptor used for access-control policy checks.
 */
export interface RedshieldWorksCoreAccessResource {
  schema_version: "0.1.0";
  resource_id: string;
  resource_type:
    | "organization"
    | "workspace"
    | "entity"
    | "document"
    | "evidence"
    | "ledger-entry"
    | "tax-workpaper"
    | "notice"
    | "work-item"
    | "vendor"
    | "customer"
    | "procurement-record"
    | "banking-record"
    | "minute-book-record"
    | "module-config"
    | "report"
    | "export";
  module: string;
  organization_id?: string;
  workspace_id?: string;
  entity_id?: string;
  sensitivity: "public" | "internal" | "confidential" | "restricted" | "secret";
  labels?: string[];
  evidence_refs?: string[];
}
