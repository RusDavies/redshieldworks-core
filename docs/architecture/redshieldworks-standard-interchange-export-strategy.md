# RedshieldWorks Standard Interchange Export Strategy

## Purpose

RedshieldWorks should export business records, evidence packages, and workpapers to standard interchange formats where that helps customers leave, review, archive, audit, or move data between systems.

This is not the same as filing with government systems or pushing external actions. Interchange export is a product capability. Official submission, bank/API posting, email delivery, or certified e-filing is a separate integration boundary with separate approval, certification, credential, and liability rules.

## Principles

- Core owns the export job, package index, evidence, audit, sensitivity, approval, and retention conventions.
- Modules own format adapters for their domain data.
- Export outputs must be deterministic enough for review: stable IDs, stable ordering where practical, hashes, source evidence refs, and clear package manifests.
- Exports should preserve enough context to reconstruct what was exported, when, by whom, under which approval, and from which source evidence.
- Standard formats should be preferred when they exist and are useful; simple CSV/JSON is still acceptable for early internal review.
- Export packages must not embed secrets, credentials, raw private paths, or unnecessary source document bodies.
- Export does not imply import. Round-trip support is a separate feature and needs its own validation.

## Ownership Model

| Layer                                 | Owns                                                                                                                                                        | Should not own                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Core                                  | export job envelope, package/index evidence references, audit events, approval gates, sensitivity labels, retention labels, adapter capability declarations | module-specific row semantics, tax schedules, legal record rules |
| Docs                                  | package assembly, document/version metadata, generated artifacts, signed-evidence storage refs, PDF/A or archive package mechanics                          | ledger/tax/minute-book business semantics                        |
| Ledger                                | normalized ledger export adapters, trial balance/general ledger formats, accounting-system import/export mappings                                           | tax filing semantics or corporate records                        |
| Tax                                   | tax workpaper exports, review handoff structures, filing-prep artifacts                                                                                     | certified filing submission unless separately approved           |
| Minute Book                           | corporate-record export contents, register/resolution/share-transaction views, custody package semantics                                                    | generic package storage mechanics                                |
| Banking/Procurement/Vendors/Customers | domain-specific exports and adapter mappings                                                                                                                | Core audit/evidence/index conventions                            |

## Core Export Envelope

Every export job should have a Core-style record with:

- export id, export type, source module, requesting actor, created timestamp;
- status: `requested`, `waiting_for_approval`, `approved`, `generating`, `generated`, `downloaded`, `failed`, `cancelled`;
- approval gate when the export is sensitive, consequential, or full-custody;
- export options hash;
- output evidence refs, including package index evidence;
- sensitivity and retention label;
- audit event ids for request, approval, generation, download, and failure/cancellation.

The export package index is the canonical evidence map. It should reference included files and records by stable IDs and hashes. Large or sensitive artifacts stay as evidence references, not inline payloads.

## Adapter Declarations

Each module adapter should declare:

- module id and adapter id;
- format id and format version;
- direction: `export`, `import`, or `round_trip`;
- stability: `experimental`, `internal`, `reviewable`, `supported`, or `certified`;
- supported record families;
- sensitivity limits;
- required approval gate, if any;
- whether the output is human-readable, machine-readable, or archival;
- validation command or test fixture coverage.

Core exposes adapter declarations through optional `export_adapters` entries on `schemas/core/module-metadata.schema.json`. Module metadata owns the supported format list; Core owns the declaration envelope and shared validation language.

## Initial Format Targets

| Area                  | Early formats                                                                            | Later/conditional formats                                                 | Notes                                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core/package evidence | canonical JSON package index, JSONL audit/event export, hash manifest                    | signed manifest, W3C VC-style evidence only if useful                     | Keep simple until trust requirements justify more ceremony.                                                                                          |
| Docs                  | PDF/A where practical, ZIP/TAR package with JSON index, text/OCR export                  | DOCX/ODT, e-sign provider export bundles                                  | Never commit real document bodies.                                                                                                                   |
| Ledger                | CSV, normalized JSON, trial balance/general ledger CSV                                   | OFX/QIF, SAF-T-inspired export, accounting-system-specific mappings       | SAF-T-inspired export is a deliberate post-MVP product feature, but RedshieldWorks must not fake official SAF-T compliance without jurisdiction fit. |
| Tax                   | workpaper CSV/JSON, GIFI-style CSV, handoff package JSON                                 | XBRL/iXBRL, certified e-filing packages                                   | XBRL/iXBRL export is a deliberate post-MVP product feature. Official submission remains out of scope until certification is understood.              |
| Minute Book           | custody ZIP/TAR + JSON index, CSV registers, JSON corporate-record snapshots, PDF/A docs | LegalDocML/Akoma Ntoso, jurisdiction-specific minute-book archive formats | Use Docs for package mechanics and Minute Book for content semantics.                                                                                |
| Customers/Vendors     | CSV, normalized JSON                                                                     | vCard, UBL/Peppol-adjacent partner records                                | Add only when there is an integration use case.                                                                                                      |
| Procurement/Sales     | CSV/JSON                                                                                 | UBL/Peppol documents                                                      | Treat procurement exchange formats as paid/integration candidates.                                                                                   |
| Banking               | CSV/JSON reconciliation export                                                           | OFX/QIF/camt.053 where useful                                             | Bank-feed import/export is sensitive and connector-heavy.                                                                                            |

## Advanced Format Product Decision

XBRL/iXBRL and SAF-T-inspired exports are deliberate RedshieldWorks product features, not research-only curiosities. They do not belong in the MVP acceptance path, because the MVP should prove reviewable local workpapers, export package evidence, and human approval boundaries first.

Post-MVP implementation should treat these as first-class adapter families:

- Tax owns XBRL/iXBRL export requirements, fixtures, validation, and any eventual certified filing boundary.
- Ledger owns SAF-T-inspired export requirements, jurisdiction mapping, fixtures, and validation.
- Core owns the shared export job, evidence, approval, audit, and adapter declaration envelope.

The first implementation slice should still be reviewable handoff output, not official submission. Any claim of jurisdiction-specific compliance, regulator acceptance, certification, or direct filing remains a separate approval and certification gate.

## Boundary: Interchange vs Official Submission

Interchange exports can be generated locally for review, archival, migration, or handoff. They may resemble official forms or standards, but they are not official submissions.

Official submission requires a separate decision and gate when any of these are true:

- the format is accepted directly by a regulator, bank, registry, or public service;
- credentials, certificates, API keys, or account-level authorization are needed;
- submission creates legal, tax, financial, or public effects;
- certification, licensing, or vendor terms apply;
- the product claims conformance to a regulated filing standard.

Until that work is explicitly approved, exports should say `preparation/handoff only` where confusion is likely.

## Testing Expectations

Each supported adapter needs:

- at least one synthetic fixture;
- schema or structural validation;
- package index coverage where files are produced;
- privacy guard coverage for committed fixtures;
- a negative test for unsupported or unsafe inputs where practical;
- audit/evidence refs proving what source records produced the export.

For early MVP, a module can be considered export-capable only when its adapter appears in docs, has synthetic fixtures, and is covered by test or script verification.

## Initial Backlog Slices

1. Add Docs package-index validation for generic export packages, building on the Minute Book export-index fixture.
2. Add Minute Book CSV register export fixture and validation.
3. Add Ledger normalized JSON export fixture for imported CSV/IIF data.
4. Add Tax workpaper export manifest fixture that distinguishes review handoff from official filing.
5. Decide whether XBRL/iXBRL and SAF-T-inspired exports are product priorities or research-only for now. Done: deliberate post-MVP product features, not MVP blockers.
6. Post-MVP: define Tax XBRL/iXBRL export adapter requirements, fixture scope, and validation gates. Done in `docs/architecture/redshieldworks-tax-xbrl-ixbrl-export-adapter.md`.
7. Post-MVP: define Ledger SAF-T-inspired export adapter requirements, jurisdiction mapping, fixture scope, and validation gates. Done in `docs/architecture/redshieldworks-ledger-saft-inspired-export-adapter.md`.

## Open Questions

- Which post-MVP advanced interchange adapter should be implemented first once MVP export packages are stable?
- Should export package manifests be signed in MVP, or is hashing enough until hosted/customer workflows exist?
- Which formats need import support, and which are export-only handoff formats?
- Which interchange formats sit on the open-core side versus paid connector/module boundaries?
