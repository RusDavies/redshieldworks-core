# RedshieldWorks AI Workflow Contracts

## Position

AI capabilities are first-class citizens in RedshieldWorks workflows and UIs.

AI should not appear as hidden automation or unreviewable background behavior.
It should produce explicit workflow records that users can inspect, accept,
reject, constrain, cite, audit, and route through policy checks.

## First-Class AI Artifacts

Represent AI output as durable, typed artifacts rather than transient chat text.

Examples:

- extracted facts;
- classifications;
- summaries;
- timelines;
- draft replies or filings;
- proposed work items;
- suggested evidence links;
- diagnostics and risk flags;
- missing-information questions;
- recommended next actions.

Each AI artifact should record:

- source references used;
- model/tool identity where available;
- prompt/template or operation identity where safe to retain;
- confidence or uncertainty signals where meaningful;
- sensitivity label;
- reviewer/approval state;
- action boundary;
- audit-event links.

Raw prompts, raw source documents, secrets, and unnecessary private content
should not be embedded in audit logs or Core workflow metadata. Use evidence
references and private storage pointers instead.

## UI Expectations

AI-assisted UI should make the AI role visible in normal workflow surfaces:

- show proposed changes separately from accepted records;
- show source/evidence links beside generated assertions;
- make approve/reject/edit paths obvious;
- distinguish extraction, recommendation, and action;
- preserve human override and reason capture;
- require explicit approval for consequential actions.

The UI should avoid implying that an AI-generated answer is an official filing,
legal/tax advice, customer communication, payment instruction, or external
submission until a human has approved the specific action.

## Secure Intake Interaction

Secure intake should treat AI processing as an explicit later phase.

An intake manifest should be reviewable before AI extraction or summarization.
AI outputs generated from an intake should stay attached to that intake with
source references, action boundaries, approval state, and audit events.

## Knightwarden Readiness

RedshieldWorks AI workflows should be ready to integrate with
RSK Security Knightwarden when that product boundary is available.

Knightwarden should be treated as a future policy/risk-review integration point
for AI use, not as embedded product logic.

Candidate Knightwarden review surfaces:

- data-exposure risk for a proposed AI operation;
- source trust and provenance checks;
- prompt/tool risk classification;
- model/provider policy checks;
- proposed external-action risk;
- approval-gate recommendations;
- sensitive-output review;
- anomalous or high-impact automation detection.

Until the Knightwarden contract exists, RedshieldWorks should preserve a stable
hook point by recording enough structured context for each AI operation:

- actor;
- target resource;
- source evidence references;
- requested capability;
- sensitivity labels;
- intended output/action;
- approval gate;
- policy-check result placeholder;
- audit-event trail.

Do not hard-code Knightwarden behavior before its release. Design Core and
module contracts so a later Knightwarden adapter can evaluate AI operations
without replacing RedshieldWorks workflow records.
