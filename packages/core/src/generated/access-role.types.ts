// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Named role with permission patterns for a RedshieldWorks organization, workspace, entity, or module.
 */
export interface AccessRole {
  schema_version: "0.1.0";
  role_id: string;
  name: string;
  description?: string;
  scope_type: "system" | "organization" | "workspace" | "entity" | "module";
  /**
   * @minItems 1
   */
  permissions: [string, ...string[]];
  approval_gates?: (
    | "external_action"
    | "financial_action"
    | "tax_action"
    | "legal_action"
    | "privacy_sensitive_action"
    | "destructive_action"
    | "production_change"
    | "public_release"
  )[];
  /**
   * Optional per-permission policy requirements that refine coarse role permission strings.
   */
  permission_rules?: {
    permission: string;
    conditions?: {
      [k: string]: string | number | boolean | null;
    };
    approval_gates?: (
      | "external_action"
      | "financial_action"
      | "tax_action"
      | "legal_action"
      | "privacy_sensitive_action"
      | "destructive_action"
      | "production_change"
      | "public_release"
    )[];
    assignment_scope_required?: boolean;
    reason_required?: boolean;
    human_approval_required?: boolean;
  }[];
  system_role?: boolean;
}
