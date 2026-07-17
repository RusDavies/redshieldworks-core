// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Human, agent, service account, system, or module actor that may request access to a RedshieldWorks resource.*/
export const AccessActorSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    actor_id: z.string().regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$")),
    actor_type: z.enum([
      "human",
      "agent",
      "service_account",
      "system",
      "module",
    ]),
    display_name: z.string().min(1),
    status: z.enum(["active", "suspended", "disabled", "pending"]),
    organization_id: z.string().optional(),
    workspace_ids: z
      .array(z.string())
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      )
      .default([]),
    /**Opaque identity-provider subject, if any.*/
    external_subject: z
      .string()
      .describe("Opaque identity-provider subject, if any.")
      .optional(),
    sensitivity_clearance: z
      .array(
        z.enum(["public", "internal", "confidential", "restricted", "secret"]),
      )
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      )
      .default(["internal"]),
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
  })
  .strict()
  .describe(
    "Human, agent, service account, system, or module actor that may request access to a RedshieldWorks resource.",
  );
