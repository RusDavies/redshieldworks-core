// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Reviewable AI-generated workflow artifact with source references, sensitivity, policy hooks, and approval state.*/
export const AiArtifactSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    ai_artifact_id: z
      .string()
      .regex(new RegExp("^ai-artifact-[a-z0-9][a-z0-9-]{6,}$")),
    artifact_type: z.enum([
      "extracted_fact",
      "classification",
      "summary",
      "timeline",
      "diagnostic",
      "question",
      "draft",
      "proposed_action",
      "evidence_link_suggestion",
      "risk_flag",
    ]),
    source_module: z
      .string()
      .regex(new RegExp("^redshieldworks-[a-z0-9][a-z0-9-]*$")),
    intake_id: z
      .string()
      .regex(new RegExp("^secure-intake-[a-z0-9][a-z0-9-]{6,}$"))
      .optional(),
    status: z.enum([
      "proposed",
      "accepted",
      "edited",
      "rejected",
      "superseded",
    ]),
    sensitivity: z.enum([
      "public",
      "internal",
      "confidential",
      "restricted",
      "secret",
    ]),
    operation: z
      .object({
        operation_id: z
          .string()
          .regex(new RegExp("^ai-operation-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        capability: z.enum([
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
        actor_id: z
          .string()
          .regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        model_identity: z.string().optional(),
        tool_identity: z.string().optional(),
        prompt_template_id: z.string().optional(),
      })
      .strict(),
    source_evidence_refs: z
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
      .min(1),
    /**Reference to a source artifact, generated artifact, record, document, notice, workpaper, or external evidence without embedding sensitive content.*/
    content_ref: z
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
      )
      .optional(),
    /**Short review-facing summary. Do not embed raw private source text here.*/
    content_summary: z
      .string()
      .describe(
        "Short review-facing summary. Do not embed raw private source text here.",
      )
      .optional(),
    confidence: z
      .object({
        level: z.enum(["high", "medium", "low", "unknown"]).optional(),
        score: z.number().gte(0).lte(1).optional(),
        notes: z.string().optional(),
      })
      .strict()
      .optional(),
    review: z
      .object({
        required: z.boolean(),
        status: z.enum([
          "not_required",
          "pending",
          "accepted",
          "edited",
          "rejected",
          "expired",
        ]),
        reviewer_actor_id: z
          .string()
          .regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        reviewed_at: z.string().datetime({ offset: true }).optional(),
        reason: z.string().optional(),
      })
      .strict(),
    action_boundary: z
      .object({
        downstream_action: z
          .enum([
            "none",
            "internal_work_item",
            "external_transmission",
            "financial_action",
            "tax_action",
            "legal_action",
            "public_release",
          ])
          .optional(),
        approval_gate: z
          .enum([
            "not_required",
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
      })
      .strict()
      .optional(),
    policy: z
      .object({
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
    audit_event_ids: z
      .array(
        z.string().regex(new RegExp("^audit-event-[a-z0-9][a-z0-9-]{6,}$")),
      )
      .default([]),
    created_at: z.string().datetime({ offset: true }),
  })
  .strict()
  .describe(
    "Reviewable AI-generated workflow artifact with source references, sensitivity, policy hooks, and approval state.",
  );
