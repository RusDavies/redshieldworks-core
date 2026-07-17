// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Metadata and capability declaration for a RedshieldWorks module or plugin.*/
export const ModuleMetadataSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    module_id: z
      .string()
      .regex(new RegExp("^redshieldworks-[a-z0-9][a-z0-9-]*$")),
    name: z.string().min(1),
    version: z
      .string()
      .regex(new RegExp("^[0-9]+\\.[0-9]+\\.[0-9]+(?:[-+][A-Za-z0-9.-]+)?$")),
    status: z.enum([
      "draft",
      "experimental",
      "active",
      "deprecated",
      "retired",
    ]),
    license_boundary: z.enum([
      "open_core",
      "open_module",
      "mixed",
      "paid_module",
      "internal",
    ]),
    description: z.string().optional(),
    capabilities: z
      .array(z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*$")))
      .min(1)
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      ),
    dependencies: z
      .array(
        z.string().regex(new RegExp("^redshieldworks-[a-z0-9][a-z0-9-]*$")),
      )
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      )
      .default([]),
    owners: z
      .array(z.object({ role: z.string(), name: z.string() }).strict())
      .min(1),
    sensitivity: z
      .array(
        z.enum(["public", "internal", "confidential", "restricted", "secret"]),
      )
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      )
      .default(["internal"]),
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
    /**Module-owned standard interchange adapter declarations. Core owns the declaration envelope; modules own the format semantics and implementation.*/
    export_adapters: z
      .array(
        z
          .object({
            adapter_id: z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*$")),
            format_id: z.string().regex(new RegExp("^[a-z0-9][a-z0-9_.-]*$")),
            format_version: z.string().optional(),
            direction: z.enum(["export", "import", "round_trip"]),
            stability: z.enum([
              "experimental",
              "internal",
              "reviewable",
              "supported",
              "certified",
            ]),
            output_kind: z.enum([
              "human_readable",
              "machine_readable",
              "archival",
              "mixed",
            ]),
            record_families: z
              .array(z.string().regex(new RegExp("^[a-z0-9][a-z0-9_\\-]*$")))
              .min(1)
              .refine(
                (arr) => arr.every((item, i) => arr.indexOf(item) == i),
                "All items must be unique!",
              ),
            sensitivity_limit: z
              .enum([
                "public",
                "internal",
                "confidential",
                "restricted",
                "secret",
              ])
              .optional(),
            approval_gate: z
              .enum([
                "external_action",
                "financial_action",
                "tax_action",
                "legal_action",
                "privacy_sensitive_action",
                "destructive_action",
                "production_change",
                "public_release",
              ])
              .optional(),
            /**True only for adapters that create or prepare certified/regulator/bank/registry submissions, which require a separate approval and certification boundary.*/
            official_submission: z
              .boolean()
              .describe(
                "True only for adapters that create or prepare certified/regulator/bank/registry submissions, which require a separate approval and certification boundary.",
              )
              .default(false),
            description: z.string().optional(),
            validation_refs: z
              .array(z.string())
              .refine(
                (arr) => arr.every((item, i) => arr.indexOf(item) == i),
                "All items must be unique!",
              )
              .default([]),
          })
          .strict(),
      )
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      )
      .describe(
        "Module-owned standard interchange adapter declarations. Core owns the declaration envelope; modules own the format semantics and implementation.",
      )
      .default([]),
  })
  .strict()
  .describe(
    "Metadata and capability declaration for a RedshieldWorks module or plugin.",
  );
