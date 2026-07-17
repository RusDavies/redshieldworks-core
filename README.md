# RedshieldWorks Core

RedshieldWorks Core is the draft open-core contract layer for RedshieldWorks.
It contains JSON Schema wire contracts, generated TypeScript/Zod validators,
synthetic fixtures, and public developer notes for workflow, evidence, audit,
module metadata, secure intake, and access-control records.

This repository is a clean-history staging repo. It starts private while the
license, public contract scope, and publication checklist are finalized.

## Status

- Pre-1.0 draft contracts.
- No compatibility promise yet.
- Synthetic fixtures only.
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

## Public Boundary

Core is meant to define shared contracts and local validation helpers. Product
modules, hosted workflow automation, customer-specific operations, certification
work, and paid/commercial features belong outside this repository unless they
are reduced to public-safe Core interfaces.

