// Generated from schemas/core/*.schema.json. Do not edit by hand.

/**
 * Grant assigning a role or direct permission to an actor over a resource scope.
 */
export type AccessPermissionGrant =
  | {
      schema_version: "0.1.0";
      grant_id: string;
      actor_id: string;
      grant_type: "role";
      role_id: string;
      scope: {
        scope_type: "organization" | "workspace" | "entity" | "module" | "resource";
        scope_id: string;
      };
      effect: "allow" | "deny";
      created_at: string;
      expires_at?: string;
      conditions?: {
        [k: string]: string | number | boolean | null;
      };
      /**
       * Optional structured assignment scope for grants that must be limited to assigned resources or labels.
       */
      assignment_scope?: {
        assigned_actor_required?: boolean;
        scope_type?:
          "organization" | "workspace" | "entity" | "module" | "resource" | "work_item" | "document" | "evidence";
        resource_ids?: string[];
        label_filter?: string[];
      };
      reason_required?: boolean;
      human_approval_required?: boolean;
      created_by?: string;
    }
  | {
      schema_version: "0.1.0";
      grant_id: string;
      actor_id: string;
      grant_type: "direct_permission";
      /**
       * @minItems 1
       */
      permissions: [string, ...string[]];
      scope: {
        scope_type: "organization" | "workspace" | "entity" | "module" | "resource";
        scope_id: string;
      };
      effect: "allow" | "deny";
      created_at: string;
      expires_at?: string;
      conditions?: {
        [k: string]: string | number | boolean | null;
      };
      /**
       * Optional structured assignment scope for grants that must be limited to assigned resources or labels.
       */
      assignment_scope?: {
        assigned_actor_required?: boolean;
        scope_type?:
          "organization" | "workspace" | "entity" | "module" | "resource" | "work_item" | "document" | "evidence";
        resource_ids?: string[];
        label_filter?: string[];
      };
      reason_required?: boolean;
      human_approval_required?: boolean;
      created_by?: string;
    };
