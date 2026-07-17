// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Grant assigning a role or direct permission to an actor over a resource scope.*/
export const AccessPermissionGrantSchema = z
  .any()
  .superRefine((x, ctx) => {
    const schemas = [
      z
        .object({
          schema_version: z.literal("0.1.0"),
          grant_id: z
            .string()
            .regex(new RegExp("^permission-grant-[a-z0-9][a-z0-9-]{6,}$")),
          actor_id: z
            .string()
            .regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$")),
          grant_type: z.literal("role"),
          role_id: z.string().regex(new RegExp("^role-[a-z0-9][a-z0-9-]{3,}$")),
          scope: z
            .object({
              scope_type: z.enum([
                "organization",
                "workspace",
                "entity",
                "module",
                "resource",
              ]),
              scope_id: z.string().min(1),
            })
            .strict(),
          effect: z.enum(["allow", "deny"]),
          created_at: z.string().datetime({ offset: true }),
          expires_at: z.string().datetime({ offset: true }).optional(),
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
          /**Optional structured assignment scope for grants that must be limited to assigned resources or labels.*/
          assignment_scope: z
            .object({
              assigned_actor_required: z.boolean().default(false),
              scope_type: z
                .enum([
                  "organization",
                  "workspace",
                  "entity",
                  "module",
                  "resource",
                  "work_item",
                  "document",
                  "evidence",
                ])
                .optional(),
              resource_ids: z
                .array(z.string())
                .refine(
                  (arr) => arr.every((item, i) => arr.indexOf(item) == i),
                  "All items must be unique!",
                )
                .default([]),
              label_filter: z
                .array(z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*$")))
                .refine(
                  (arr) => arr.every((item, i) => arr.indexOf(item) == i),
                  "All items must be unique!",
                )
                .default([]),
            })
            .strict()
            .describe(
              "Optional structured assignment scope for grants that must be limited to assigned resources or labels.",
            )
            .optional(),
          reason_required: z.boolean().default(false),
          human_approval_required: z.boolean().default(false),
          created_by: z.string().optional(),
        })
        .strict(),
      z
        .object({
          schema_version: z.literal("0.1.0"),
          grant_id: z
            .string()
            .regex(new RegExp("^permission-grant-[a-z0-9][a-z0-9-]{6,}$")),
          actor_id: z
            .string()
            .regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$")),
          grant_type: z.literal("direct_permission"),
          permissions: z
            .array(
              z
                .string()
                .regex(new RegExp("^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$")),
            )
            .min(1)
            .refine(
              (arr) => arr.every((item, i) => arr.indexOf(item) == i),
              "All items must be unique!",
            ),
          scope: z
            .object({
              scope_type: z.enum([
                "organization",
                "workspace",
                "entity",
                "module",
                "resource",
              ]),
              scope_id: z.string().min(1),
            })
            .strict(),
          effect: z.enum(["allow", "deny"]),
          created_at: z.string().datetime({ offset: true }),
          expires_at: z.string().datetime({ offset: true }).optional(),
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
          /**Optional structured assignment scope for grants that must be limited to assigned resources or labels.*/
          assignment_scope: z
            .object({
              assigned_actor_required: z.boolean().default(false),
              scope_type: z
                .enum([
                  "organization",
                  "workspace",
                  "entity",
                  "module",
                  "resource",
                  "work_item",
                  "document",
                  "evidence",
                ])
                .optional(),
              resource_ids: z
                .array(z.string())
                .refine(
                  (arr) => arr.every((item, i) => arr.indexOf(item) == i),
                  "All items must be unique!",
                )
                .default([]),
              label_filter: z
                .array(z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*$")))
                .refine(
                  (arr) => arr.every((item, i) => arr.indexOf(item) == i),
                  "All items must be unique!",
                )
                .default([]),
            })
            .strict()
            .describe(
              "Optional structured assignment scope for grants that must be limited to assigned resources or labels.",
            )
            .optional(),
          reason_required: z.boolean().default(false),
          human_approval_required: z.boolean().default(false),
          created_by: z.string().optional(),
        })
        .strict(),
    ];
    const { errors, failed } = schemas.reduce<{
      errors: z.core.$ZodIssue[];
      failed: number;
    }>(
      ({ errors, failed }, schema) =>
        ((result) =>
          result.error
            ? {
                errors: [...errors, ...result.error.issues],
                failed: failed + 1,
              }
            : { errors, failed })(schema.safeParse(x)),
      { errors: [], failed: 0 },
    );
    const passed = schemas.length - failed;
    if (passed !== 1) {
      ctx.addIssue(
        errors.length
          ? {
              path: [],
              code: "invalid_union",
              errors: [errors],
              message:
                "Invalid input: Should pass single schema. Passed " + passed,
            }
          : {
              path: [],
              code: "custom",
              errors: [errors],
              message:
                "Invalid input: Should pass single schema. Passed " + passed,
            },
      );
    }
  })
  .describe(
    "Grant assigning a role or direct permission to an actor over a resource scope.",
  );
