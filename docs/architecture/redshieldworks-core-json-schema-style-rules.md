# RedshieldWorks Core JSON Schema Style Rules

## Purpose

These rules keep RedshieldWorks Core JSON Schemas usable as the cross-language source of truth while still generating readable TypeScript types and Zod validators.

They apply to canonical Core schemas under `schemas/core/` and should be followed by module-owned schemas that expect to reuse the same generator path.

## Contract Shape

- Use JSON Schema draft 2020-12.
- Keep `$id` values stable, public-looking, and version-neutral unless a new schema identity is intentional.
- Keep `title` stable, PascalCase, and aligned with the generated TypeScript type name.
- Use `description` on schemas and non-obvious fields; generated docs and JSDoc depend on it.
- Set `type` explicitly for every schema and object property.
- Use `schema_version` as a required string on versioned payload records.
- Prefer lowercase snake_case field names in wire payloads.
- Keep timestamps as strings with `format: "date-time"` and UTC-compatible examples.
- Keep IDs as strings with explicit `pattern` rules when they carry domain semantics.

## Object Rules

- Use `required` arrays explicitly, even when all properties are optional.
- Set `additionalProperties: false` for record-shaped contracts by default.
- Allow `additionalProperties` only for deliberate maps, metadata bags, or extension points.
- Document every flexible map with the allowed key shape and value shape.
- Prefer named nested objects in `$defs` when the same structure appears more than once or when generated validators become noisy.
- Keep object nesting shallow enough that generated Zod remains reviewable.

## Union Rules

- Prefer discriminated unions with a required literal discriminator field such as `grant_type`, `kind`, `source_type`, or `event_type`.
- Use `oneOf` for mutually exclusive record variants.
- Avoid `anyOf` for invariants that can be expressed as a discriminator or explicit variant.
- Avoid overlapping union branches; each branch should have a clear required-field signature.
- Do not use unions that generate pass-through `z.any()` branches. If a generator emits one, change the schema shape before relying on the generated validator.
- Keep top-level `oneOf` acceptable only when each branch is concrete and the generated Zod output is inspected by freshness checks.

## Arrays And Maps

- Give every array an explicit `items` schema.
- Use `minItems` when an empty array would change the meaning of the payload.
- Prefer arrays of concrete records over arrays of untyped objects.
- For maps, constrain keys with `propertyNames.pattern` where possible and constrain values with a typed `additionalProperties` schema.
- Do not use free-form arrays or maps for operational decisions, approvals, permissions, evidence, money, dates, or tax values.

## Reuse And References

- Keep `$ref` targets relative and local when practical.
- Use `$defs` for local reuse inside a schema file.
- Use cross-file `$ref` only for stable Core concepts that should remain shared.
- Avoid circular references; the current generation path dereferences schemas before Zod generation.
- Do not use remote `$ref` targets in Core contracts unless the generator, tests, and offline build path support them.

## Validation Semantics

- JSON Schema and generated Zod validate wire shape and basic payload constraints only.
- Do not encode policy-engine decisions, authorization outcomes, workflow transitions, tax calculations, evidence immutability, or cross-record invariants solely in JSON Schema.
- Put those rules in service code and tests that consume the generated contracts.
- Use enums for known workflow states, severities, sensitivity labels, access decisions, and module-owned event catalogs.
- Use `const` for discriminator values inside union branches.
- Avoid broad `string` or `object` fields when the value is operationally meaningful.

## Generator Review Checklist

When adding or changing a Core schema:

1. Run `npm run generate:core-schemas`.
2. Run `npm run check:core-schemas`.
3. Inspect generated `*.schema.ts` for accidental `z.any()`, weak unions, or unreadable nested validators.
4. Inspect generated `*.types.ts` for useful names rather than anonymous object soup.
5. Add or update synthetic fixtures that cover the meaningful valid and invalid shapes.
6. Run the package and Python tests that consume the affected contract.

## Acceptable Flexibility

Flexible fields are allowed when they are clearly non-authoritative or intentionally extension-oriented:

- display metadata;
- source-system labels;
- import diagnostics context;
- adapter-specific export hints;
- human-review notes;
- opaque integration correlation IDs.

Flexible fields are not acceptable for:

- approvals;
- permission decisions;
- access roles or grants;
- evidence identity;
- audit-event identity;
- filing obligations;
- money amounts;
- tax periods;
- legal entity identity.
