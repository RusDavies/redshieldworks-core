// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Append-only event describing an import, diagnostic, recommendation, approval, rejection, implementation, or system action.*/
export const AuditEventSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    event_id: z
      .string()
      .regex(new RegExp("^audit-event-[a-z0-9][a-z0-9-]{6,}$")),
    event_type: z.enum([
      "imported",
      "classified",
      "diagnostic_emitted",
      "work_item_proposed",
      "work_item_approved",
      "work_item_rejected",
      "work_item_implemented",
      "configuration_changed",
      "exported",
      "error",
    ]),
    occurred_at: z.string().datetime({ offset: true }),
    actor: z
      .object({
        actor_type: z.enum(["human", "agent", "system", "module"]),
        actor_id: z.string().min(1),
        display_name: z.string().optional(),
      })
      .strict(),
    module: z.string().regex(new RegExp("^redshieldworks-[a-z0-9][a-z0-9-]*$")),
    summary: z.string().min(1),
    target_type: z.string().optional(),
    target_id: z.string().optional(),
    /**Optional module-owned event catalog pointer for precise domain events carried by the Core audit envelope.*/
    module_event: z
      .object({
        catalog: z
          .string()
          .regex(new RegExp("^[a-z0-9][a-z0-9_\\-]*$"))
          .optional(),
        catalog_version: z.string().optional(),
        event_type: z
          .string()
          .regex(
            new RegExp("^[a-z0-9][a-z0-9_\\-]*(\\.[a-z0-9][a-z0-9_\\-]*)+$"),
          ),
        sequence: z.number().int().gte(0).optional(),
      })
      .strict()
      .describe(
        "Optional module-owned event catalog pointer for precise domain events carried by the Core audit envelope.",
      )
      .optional(),
    evidence_refs: z.array(z.string()).default([]),
    metadata: z
      .record(
        z.string(),
        z.union([
          z.string(),
          z.number(),
          z.number().int(),
          z.boolean(),
          z.null(),
        ]),
      )
      .default({}),
    /**Optional structured workflow context for audit events without embedding sensitive document bodies or payloads.*/
    workflow_context: z
      .object({
        workflow_id: z.string().optional(),
        work_item_id: z
          .string()
          .regex(
            new RegExp("^(work-item|notice-action)-[a-z0-9][a-z0-9-]{6,}$"),
          )
          .optional(),
        policy_check_id: z
          .string()
          .regex(new RegExp("^policy-check-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        document_id: z.string().optional(),
        document_version_id: z.string().optional(),
        export_package_id: z.string().optional(),
        previous_status: z.string().optional(),
        new_status: z.string().optional(),
        reason: z.string().optional(),
        permission: z
          .string()
          .regex(new RegExp("^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$"))
          .optional(),
      })
      .strict()
      .describe(
        "Optional structured workflow context for audit events without embedding sensitive document bodies or payloads.",
      )
      .optional(),
  })
  .strict()
  .describe(
    "Append-only event describing an import, diagnostic, recommendation, approval, rejection, implementation, or system action.",
  );
