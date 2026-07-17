# @redshieldworks/core

Core owns shared contracts for access control, audit events, evidence references, work items, diagnostics, module metadata, and privacy/sensitivity labels.

Core must not import RedshieldWorks module packages.

Canonical wire schemas live under `../../schemas/core/`. The TypeScript package should expose generated Zod validators and TypeScript types from those JSON Schemas through stable package modules. Do not hand-maintain duplicate contract shapes in package code.

Synthetic fixtures should live under `fixtures/` and follow `../../docs/planning/redshieldworks-package-fixture-conventions.md`.

The initial fixture set is indexed by `fixtures/fixture-manifest.json` and covers valid and invalid examples for work items, evidence references, diagnostics, audit events, module metadata, and access-control records.

Generated TypeScript types and Zod validators live under `src/generated/`. Refresh them with `npm run generate:core-schemas` and check freshness with `npm run check:core-schemas`.

## Notice Action Work Items

Core now exposes pure TypeScript helpers for notice action work-item flow:

- `createNoticeActionWorkItem()` converts worker notice action proposals into schema-validated Core work items.
- `decideNoticeActionWorkItem()` records approval or rejection, returns the updated work item, and emits a Core audit event.
- `createNoticeActionWorkflowSnapshot()`, `parseNoticeActionWorkflowSnapshot()`, `serializeNoticeActionWorkflowSnapshot()`, and `applyNoticeActionDecisionToSnapshot()` provide a durable JSON snapshot shape for app or CLI storage adapters.
- `noticeActionNextStep()` and `approvedNoticeActionSummary()` keep the first action executor labels consistent across app-facing workflows.

Python notice classification can still propose action details, but durable approval state and queued implementation work should use these Core helpers.
