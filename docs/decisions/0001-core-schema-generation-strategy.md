# Decision Record: Core Schema Generation Strategy

## Status

Proposed

## Date

2026-06-12

## Context

RedshieldWorks Core already has draft JSON Schema contracts under `schemas/core/` for module metadata, evidence references, diagnostics, work items, audit events, and access-control records.

The new TypeScript workspace gives Core a real package boundary at `packages/core`, and package consumers need TypeScript types plus runtime validators. Python workers also need stable wire contracts. If every language hand-maintains its own version of these contracts, the first bug will not be clever. It will just be paperwork wearing a fake moustache.

The project needs one source of truth for cross-language contracts while still making TypeScript pleasant to use.

## Decision

Use **schema-first contract generation** for RedshieldWorks Core.

Canonical Core wire contracts live as JSON Schema files under `schemas/core/`. The `@redshieldworks/core` TypeScript package generates TypeScript types and Zod validators from those JSON Schemas into `packages/core/src/generated/`.

Generated files are build artifacts with narrow exports. Hand-written Core code may wrap generated validators with domain helpers, policy-check helpers, ID helpers, fixture builders, and service-level conventions, but it must not redefine the wire contract shape.

Direction:

- JSON Schema remains the canonical cross-language contract format.
- Zod is the canonical TypeScript runtime-validation surface.
- TypeScript types are generated from the same schemas used to generate validators.
- Python workers validate against JSON Schema or generated Python models later, but they must not become the contract authority.
- OpenAPI/ASGI worker APIs should reference or derive from the same Core schemas where practical.

## Generation Pipeline

Initial pipeline:

1. Author or update `schemas/core/*.schema.json`.
2. Validate schema files as JSON and JSON Schema draft 2020-12.
3. Generate TypeScript types and Zod validators into `packages/core/src/generated/`.
4. Export generated validators through package-owned modules such as `packages/core/src/schemas/index.ts`.
5. Add synthetic fixture tests that validate example Core payloads against generated validators.
6. Run generated-file freshness checks in CI once dependency installation and lockfile policy are settled.

Preferred generated naming:

- `WorkItemSchema` for Zod validators.
- `WorkItem` for generated TypeScript types.
- `parseWorkItem` / `safeParseWorkItem` as thin hand-written helpers only when they add useful error normalization.

Generated files should include a header such as:

```ts
// Generated from schemas/core/*.schema.json. Do not edit by hand.
```

## Package Layout

Target Core layout:

```text
packages/core/
  src/
    access/
    audit/
    diagnostics/
    evidence/
    generated/
    module-registry/
    schemas/
    work-items/
```

`generated/` contains mechanically generated TypeScript/Zod files.

`schemas/` contains stable package exports and helper functions around generated contracts. Other packages should import from exported Core modules instead of deep-importing generated files.

## Versioning

Each Core payload continues to carry `schema_version`.

Draft version `0.1.0` remains mutable while the package skeleton is forming. Once Core is treated as a public contract package, breaking changes must use one of:

- a new schema version;
- an explicit migration note;
- a compatibility adapter in `@redshieldworks/core`;
- a deprecation window documented in the decision or release notes.

Schema file `$id` values must remain stable and public-looking even before external publication.

## Dependency Choice

Use a small generation toolchain rather than a custom generator unless a spike finds unacceptable output.

Candidate path:

- `json-schema-to-zod` or equivalent for Zod validators;
- `json-schema-to-typescript` or equivalent for TypeScript types;
- a project-local generation script under `scripts/` or `packages/core/scripts/`.

Do not hand-roll schema conversion unless existing tools fail on the Core schema style. Hand-written conversion code is where small teams accidentally invent a sad compiler.

The first spike selected `json-schema-to-typescript`, `@apidevtools/json-schema-ref-parser`, and `json-schema-to-zod` as the initial toolchain. The spike found that Zod generation must dereference schemas first, and the original `access-permission-grant.schema.json` `anyOf` shape needed cleanup before full generation.

Generator-friendly JSON Schema style rules are defined in `docs/architecture/redshieldworks-core-json-schema-style-rules.md`. In short: Core schemas should use stable titles, explicit `required` arrays, typed maps, `additionalProperties: false` for closed records, `$defs` for reused nested structures, and discriminator-driven `oneOf` variants instead of ambiguous `anyOf`.

## Boundaries

Generated Core contracts are for wire shape and basic runtime validation.

They do not replace:

- policy-engine decisions;
- authorization logic;
- human approval checks;
- cross-record invariants;
- evidence immutability enforcement;
- workflow state-machine checks;
- financial/tax calculation validation.

Those belong in hand-written services and tests that consume the generated contracts.

## Implications

Positive:

- Keeps TypeScript and Python worker boundaries aligned.
- Makes Core contracts usable by package consumers without duplicating schema shapes.
- Gives tests a stable validator surface.
- Keeps future OpenAPI/ASGI worker contracts anchored to Core.
- Reduces accidental divergence between docs, JSON payloads, and package code.

Negative / tradeoffs:

- Adds generation tooling and freshness checks.
- Generated Zod may be less ergonomic than hand-written schemas in places.
- Some JSON Schema constructs may need style constraints so generators produce readable TypeScript.
- Package consumers need discipline to avoid deep imports from `generated/`.

## Follow-Up

- Choose the generation toolchain and add package scripts.
- Generate the first Core Zod/type outputs from `schemas/core/`.
- Add Core synthetic fixtures that validate work items, evidence references, diagnostics, audit events, module metadata, and access-control records.
- Add generated-file freshness checks after the lockfile policy is settled.
- Apply the documented JSON Schema style rules to future Core and module-owned contract changes.

## Review Status

Proposed until the first public Core release confirms the toolchain and
generated-file policy.
