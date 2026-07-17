// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Project-scoped private intake manifest for sensitive manual uploads or future source-adapter imports before agent processing.*/
export const SecureIntakeSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    intake_id: z
      .string()
      .regex(new RegExp("^secure-intake-[a-z0-9][a-z0-9-]{6,}$")),
    project_ref: z
      .object({
        project_id: z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*$")),
        external_context_id: z.string().min(1).optional(),
        repo_path: z.string().optional(),
        module: z
          .string()
          .regex(new RegExp("^redshieldworks-[a-z0-9][a-z0-9-]*$"))
          .optional(),
      })
      .strict(),
    title: z.string().min(1),
    purpose: z
      .object({
        summary: z.string().min(1),
        desired_outputs: z
          .array(
            z.enum([
              "summary",
              "timeline",
              "evidence_index",
              "todo_list",
              "diagnostics",
              "draft",
              "workpaper",
              "work_items",
              "questions",
            ]),
          )
          .min(1),
      })
      .strict(),
    status: z.enum([
      "draft",
      "agent_populated",
      "awaiting_review",
      "approved_for_processing",
      "processing",
      "completed",
      "blocked",
      "cancelled",
    ]),
    created_by_actor_id: z
      .string()
      .regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$"))
      .optional(),
    created_at: z.string().datetime({ offset: true }),
    visibility: z
      .object({
        sensitivity: z.enum([
          "public",
          "internal",
          "confidential",
          "restricted",
          "secret",
        ]),
        raw_source_storage: z.enum([
          "ignored_private_path",
          "managed_private_storage",
          "external_source_reference_only",
        ]),
        allowed_actor_ids: z
          .array(z.string().regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$")))
          .default([]),
        tenant_id: z.string().optional(),
      })
      .strict(),
    action_boundaries: z
      .object({
        local_parse: z.boolean(),
        ai_processing: z.enum([
          "not_allowed",
          "requires_manifest_approval",
          "approved",
        ]),
        sanitized_fixture_creation: z
          .enum([
            "not_allowed",
            "requires_review_before_commit",
            "approved_for_synthetic_only",
          ])
          .optional(),
        external_transmission: z.enum([
          "not_allowed",
          "requires_explicit_approval",
          "approved",
        ]),
        official_filing_or_payment: z.enum([
          "not_allowed",
          "requires_explicit_approval",
        ]),
      })
      .strict(),
    source_items: z
      .array(
        z
          .object({
            source_item_id: z
              .string()
              .regex(new RegExp("^intake-source-[a-z0-9][a-z0-9-]{6,}$")),
            source_type: z.enum([
              "manual_upload",
              "email_item",
              "cloud_drive_file",
              "local_file",
              "discord_export",
              "accounting_export",
              "banking_export",
              "payroll_export",
              "document_record",
              "other",
            ]),
            source_status: z.enum(["private", "sanitized", "synthetic"]),
            /**Reference to a source artifact, generated artifact, record, document, notice, workpaper, or external evidence without embedding sensitive content.*/
            evidence_ref: z
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
            received_at: z.string().datetime({ offset: true }).optional(),
            processing_allowed: z.boolean(),
            labels: z
              .array(z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*$")))
              .default([]),
            notes: z.string().optional(),
          })
          .strict(),
      )
      .default([]),
    ai_processing: z
      .object({
        allowed_operations: z
          .array(
            z.enum([
              "extract_facts",
              "classify",
              "summarize",
              "build_timeline",
              "generate_diagnostics",
              "ask_questions",
              "draft_text",
              "propose_actions",
              "suggest_evidence_links",
            ]),
          )
          .default([]),
        approval_status: z
          .enum([
            "not_requested",
            "proposed",
            "approved",
            "rejected",
            "expired",
          ])
          .optional(),
        policy_check_ids: z
          .array(
            z
              .string()
              .regex(new RegExp("^policy-check-[a-z0-9][a-z0-9-]{6,}$")),
          )
          .default([]),
        knightwarden_review: z
          .object({
            provider: z.literal("rsk-security-knightwarden"),
            status: z.enum([
              "not_configured",
              "not_requested",
              "requested",
              "allow",
              "needs_approval",
              "deny",
              "unavailable",
            ]),
            review_ref: z.string().optional(),
            risk_level: z
              .enum(["low", "medium", "high", "critical", "unknown"])
              .optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    outputs: z
      .object({
        ai_artifact_ids: z
          .array(
            z.string().regex(new RegExp("^ai-artifact-[a-z0-9][a-z0-9-]{6,}$")),
          )
          .default([]),
        work_item_ids: z
          .array(
            z
              .string()
              .regex(
                new RegExp("^(work-item|notice-action)-[a-z0-9][a-z0-9-]{6,}$"),
              ),
          )
          .default([]),
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
      })
      .strict()
      .optional(),
    review_notes: z.string().optional(),
  })
  .strict()
  .describe(
    "Project-scoped private intake manifest for sensitive manual uploads or future source-adapter imports before agent processing.",
  );
