// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Metadata and capability declaration for a RedshieldWorks module or plugin.
 */
export interface ModuleMetadata {
  schema_version: "0.1.0";
  module_id: string;
  name: string;
  version: string;
  status: "draft" | "experimental" | "active" | "deprecated" | "retired";
  license_boundary: "open_core" | "open_module" | "mixed" | "paid_module" | "internal";
  description?: string;
  /**
   * @minItems 1
   */
  capabilities: [string, ...string[]];
  dependencies?: string[];
  /**
   * @minItems 1
   */
  owners: [
    {
      role: string;
      name: string;
    },
    ...{
      role: string;
      name: string;
    }[]
  ];
  sensitivity?: ("public" | "internal" | "confidential" | "restricted" | "secret")[];
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
   * Module-owned standard interchange adapter declarations. Core owns the declaration envelope; modules own the format semantics and implementation.
   */
  export_adapters?: {
    adapter_id: string;
    format_id: string;
    format_version?: string;
    direction: "export" | "import" | "round_trip";
    stability: "experimental" | "internal" | "reviewable" | "supported" | "certified";
    output_kind: "human_readable" | "machine_readable" | "archival" | "mixed";
    /**
     * @minItems 1
     */
    record_families: [string, ...string[]];
    sensitivity_limit?: "public" | "internal" | "confidential" | "restricted" | "secret";
    approval_gate?:
      | "external_action"
      | "financial_action"
      | "tax_action"
      | "legal_action"
      | "privacy_sensitive_action"
      | "destructive_action"
      | "production_change"
      | "public_release";
    /**
     * True only for adapters that create or prepare certified/regulator/bank/registry submissions, which require a separate approval and certification boundary.
     */
    official_submission?: boolean;
    description?: string;
    validation_refs?: string[];
  }[];
}
