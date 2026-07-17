# RedshieldWorks Package Fixture Conventions

## Purpose

This document defines how package-level synthetic fixtures should work for RedshieldWorks Core, Docs, Minute Book, Integration, and the future web app.

The goal is to make fixtures reusable across package tests without letting private documents, real identifiers, or module-specific shortcuts leak into Core.

## Ground Rules

- Track only synthetic, redacted, or generated-from-synthetic fixtures.
- Put real or potentially sensitive source material under ignored private paths, never under package fixture folders.
- Keep package fixtures small, reviewable, and purpose-built.
- Prefer JSON fixtures for contract payloads and plain text fixtures for OCR/classification examples.
- Avoid binary fixture files unless the test specifically exercises binary handling; use synthetic placeholder files when possible.
- Every fixture must have a clear owning package.
- Integration fixtures may compose package fixtures, but they should not become the owner of Core, Docs, or Minute Book contract examples.

These rules are the baseline privacy policy for this public Core repository.
Module or application repositories may add stricter local rules.

## Directory Layout

Use package-local fixture roots:

```text
packages/
  core/
    fixtures/
      synthetic/
      invalid/
  docs/
    fixtures/
      synthetic/
      invalid/
  minute-book/
    fixtures/
      synthetic/
      invalid/
  integration/
    fixtures/
      synthetic/
      scenarios/
      worker-outputs/
apps/
  redshieldworks-web/
    fixtures/
      synthetic/
```

Use `synthetic/` for valid fixtures and `invalid/` for deliberately malformed payloads. Use `integration/fixtures/scenarios/` for cross-package vertical slices.

Do not place fixtures inside `src/` unless a specific test runner or bundler later requires it. Keeping fixtures beside package source but outside runtime code makes it harder to accidentally ship test artifacts.

## Naming

Use descriptive kebab-case filenames:

```text
<domain>.<scenario>.<schema-version>.json
<domain>.<scenario>.invalid.<reason>.json
<domain>.<scenario>.txt
```

Examples:

```text
work-item.notice-action-proposed.v0_1_0.json
evidence-reference.generated-workpaper.v0_1_0.json
access-policy-check.owner-allow.v0_1_0.json
document.ocr-text.synthetic-rq-notice.txt
minute-book.share-issuance.first-slice.v0_1_0.json
```

Use `v0_1_0` in filenames for schema version `0.1.0`; avoid dots in version fragments to keep globbing and generated names boring. Boring is good. Boring does not page anyone at 2 a.m.

## Fixture Manifests

Each package fixture root should eventually include:

```text
fixtures/fixture-manifest.json
```

The manifest should list:

- fixture id;
- owning package;
- relative path;
- schema or contract target;
- scenario;
- sensitivity label;
- synthetic/redacted status;
- source note;
- expected validator result.

Example fields:

```json
{
  "fixture_id": "core-work-item-notice-action-proposed-v0_1_0",
  "owner": "@redshieldworks/core",
  "path": "synthetic/work-item.notice-action-proposed.v0_1_0.json",
  "contract": "schemas/core/work-item.schema.json",
  "scenario": "notice action proposed for review",
  "sensitivity": "internal",
  "data_status": "synthetic",
  "expected": "valid"
}
```

Manifests are index metadata, not a second schema system. They should help tests and reviewers find the right fixtures.

## Core Fixtures

Core owns contract-shaped examples only:

- work items;
- evidence references;
- diagnostics;
- audit events;
- module metadata;
- actors, roles, resources, grants, and policy checks.

Core fixtures must not include module-owned internal records such as Minute Book share classes, Tax filing schedules, Banking transactions, or Docs document-version state except as opaque IDs, evidence references, resource descriptors, or context values allowed by Core schemas.

First Core fixture set:

- valid minimal work item with evidence reference;
- valid rejected work item with approval metadata;
- valid diagnostic with evidence reference;
- valid audit event for work-item proposal;
- valid module metadata for Core and Minute Book;
- valid policy checks for `allow`, `deny`, `needs_approval`, and `needs_step_up`;
- invalid payloads for missing `schema_version`, unexpected extra field, invalid sensitivity, and malformed ID.

## Docs Fixtures

Docs owns generic document/evidence examples:

- document records;
- document versions;
- storage object references;
- OCR text examples;
- extraction/classification envelopes;
- export package metadata;
- evidence-store references.

Docs fixtures should avoid raw real PDFs, screenshots, scans, barcodes, envelope metadata, and OCR text from actual notices. Use plain text synthetic OCR samples or placeholder binary files with explicit synthetic notes.

Docs may reference Core evidence IDs and work-item IDs but must not own Core contract examples.

## Minute Book Fixtures

Minute Book owns corporate-record workflow examples:

- company minute books;
- parties and people;
- share classes;
- share issuances;
- share transactions;
- signature packets;
- register derivation inputs/outputs;
- health/gap findings;
- module-specific policy scenarios.

Minute Book fixtures should be Quebec-first where jurisdiction matters, but all company, person, address, share certificate, signature, and document identifiers must be synthetic.

Minute Book may reference Core and Docs fixture IDs. It should not copy full Core/Docs payloads unless the scenario is explicitly testing a composed envelope.

First Minute Book fixture families:

- owner/admin/lawyer/accountant/contributor/read-only policy-check scenarios;
- first-slice share issuance work-item and audit-event references;
- signed-upload acceptance metadata without real signature artifacts;
- register derivation with synthetic shareholders and share classes.

## Integration Fixtures

Integration owns composed scenarios:

- first-slice vertical acceptance fixtures;
- cross-package contract fixtures;
- Python worker output adapter fixtures;
- generated sample output checks;
- migration harness fixtures.

Integration fixtures may combine Core, Docs, Minute Book, and worker outputs. They should include a scenario README or manifest describing which package fixtures are composed and what pass/fail behavior is expected.

Integration should prefer references to package-owned fixture files over copying payloads. Copy only when the fixture is intentionally testing a serialized handoff package.

## Web App Fixtures

The web app should use fixtures for UI smoke tests and local demo states only after app code exists.

The app must not become the canonical owner of domain fixtures. It should import or compose package-owned examples through test helpers.

## Validation Expectations

Fixture tests should cover:

- valid fixtures parse through generated or hand-written validators;
- invalid fixtures fail with useful errors;
- manifests point to existing files;
- fixture sensitivity labels are present where schemas require them;
- integration fixtures do not duplicate private source paths;
- Core fixtures do not import or depend on module packages.

Once Core generation exists, Core fixture validation should run against generated Zod validators and JSON Schema checks.

## Privacy Review Checklist

Before committing a new fixture:

1. Confirm it is synthetic, redacted, or derived only from synthetic/redacted inputs.
2. Confirm it contains no real company, person, account, document, tax, address, phone, email, barcode, QR, bank, payroll, or government correspondence identifiers.
3. Confirm source material does not belong under ignored private input paths.
4. Confirm the fixture has an owning package and a reason to exist.
5. Run `python scripts/privacy_guard.py`.

## Next Implementation Slice

Wire Core fixture validation tests after the Core schema generator is available, then add Docs and Integration fixture manifests.
