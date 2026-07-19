# RedshieldWorks Core

RedshieldWorks Core is a standalone contract and validation toolkit for
reviewable business workflows. It contains JSON Schema wire contracts,
generated TypeScript/Zod validators, synthetic fixtures, and public developer
notes for workflow, evidence, audit, module metadata, secure intake, and
access-control records.

Core is useful on its own for describing business records, review workflows,
evidence references, diagnostics, approvals, exports, access checks, and audit
events without requiring a hosted product or private integration.

## Status

- Pre-1.0 draft contracts.
- No compatibility promise yet.
- Synthetic fixtures only.
- MIT licensed.
- No official filing, payment, portal upload, hosted operations, legal advice,
  or tax-authority submission functionality.

## Package

The main package is `@redshieldworks/core`.

Useful commands:

```bash
npm install
npm run generate:core-schemas
npm run check:core-schemas
npm run typecheck
npm run test
```

## Repository Layout

```text
schemas/core/          Canonical JSON Schema contracts
packages/core/         TypeScript package source and generated validators
scripts/               Contract generation tools
tests/                 Focused Core contract and helper tests
docs/architecture/     Public architecture notes
docs/decisions/        Public decision records
docs/contributors/     Contributor guidance
```

## Scope

Core owns reusable contracts, local validation helpers, synthetic fixtures, and
developer guidance for reviewable workflow data. It does not provide hosted
operations, customer-specific workflows, certification work, official filing,
payment submission, portal upload, legal advice, or tax-authority submission.
