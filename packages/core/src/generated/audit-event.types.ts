// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Append-only event describing an import, diagnostic, recommendation, approval, rejection, implementation, or system action.
 */
export interface AuditEvent {
  schema_version: "0.1.0";
  event_id: string;
  event_type:
    | "imported"
    | "classified"
    | "diagnostic_emitted"
    | "work_item_proposed"
    | "work_item_approved"
    | "work_item_rejected"
    | "work_item_implemented"
    | "configuration_changed"
    | "exported"
    | "error";
  occurred_at: string;
  actor: {
    actor_type: "human" | "agent" | "system" | "module";
    actor_id: string;
    display_name?: string;
  };
  module: string;
  summary: string;
  target_type?: string;
  target_id?: string;
  /**
   * Optional module-owned event catalog pointer for precise domain events carried by the Core audit envelope.
   */
  module_event?: {
    catalog?: string;
    catalog_version?: string;
    event_type: string;
    sequence?: number;
  };
  evidence_refs?: string[];
  metadata?: {
    [k: string]: string | number | boolean | null;
  };
  /**
   * Optional structured workflow context for audit events without embedding sensitive document bodies or payloads.
   */
  workflow_context?: {
    workflow_id?: string;
    work_item_id?: string;
    policy_check_id?: string;
    document_id?: string;
    document_version_id?: string;
    export_package_id?: string;
    previous_status?: string;
    new_status?: string;
    reason?: string;
    permission?: string;
  };
}
