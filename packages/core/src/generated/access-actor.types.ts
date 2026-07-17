// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Human, agent, service account, system, or module actor that may request access to a RedshieldWorks resource.
 */
export interface AccessActor {
  schema_version: "0.1.0";
  actor_id: string;
  actor_type: "human" | "agent" | "service_account" | "system" | "module";
  display_name: string;
  status: "active" | "suspended" | "disabled" | "pending";
  organization_id?: string;
  workspace_ids?: string[];
  /**
   * Opaque identity-provider subject, if any.
   */
  external_subject?: string;
  sensitivity_clearance?: ("public" | "internal" | "confidential" | "restricted" | "secret")[];
  metadata?: {
    [k: string]: string | number | boolean | null;
  };
}
