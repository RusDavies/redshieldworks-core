// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Reference to a source artifact, generated artifact, record, document, notice, workpaper, or external evidence without embedding sensitive content.*/
export const EvidenceReferenceSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    evidence_id: z
      .string()
      .regex(new RegExp("^evidence-[a-z0-9][a-z0-9-]{6,}$")),
    evidence_type: z.enum([
      "source_file",
      "generated_artifact",
      "external_record",
      "notice",
      "workpaper",
      "ledger_entry",
      "diagnostic",
      "work_item",
      "audit_event",
      "document",
      "document_version",
      "export_package",
      "structured_record",
    ]),
    source: z
      .object({
        location_type: z.enum([
          "repo_path",
          "private_path",
          "external_system",
          "generated_output",
          "opaque_reference",
        ]),
        locator: z.string().min(1),
        display_name: z.string().optional(),
        content_hash: z.string().optional(),
      })
      .strict(),
    sensitivity: z.enum([
      "public",
      "internal",
      "confidential",
      "restricted",
      "secret",
    ]),
    /**Optional JSON pointer, CSV row identifier, page number, or record locator inside the source.*/
    record_path: z
      .string()
      .describe(
        "Optional JSON pointer, CSV row identifier, page number, or record locator inside the source.",
      )
      .optional(),
    created_at: z.string().datetime({ offset: true }).optional(),
    retention_label: z.string().optional(),
    /**Optional structured pointer to the business artifact represented by this evidence reference.*/
    artifact: z
      .object({
        document_id: z.string().optional(),
        document_version_id: z.string().optional(),
        export_package_id: z.string().optional(),
        structured_record_type: z
          .string()
          .regex(new RegExp("^[a-z0-9][a-z0-9_\\-]*$"))
          .optional(),
        structured_record_id: z.string().optional(),
        workflow_id: z.string().optional(),
        content_role: z
          .enum([
            "source",
            "generated",
            "signed_final",
            "derived",
            "index",
            "supporting",
          ])
          .optional(),
      })
      .strict()
      .describe(
        "Optional structured pointer to the business artifact represented by this evidence reference.",
      )
      .optional(),
    notes: z.string().optional(),
  })
  .strict()
  .describe(
    "Reference to a source artifact, generated artifact, record, document, notice, workpaper, or external evidence without embedding sensitive content.",
  );
