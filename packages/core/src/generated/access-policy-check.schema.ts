// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Access-control enforcement hook request/decision for a proposed action on a resource.*/
export const AccessPolicyCheckSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    policy_check_id: z
      .string()
      .regex(new RegExp("^policy-check-[a-z0-9][a-z0-9-]{6,}$")),
    actor_id: z.string().regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$")),
    /**Resource descriptor used for access-control policy checks.*/
    resource: z
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
        module: z
          .string()
          .regex(new RegExp("^redshieldworks-[a-z0-9][a-z0-9-]*$")),
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
      .describe("Resource descriptor used for access-control policy checks."),
    permission: z
      .string()
      .regex(new RegExp("^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$")),
    decision: z.enum([
      "allow",
      "deny",
      "needs_approval",
      "needs_step_up",
      "not_applicable",
    ]),
    checked_at: z.string().datetime({ offset: true }),
    reason: z.string().optional(),
    matched_grant_ids: z.array(z.string()).default([]),
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
    segregation_of_duties: z
      .object({
        required: z.boolean().optional(),
        conflicting_actor_ids: z.array(z.string()).default([]),
        rule: z.string().optional(),
      })
      .strict()
      .optional(),
    /**Structured scope evidence used when a policy decision depends on assignment to a task, document, evidence item, or resource label.*/
    assignment_scope: z
      .object({
        assigned: z.boolean().optional(),
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
        scope_id: z.string().optional(),
        scope_label: z
          .string()
          .regex(new RegExp("^[a-z0-9][a-z0-9-]*$"))
          .optional(),
      })
      .strict()
      .describe(
        "Structured scope evidence used when a policy decision depends on assignment to a task, document, evidence item, or resource label.",
      )
      .optional(),
    /**Whether the policy decision requires a recorded human-readable reason before execution can continue.*/
    reason_required: z
      .boolean()
      .describe(
        "Whether the policy decision requires a recorded human-readable reason before execution can continue.",
      )
      .default(false),
    /**Evidence that a separate human approval gate has approved or must approve the proposed action, including AI-proposal approval boundaries.*/
    human_approval_evidence: z
      .object({
        required: z.boolean().default(false),
        status: z
          .enum(["not_required", "required", "approved", "rejected", "expired"])
          .optional(),
        work_item_id: z
          .string()
          .regex(
            new RegExp("^(work-item|notice-action)-[a-z0-9][a-z0-9-]{6,}$"),
          )
          .optional(),
        evidence_ref_id: z
          .string()
          .regex(new RegExp("^evidence-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        approved_by_actor_id: z
          .string()
          .regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        approved_at: z.string().datetime({ offset: true }).optional(),
      })
      .strict()
      .describe(
        "Evidence that a separate human approval gate has approved or must approve the proposed action, including AI-proposal approval boundaries.",
      )
      .optional(),
    /**Structured policy hook context for AI operations, including future RSK Security Knightwarden review without embedding raw private prompts or source text.*/
    ai_operation_context: z
      .object({
        ai_artifact_id: z
          .string()
          .regex(new RegExp("^ai-artifact-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        intake_id: z
          .string()
          .regex(new RegExp("^secure-intake-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        requested_capability: z
          .enum([
            "extract_facts",
            "classify",
            "summarize",
            "build_timeline",
            "generate_diagnostics",
            "ask_questions",
            "draft_text",
            "propose_actions",
            "suggest_evidence_links",
          ])
          .optional(),
        source_evidence_ref_ids: z
          .array(
            z.string().regex(new RegExp("^evidence-[a-z0-9][a-z0-9-]{6,}$")),
          )
          .default([]),
        intended_output: z
          .enum([
            "internal_artifact",
            "internal_work_item",
            "external_transmission",
            "financial_action",
            "tax_action",
            "legal_action",
            "public_release",
          ])
          .optional(),
        data_exposure: z
          .enum([
            "metadata_only",
            "redacted_content",
            "private_content",
            "external_provider_content",
          ])
          .optional(),
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
      .describe(
        "Structured policy hook context for AI operations, including future RSK Security Knightwarden review without embedding raw private prompts or source text.",
      )
      .optional(),
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
    "Access-control enforcement hook request/decision for a proposed action on a resource.",
  );
