// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Resource descriptor used for access-control policy checks.*/
export const AccessResourceSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    resource_id: z
      .string()
      .regex(new RegExp("^resource-[a-z0-9][a-z0-9-]{6,}$")),
    resource_type: z.enum([
      "organization",
      "workspace",
      "entity",
      "document",
      "evidence",
      "ledger-entry",
      "tax-workpaper",
      "notice",
      "work-item",
      "vendor",
      "customer",
      "procurement-record",
      "banking-record",
      "minute-book-record",
      "module-config",
      "report",
      "export",
    ]),
    module: z.string().regex(new RegExp("^redshieldworks-[a-z0-9][a-z0-9-]*$")),
    organization_id: z.string().optional(),
    workspace_id: z.string().optional(),
    entity_id: z.string().optional(),
    sensitivity: z.enum([
      "public",
      "internal",
      "confidential",
      "restricted",
      "secret",
    ]),
    labels: z
      .array(z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*$")))
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      )
      .default([]),
    evidence_refs: z.array(z.string()).default([]),
  })
  .strict()
  .describe("Resource descriptor used for access-control policy checks.");
