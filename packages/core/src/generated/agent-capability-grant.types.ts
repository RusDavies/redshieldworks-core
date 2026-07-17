// Generated from schemas/core/*.schema.json. Do not edit by hand.

export type AgentSecureIntakeAction =
  "create_secure_intake" | "register_intake_source" | "upload_intake_material" | "finalize_agent_populated_intake";
export type SourceClass =
  | "email_item"
  | "cloud_drive_file"
  | "local_file"
  | "discord_export"
  | "accounting_export"
  | "banking_export"
  | "payroll_export"
  | "document_record"
  | "manual_upload"
  | "other";
export type Sensitivity = "public" | "internal" | "confidential" | "restricted" | "secret";
export type AiCapability =
  | "extract_facts"
  | "classify"
  | "summarize"
  | "build_timeline"
  | "generate_diagnostics"
  | "ask_questions"
  | "draft_text"
  | "propose_actions"
  | "suggest_evidence_links";

/**
 * Delegated, sender-constrained grant allowing an agent or service workload to create or populate a secure intake within explicit scope limits.
 */
export interface AgentCapabilityGrant {
  schema_version: "0.1.0";
  grant_id: string;
  grant_profile: "rsk-agent-capability-grant.v0";
  issuer: string;
  issued_at: string;
  not_before?: string;
  expires_at: string;
  audience: "redshieldworks-core";
  workload: {
    workload_id: string;
    workload_issuer: string;
    actor_id?: string;
  };
  delegation: {
    delegation_id: string;
    source_type: "human_user" | "workflow" | "service_account" | "policy_decision";
    authorizing_actor_id?: string;
    authorizing_workflow_id?: string;
    purpose: string;
  };
  scope: {
    project_id: string;
    secure_intake_session_id?: string;
    account_id?: string;
    channel_id?: string;
  };
  /**
   * @minItems 1
   */
  allowed_actions: [AgentSecureIntakeAction, ...AgentSecureIntakeAction[]];
  limits: {
    /**
     * @minItems 1
     */
    source_classes: [SourceClass, ...SourceClass[]];
    max_sensitivity: Sensitivity;
    content_access: "metadata_only" | "redacted_content" | "raw_content_reference";
    ai_processing: "not_allowed" | "requires_manifest_approval" | "may_start_after_policy_allow";
    max_source_items?: number;
    allowed_operations?: AiCapability[];
  };
  policy_review?: {
    required: boolean;
    provider?: "rsk-security-knightwarden" | "product-local-policy";
    status: "not_required" | "required_before_ingestion" | "allowed" | "denied" | "unavailable";
    policy_decision_id?: string;
  };
  sender_constraint: {
    sender_constraint_id: string;
    method: "hmac-sha256-test" | "jws-dpop" | "mtls" | "spiffe";
  };
  revocation_status_ref: string;
  audit_correlation: {
    correlation_id: string;
    request_context_hash?: string;
    attestation_result_id?: string;
  };
}
