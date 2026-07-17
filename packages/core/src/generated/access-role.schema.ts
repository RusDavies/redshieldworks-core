// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Named role with permission patterns for a RedshieldWorks organization, workspace, entity, or module.*/
export const AccessRoleSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    role_id: z.string().regex(new RegExp("^role-[a-z0-9][a-z0-9-]{3,}$")),
    name: z.string().min(1),
    description: z.string().optional(),
    scope_type: z.enum([
      "system",
      "organization",
      "workspace",
      "entity",
      "module",
    ]),
    permissions: z
      .array(
        z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$")),
      )
      .min(1)
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      ),
    approval_gates: z
      .array(
        z.enum([
          "external_action",
          "financial_action",
          "tax_action",
          "legal_action",
          "privacy_sensitive_action",
          "destructive_action",
          "production_change",
          "public_release",
        ]),
      )
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      )
      .default([]),
    /**Optional per-permission policy requirements that refine coarse role permission strings.*/
    permission_rules: z
      .array(
        z
          .object({
            permission: z
              .string()
              .regex(new RegExp("^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$")),
            conditions: z
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
            approval_gates: z
              .array(
                z.enum([
                  "external_action",
                  "financial_action",
                  "tax_action",
                  "legal_action",
                  "privacy_sensitive_action",
                  "destructive_action",
                  "production_change",
                  "public_release",
                ]),
              )
              .refine(
                (arr) => arr.every((item, i) => arr.indexOf(item) == i),
                "All items must be unique!",
              )
              .default([]),
            assignment_scope_required: z.boolean().default(false),
            reason_required: z.boolean().default(false),
            human_approval_required: z.boolean().default(false),
          })
          .strict(),
      )
      .describe(
        "Optional per-permission policy requirements that refine coarse role permission strings.",
      )
      .default([]),
    system_role: z.boolean().default(false),
  })
  .strict()
  .describe(
    "Named role with permission patterns for a RedshieldWorks organization, workspace, entity, or module.",
  );
