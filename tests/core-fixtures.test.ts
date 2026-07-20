import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";
import type { ZodTypeAny } from "zod";

import {
  AccessActorSchema,
  AccessPermissionGrantSchema,
  AccessPolicyCheckSchema,
  AccessResourceSchema,
  AccessRoleSchema,
  AgentCapabilityGrantSchema,
  AiArtifactSchema,
  AuditEventSchema,
  DiagnosticSchema,
  EvidenceReferenceSchema,
  ModuleMetadataSchema,
  SecureIntakeSchema,
  WorkItemSchema,
} from "../packages/core/src/generated/index";

type FixtureExpectation = "valid" | "invalid";

interface FixtureManifest {
  fixtures: Array<{
    fixture_id: string;
    path: string;
    contract: keyof typeof schemaByContract;
    expected: FixtureExpectation;
  }>;
}

const fixturesRoot = path.join(process.cwd(), "packages/core/fixtures");

const schemaByContract = {
  "schemas/core/access-actor.schema.json": AccessActorSchema,
  "schemas/core/access-permission-grant.schema.json":
    AccessPermissionGrantSchema,
  "schemas/core/access-policy-check.schema.json": AccessPolicyCheckSchema,
  "schemas/core/access-resource.schema.json": AccessResourceSchema,
  "schemas/core/access-role.schema.json": AccessRoleSchema,
  "schemas/core/agent-capability-grant.schema.json": AgentCapabilityGrantSchema,
  "schemas/core/ai-artifact.schema.json": AiArtifactSchema,
  "schemas/core/audit-event.schema.json": AuditEventSchema,
  "schemas/core/diagnostic.schema.json": DiagnosticSchema,
  "schemas/core/evidence-reference.schema.json": EvidenceReferenceSchema,
  "schemas/core/module-metadata.schema.json": ModuleMetadataSchema,
  "schemas/core/secure-intake.schema.json": SecureIntakeSchema,
  "schemas/core/work-item.schema.json": WorkItemSchema,
} satisfies Record<string, ZodTypeAny>;

function readJson(relativePath: string): unknown {
  return JSON.parse(
    readFileSync(path.join(fixturesRoot, relativePath), "utf8"),
  );
}

const manifest = readJson("fixture-manifest.json") as FixtureManifest;

describe("Core fixture manifest", () => {
  it("uses unique fixture ids and paths", () => {
    const fixtureIds = new Set<string>();
    const fixturePaths = new Set<string>();

    for (const fixture of manifest.fixtures) {
      expect(fixtureIds.has(fixture.fixture_id), fixture.fixture_id).toBe(
        false,
      );
      expect(fixturePaths.has(fixture.path), fixture.path).toBe(false);
      fixtureIds.add(fixture.fixture_id);
      fixturePaths.add(fixture.path);
    }
  });

  it.each(manifest.fixtures)(
    "validates $fixture_id as $expected",
    (fixture) => {
      const schema = schemaByContract[fixture.contract];
      expect(
        schema,
        `No generated schema mapped for ${fixture.contract}`,
      ).toBeDefined();

      const result = schema.safeParse(readJson(fixture.path));
      expect(result.success).toBe(fixture.expected === "valid");
    },
  );

  it("declares standard interchange export adapters in module metadata", () => {
    const minuteBookMetadata = ModuleMetadataSchema.parse(
      readJson("synthetic/module-metadata.minute-book.v0_1_0.json"),
    );

    expect(minuteBookMetadata.export_adapters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          adapter_id: "minute-book-custody-package",
          direction: "export",
          stability: "reviewable",
          output_kind: "archival",
          official_submission: false,
          approval_gate: "privacy_sensitive_action",
        }),
        expect.objectContaining({
          adapter_id: "minute-book-register-csv",
          format_id: "csv",
          direction: "export",
          official_submission: false,
        }),
      ]),
    );
  });
});
