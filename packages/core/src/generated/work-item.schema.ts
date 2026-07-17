// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Reviewable proposed, approved, rejected, or queued action emitted by a RedshieldWorks module.*/
export const WorkItemSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    work_item_id: z
      .string()
      .regex(new RegExp("^(work-item|notice-action)-[a-z0-9][a-z0-9-]{6,}$")),
    source_module: z
      .string()
      .regex(new RegExp("^redshieldworks-[a-z0-9][a-z0-9-]*$")),
    work_item_type: z.string().regex(new RegExp("^[a-z0-9][a-z0-9_\\-]*$")),
    priority: z.enum(["low", "normal", "high", "urgent"]),
    summary: z.string().min(1),
    status: z.enum([
      "proposed",
      "waiting_for_approval",
      "approved",
      "rejected",
      "queued",
      "in_progress",
      "implemented_internal_work_item",
      "blocked",
      "cancelled",
      "done",
    ]),
    approval: z
      .object({
        required: z.boolean(),
        status: z.enum([
          "not_required",
          "proposed",
          "approved",
          "rejected",
          "expired",
        ]),
        gate: z.enum([
          "not_required",
          "external_action",
          "financial_action",
          "tax_action",
          "legal_action",
          "privacy_sensitive_action",
          "destructive_action",
          "production_change",
          "public_release",
        ]),
        approved_by: z.string().optional(),
        approved_at: z.string().datetime({ offset: true }).optional(),
      })
      .strict(),
    created_at: z.string().datetime({ offset: true }),
    due_at: z.string().datetime({ offset: true }).optional(),
    evidence_refs: z
      .array(
        z
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
          ),
      )
      .default([]),
    context: z
      .record(
        z.string(),
        z.union([
          z.union([
            z.string(),
            z.number(),
            z.number().int(),
            z.boolean(),
            z.null(),
          ]),
          z.array(
            z.union([
              z.string(),
              z.number(),
              z.number().int(),
              z.boolean(),
              z.null(),
            ]),
          ),
        ]),
      )
      .default({}),
    /**Optional structured context for workflow-backed work items. Complex payloads still belong in referenced artifacts, not inline here.*/
    workflow_context: z
      .object({
        workflow_id: z.string().optional(),
        workflow_type: z
          .string()
          .regex(new RegExp("^[a-z0-9][a-z0-9_\\-]*$"))
          .optional(),
        domain: z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*$")).optional(),
        document_id: z.string().optional(),
        document_version_id: z.string().optional(),
        signature_packet_id: z.string().optional(),
        policy_check_id: z
          .string()
          .regex(new RegExp("^policy-check-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        permission: z
          .string()
          .regex(new RegExp("^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$"))
          .optional(),
        requires_reason: z.boolean().optional(),
        reason: z.string().optional(),
        related_record_ids: z.array(z.string()).default([]),
      })
      .strict()
      .describe(
        "Optional structured context for workflow-backed work items. Complex payloads still belong in referenced artifacts, not inline here.",
      )
      .optional(),
    implementation: z
      .object({
        state: z
          .enum([
            "not_started",
            "waiting_for_approval",
            "queued",
            "implemented_internal_work_item",
            "external_action_required",
            "rejected_no_action",
            "failed",
          ])
          .optional(),
        result_summary: z.string().optional(),
        output_refs: z
          .array(
            z
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
              ),
          )
          .default([]),
      })
      .strict()
      .optional(),
  })
  .strict()
  .describe(
    "Reviewable proposed, approved, rejected, or queued action emitted by a RedshieldWorks module.",
  );
