// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Resource descriptor used for access-control policy checks.
 */
export interface AccessResource {
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
