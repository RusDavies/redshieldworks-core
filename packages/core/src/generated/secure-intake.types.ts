// Generated from schemas/core/*.schema.json. Do not edit by hand.

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
 * Project-scoped private intake manifest for sensitive manual uploads or future source-adapter imports before agent processing.
 */
export interface SecureIntake {
  schema_version: "0.1.0";
  intake_id: string;
  project_ref: {
    project_id: string;
    external_context_id?: string;
    repo_path?: string;
    module?: string;
  };
  title: string;
  purpose: {
    summary: string;
    /**
     * @minItems 1
     */
    desired_outputs: [
      (
        | "summary"
        | "timeline"
        | "evidence_index"
        | "todo_list"
        | "diagnostics"
        | "draft"
        | "workpaper"
        | "work_items"
        | "questions"
      ),
      ...(
        | "summary"
        | "timeline"
        | "evidence_index"
        | "todo_list"
        | "diagnostics"
        | "draft"
        | "workpaper"
        | "work_items"
        | "questions"
      )[]
    ];
  };
  status:
    | "draft"
    | "agent_populated"
    | "awaiting_review"
    | "approved_for_processing"
    | "processing"
    | "completed"
    | "blocked"
    | "cancelled";
  created_by_actor_id?: string;
  created_at: string;
  visibility: {
    sensitivity: Sensitivity;
    raw_source_storage: "ignored_private_path" | "managed_private_storage" | "external_source_reference_only";
    allowed_actor_ids?: string[];
    tenant_id?: string;
  };
  action_boundaries: {
    local_parse: boolean;
    ai_processing: "not_allowed" | "requires_manifest_approval" | "approved";
    sanitized_fixture_creation?: "not_allowed" | "requires_review_before_commit" | "approved_for_synthetic_only";
    external_transmission: "not_allowed" | "requires_explicit_approval" | "approved";
    official_filing_or_payment: "not_allowed" | "requires_explicit_approval";
  };
  source_items: SourceItem[];
  ai_processing?: {
    allowed_operations?: AiCapability[];
    approval_status?: "not_requested" | "proposed" | "approved" | "rejected" | "expired";
    policy_check_ids?: string[];
    knightwarden_review?: ExternalPolicyReview;
  };
  outputs?: {
    ai_artifact_ids?: string[];
    work_item_ids?: string[];
    evidence_refs?: RedshieldWorksCoreEvidenceReference[];
  };
  review_notes?: string;
}
export interface SourceItem {
  source_item_id: string;
  source_type:
    | "manual_upload"
    | "email_item"
    | "cloud_drive_file"
    | "local_file"
    | "discord_export"
    | "accounting_export"
    | "banking_export"
    | "payroll_export"
    | "document_record"
    | "other";
  source_status: "private" | "sanitized" | "synthetic";
  evidence_ref: RedshieldWorksCoreEvidenceReference;
  received_at?: string;
  processing_allowed: boolean;
  labels?: string[];
  notes?: string;
}
/**
 * Reference to a source artifact, generated artifact, record, document, notice, workpaper, or external evidence without embedding sensitive content.
 */
export interface RedshieldWorksCoreEvidenceReference {
  schema_version: "0.1.0";
  evidence_id: string;
  evidence_type:
    | "source_file"
    | "generated_artifact"
    | "external_record"
    | "notice"
    | "workpaper"
    | "ledger_entry"
    | "diagnostic"
    | "work_item"
    | "audit_event"
    | "document"
    | "document_version"
    | "export_package"
    | "structured_record";
  source: {
    location_type: "repo_path" | "private_path" | "external_system" | "generated_output" | "opaque_reference";
    locator: string;
    display_name?: string;
    content_hash?: string;
  };
  sensitivity: "public" | "internal" | "confidential" | "restricted" | "secret";
  /**
   * Optional JSON pointer, CSV row identifier, page number, or record locator inside the source.
   */
  record_path?: string;
  created_at?: string;
  retention_label?: string;
  /**
   * Optional structured pointer to the business artifact represented by this evidence reference.
   */
  artifact?: {
    document_id?: string;
    document_version_id?: string;
    export_package_id?: string;
    structured_record_type?: string;
    structured_record_id?: string;
    workflow_id?: string;
    content_role?: "source" | "generated" | "signed_final" | "derived" | "index" | "supporting";
  };
  notes?: string;
}
export interface ExternalPolicyReview {
  provider: "rsk-security-knightwarden";
  status: "not_configured" | "not_requested" | "requested" | "allow" | "needs_approval" | "deny" | "unavailable";
  review_ref?: string;
  risk_level?: "low" | "medium" | "high" | "critical" | "unknown";
}
