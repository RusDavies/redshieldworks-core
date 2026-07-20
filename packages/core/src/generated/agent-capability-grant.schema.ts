// Generated from schemas/core/*.schema.json. Do not edit by hand.
import { z } from "zod";

/**Delegated, sender-constrained grant allowing an agent or service workload to create or populate a RedshieldWorks secure intake within explicit scope limits.*/
export const AgentCapabilityGrantSchema = z
  .object({
    schema_version: z.literal("0.1.0"),
    grant_id: z
      .string()
      .regex(new RegExp("^agent-capability-grant-[a-z0-9][a-z0-9-]{6,}$")),
    grant_profile: z.literal("redshieldworks-agent-capability-grant.v0"),
    issuer: z.string().min(1),
    issued_at: z.string().datetime({ offset: true }),
    not_before: z.string().datetime({ offset: true }).optional(),
    expires_at: z.string().datetime({ offset: true }),
    audience: z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]{2,}$")),
    workload: z
      .object({
        workload_id: z.string().min(1),
        workload_issuer: z.string().min(1),
        actor_id: z
          .string()
          .regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
      })
      .strict(),
    delegation: z
      .object({
        delegation_id: z
          .string()
          .regex(new RegExp("^delegation-[a-z0-9][a-z0-9-]{6,}$")),
        source_type: z.enum([
          "human_user",
          "workflow",
          "service_account",
          "policy_decision",
        ]),
        authorizing_actor_id: z
          .string()
          .regex(new RegExp("^actor-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        authorizing_workflow_id: z
          .string()
          .regex(new RegExp("^workflow-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        purpose: z.string().min(1),
      })
      .strict(),
    scope: z
      .object({
        project_id: z.string().regex(new RegExp("^[a-z0-9][a-z0-9-]*$")),
        secure_intake_session_id: z
          .string()
          .regex(new RegExp("^secure-intake-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
        account_id: z.string().min(1).optional(),
        channel_id: z.string().regex(new RegExp("^[0-9]{10,}$")).optional(),
      })
      .strict(),
    allowed_actions: z
      .array(
        z.enum([
          "create_secure_intake",
          "register_intake_source",
          "upload_intake_material",
          "finalize_agent_populated_intake",
        ]),
      )
      .min(1)
      .refine(
        (arr) => arr.every((item, i) => arr.indexOf(item) == i),
        "All items must be unique!",
      ),
    limits: z
      .object({
        source_classes: z
          .array(
            z.enum([
              "email_item",
              "cloud_drive_file",
              "local_file",
              "discord_export",
              "accounting_export",
              "banking_export",
              "payroll_export",
              "document_record",
              "manual_upload",
              "other",
            ]),
          )
          .min(1)
          .refine(
            (arr) => arr.every((item, i) => arr.indexOf(item) == i),
            "All items must be unique!",
          ),
        max_sensitivity: z.enum([
          "public",
          "internal",
          "confidential",
          "restricted",
          "secret",
        ]),
        content_access: z.enum([
          "metadata_only",
          "redacted_content",
          "raw_content_reference",
        ]),
        ai_processing: z.enum([
          "not_allowed",
          "requires_manifest_approval",
          "may_start_after_policy_allow",
        ]),
        max_source_items: z.number().int().gte(1).optional(),
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
          .refine(
            (arr) => arr.every((item, i) => arr.indexOf(item) == i),
            "All items must be unique!",
          )
          .default([]),
      })
      .strict(),
    policy_review: z
      .object({
        required: z.boolean(),
        provider: z
          .enum(["rsk-security-knightwarden", "product-local-policy"])
          .optional(),
        status: z.enum([
          "not_required",
          "required_before_ingestion",
          "allowed",
          "denied",
          "unavailable",
        ]),
        policy_decision_id: z
          .string()
          .regex(new RegExp("^policy-decision-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
      })
      .strict()
      .optional(),
    sender_constraint: z
      .object({
        sender_constraint_id: z
          .string()
          .regex(new RegExp("^sender-[a-z0-9][a-z0-9-]{6,}$")),
        method: z.enum(["hmac-sha256-test", "jws-dpop", "mtls", "spiffe"]),
      })
      .strict(),
    revocation_status_ref: z
      .string()
      .regex(new RegExp("^grant-status-[a-z0-9][a-z0-9-]{6,}$")),
    audit_correlation: z
      .object({
        correlation_id: z
          .string()
          .regex(new RegExp("^audit-correlation-[a-z0-9][a-z0-9-]{6,}$")),
        request_context_hash: z
          .string()
          .regex(new RegExp("^[0-9a-f]{32,128}$"))
          .optional(),
        attestation_result_id: z
          .string()
          .regex(new RegExp("^attestation-[a-z0-9][a-z0-9-]{6,}$"))
          .optional(),
      })
      .strict(),
  })
  .strict()
  .describe(
    "Delegated, sender-constrained grant allowing an agent or service workload to create or populate a RedshieldWorks secure intake within explicit scope limits.",
  );
