# RedshieldWorks Access-Control Capability Contracts

## Purpose

These draft Core schemas define a reusable baseline access-control capability
for reviewable business workflows. They provide shared contracts for actors,
roles, resources, grants, policy checks, approval gates, and audit links so
applications do not invent incompatible permission folklore.

## Schemas

| Schema | Purpose |
| --- | --- |
| `access-actor.schema.json` | Human, agent, service account, system, or module actor. |
| `access-role.schema.json` | Named role with permission patterns and approval gates. |
| `access-resource.schema.json` | Resource descriptor for documents, work items, tax workpapers, vendors, banking records, exports, and other protected objects. |
| `access-permission-grant.schema.json` | Role or direct permission grant to an actor over an organization, workspace, entity, module, or resource scope. |
| `access-policy-check.schema.json` | Enforcement hook request/decision for an actor attempting an action on a resource. |

## Permission Pattern

Permissions use `domain:action`, such as:

- `ledger:read`
- `tax:approve`
- `docs:classify`
- `banking:export`
- `vendors:review-risk`
- `core:manage-permissions`

The exact permission catalog should be module-owned and declared through module metadata later.

## Core Responsibilities

Core includes:

- actor/resource/role/grant/policy-check schemas;
- local policy-check helpers;
- audit-event links for permission-sensitive actions;
- approval-gate and segregation-of-duties hooks.

Applications can add:

- hosted user/team administration;
- identity-provider integration;
- advanced policy UI;
- segregation-of-duties reports;
- compliance packs and audit exports;
- workflow-specific support.

## Initial Adoption Path

1. Use `access-policy-check.schema.json` before approving notice actions.
2. Add actor IDs to work-item approval records.
3. Add resource descriptors for private notices, workpapers, exports, and vendor records.
4. Emit audit events for grant changes and permission-sensitive decisions.
5. Use `docs/architecture/redshieldworks-minute-book-access-control-map.md` as the first module-specific permission catalog and conditional policy map.
