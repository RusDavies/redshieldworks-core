# RedshieldWorks Core Contracts

## Purpose

These draft schemas define the first shared RedshieldWorks Core contracts. They are not yet enforced by code, but they give the current prototype a target shape before modules are split.

The immediate goal is to make Ledger, Tax, Docs, Customers, Banking, and Minute Book modules exchange reviewable work without inventing incompatible JSON blobs in every corner like tiny paperwork anarchists.

## Schemas

Schemas live under `schemas/core/`.

| Schema                                | Purpose                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `module-metadata.schema.json`         | Declares a module/plugin, its capabilities, ownership, sensitivity, dependencies, and optional standard interchange export adapters.  |
| `evidence-reference.schema.json`      | References source files, generated artifacts, records, notices, workpapers, or external evidence without embedding sensitive content. |
| `diagnostic.schema.json`              | Standardizes parser, accounting, tax, document, privacy, security, and operational diagnostics.                                       |
| `work-item.schema.json`               | Standardizes proposed/approved/rejected/queued work items and their approval gates.                                                   |
| `audit-event.schema.json`             | Standardizes append-only events around imports, diagnostics, recommendations, approvals, rejections, and implementations.             |
| `access-actor.schema.json`            | Human, agent, service account, system, or module actor.                                                                               |
| `access-role.schema.json`             | Named role with permission patterns and approval gates.                                                                               |
| `access-resource.schema.json`         | Resource descriptor used in policy checks.                                                                                            |
| `access-permission-grant.schema.json` | Role or direct permission grant over an organization, workspace, entity, module, or resource scope.                                   |
| `access-policy-check.schema.json`     | Enforcement hook request/decision for an actor attempting an action on a resource.                                                    |
| `secure-intake.schema.json`           | Project-scoped private intake manifest for manual upload and future source-adapter imports before agent processing.                   |
| `ai-artifact.schema.json`             | Reviewable AI-generated workflow artifact with source references, sensitivity, policy hooks, and approval state.                      |

## Versioning

Each payload should include:

- `schema_version`, starting at `0.1.0`;
- stable IDs for records, work items, diagnostics, modules, and evidence references;
- `created_at` or `occurred_at` timestamps in ISO 8601 format;
- sensitivity labels so modules can avoid accidentally crossing privacy boundaries.

Breaking schema changes should use a new version and migration note. The current version is draft and should not be treated as a compatibility promise.

## Module Rules

- Modules may depend on Core contracts.
- Core contracts must not depend on paid modules.
- Core must own baseline access-control capability semantics before real customer data or hosted workflows are introduced.
- Evidence references should point to source artifacts; they should not inline real source documents.
- Work items may suggest actions, but consequential actions remain blocked until explicit approval.
- Diagnostics should be review prompts with source/evidence links where possible.
- Audit events should record who/what proposed, approved, rejected, or implemented an action.
- Standard interchange exports should use Core-owned export job, package index, evidence reference, audit, sensitivity, approval, and retention conventions while modules own format-specific adapters.
- Secure intakes should bind private source items, purpose, visibility, and action boundaries before AI processing or downstream workflow generation.
- AI artifacts should be explicit workflow records, not hidden automation output; use policy-check hooks for future Knightwarden review without embedding raw private source text.

## Next Implementation Step

Adopt these schemas first in the notice-intake workflow:

1. Map `NoticeAction` to `work-item.schema.json`.
2. Map notice source files to `evidence-reference.schema.json`.
3. Map parser/accounting diagnostics to `diagnostic.schema.json`.
4. Emit audit events for classify, approve, reject, and internal work-item creation.

After that, move shared schema helpers into a `redshieldworks-core` package boundary inside this repo.

## TypeScript/Zod Generation

Core uses a schema-first generation strategy. JSON Schema files in `schemas/core/` are the canonical cross-language wire contracts. The `@redshieldworks/core` TypeScript package should generate TypeScript types and Zod validators from those schemas into `packages/core/src/generated/`, then expose them through stable package modules.

Schema authors should follow `docs/architecture/redshieldworks-core-json-schema-style-rules.md` so Core contracts stay readable in generated TypeScript/Zod and remain practical for Python worker validation.

Generation details are captured in:

- `docs/decisions/0007-core-schema-generation-strategy.md`
- `docs/planning/redshieldworks-core-schema-generation-strategy.md`
- `docs/architecture/redshieldworks-standard-interchange-export-strategy.md`
