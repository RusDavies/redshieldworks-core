// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Reviewable proposed, approved, rejected, or queued action emitted by a RedshieldWorks module.
 */
export interface WorkItem {
  schema_version: "0.1.0";
  work_item_id: string;
  source_module: string;
  work_item_type: string;
  priority: "low" | "normal" | "high" | "urgent";
  summary: string;
  status:
    | "proposed"
    | "waiting_for_approval"
    | "approved"
    | "rejected"
    | "queued"
    | "in_progress"
    | "implemented_internal_work_item"
    | "blocked"
    | "cancelled"
    | "done";
  approval: {
    required: boolean;
    status: "not_required" | "proposed" | "approved" | "rejected" | "expired";
    gate:
      | "not_required"
      | "external_action"
      | "financial_action"
      | "tax_action"
      | "legal_action"
      | "privacy_sensitive_action"
      | "destructive_action"
      | "production_change"
      | "public_release";
    approved_by?: string;
    approved_at?: string;
  };
  created_at: string;
  due_at?: string;
  evidence_refs?: RedshieldWorksCoreEvidenceReference[];
  context?: {
    [k: string]: (string | number | boolean | null) | (string | number | boolean | null)[];
  };
  /**
   * Optional structured context for workflow-backed work items. Complex payloads still belong in referenced artifacts, not inline here.
   */
  workflow_context?: {
    workflow_id?: string;
    workflow_type?: string;
    domain?: string;
    document_id?: string;
    document_version_id?: string;
    signature_packet_id?: string;
    policy_check_id?: string;
    permission?: string;
    requires_reason?: boolean;
    reason?: string;
    related_record_ids?: string[];
  };
  implementation?: {
    state?:
      | "not_started"
      | "waiting_for_approval"
      | "queued"
      | "implemented_internal_work_item"
      | "external_action_required"
      | "rejected_no_action"
      | "failed";
    result_summary?: string;
    output_refs?: RedshieldWorksCoreEvidenceReference[];
  };
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
