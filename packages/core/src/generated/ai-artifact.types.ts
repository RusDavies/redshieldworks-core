// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Reviewable AI-generated workflow artifact with source references, sensitivity, policy hooks, and approval state.
 */
export interface AiArtifact {
  schema_version: "0.1.0";
  ai_artifact_id: string;
  artifact_type:
    | "extracted_fact"
    | "classification"
    | "summary"
    | "timeline"
    | "diagnostic"
    | "question"
    | "draft"
    | "proposed_action"
    | "evidence_link_suggestion"
    | "risk_flag";
  source_module: string;
  intake_id?: string;
  status: "proposed" | "accepted" | "edited" | "rejected" | "superseded";
  sensitivity: "public" | "internal" | "confidential" | "restricted" | "secret";
  operation: {
    operation_id?: string;
    capability:
      | "extract_facts"
      | "classify"
      | "summarize"
      | "build_timeline"
      | "generate_diagnostics"
      | "ask_questions"
      | "draft_text"
      | "propose_actions"
      | "suggest_evidence_links";
    actor_id?: string;
    model_identity?: string;
    tool_identity?: string;
    prompt_template_id?: string;
  };
  /**
   * @minItems 1
   */
  source_evidence_refs: [RedshieldWorksCoreEvidenceReference, ...RedshieldWorksCoreEvidenceReference[]];
  content_ref?: RedshieldWorksCoreEvidenceReference;
  /**
   * Short review-facing summary. Do not embed raw private source text here.
   */
  content_summary?: string;
  confidence?: {
    level?: "high" | "medium" | "low" | "unknown";
    score?: number;
    notes?: string;
  };
  review: {
    required: boolean;
    status: "not_required" | "pending" | "accepted" | "edited" | "rejected" | "expired";
    reviewer_actor_id?: string;
    reviewed_at?: string;
    reason?: string;
  };
  action_boundary?: {
    downstream_action?:
      | "none"
      | "internal_work_item"
      | "external_transmission"
      | "financial_action"
      | "tax_action"
      | "legal_action"
      | "public_release";
    approval_gate?:
      | "not_required"
      | "external_action"
      | "financial_action"
      | "tax_action"
      | "legal_action"
      | "privacy_sensitive_action"
      | "destructive_action"
      | "production_change"
      | "public_release";
  };
  policy?: {
    policy_check_ids?: string[];
    knightwarden_review?: ExternalPolicyReview;
  };
  audit_event_ids?: string[];
  created_at: string;
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
