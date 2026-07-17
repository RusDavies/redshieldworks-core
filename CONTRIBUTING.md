# Contributing

RedshieldWorks Core is schema-first. Update `schemas/core/*.schema.json`, then
regenerate TypeScript types and Zod validators:

```bash
npm run generate:core-schemas
```

Before proposing a change, run:

```bash
npm run check:core-schemas
npm run typecheck
npm run test
```

Fixtures must be synthetic, redacted, or generated only from synthetic inputs.
See `docs/contributors/fixture-conventions.md`.

