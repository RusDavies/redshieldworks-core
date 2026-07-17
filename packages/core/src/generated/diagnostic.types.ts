// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Reviewable diagnostic emitted by a parser, module, workflow, privacy check, security check, or operational process.
 */
export interface Diagnostic {
  schema_version: "0.1.0";
  diagnostic_id: string;
  module: string;
  area?:
    | "parser"
    | "ledger"
    | "tax"
    | "docs"
    | "banking"
    | "customers"
    | "minute_book"
    | "privacy"
    | "security"
    | "operations"
    | "integration";
  severity: "info" | "warning" | "error" | "critical";
  code: string;
  message: string;
  created_at: string;
  status?: "open" | "acknowledged" | "resolved" | "accepted_risk" | "false_positive";
  evidence_refs?: RedshieldWorksCoreEvidenceReference[];
  context?: {
    [k: string]: string | number | boolean | null;
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
