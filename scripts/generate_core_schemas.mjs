#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import $RefParser from "@apidevtools/json-schema-ref-parser";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { compile } from "json-schema-to-typescript";
import prettier from "prettier";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const schemaDir = path.join(rootDir, "schemas/core");
const generatedDir = path.join(rootDir, "packages/core/src/generated");
const checkOnly = process.argv.includes("--check");

const contracts = [
  ["access-actor.schema.json", "AccessActor"],
  ["access-permission-grant.schema.json", "AccessPermissionGrant"],
  ["access-policy-check.schema.json", "AccessPolicyCheck"],
  ["access-resource.schema.json", "AccessResource"],
  ["access-role.schema.json", "AccessRole"],
  ["agent-capability-grant.schema.json", "AgentCapabilityGrant"],
  ["ai-artifact.schema.json", "AiArtifact"],
  ["audit-event.schema.json", "AuditEvent"],
  ["diagnostic.schema.json", "Diagnostic"],
  ["evidence-reference.schema.json", "EvidenceReference"],
  ["module-metadata.schema.json", "ModuleMetadata"],
  ["secure-intake.schema.json", "SecureIntake"],
  ["work-item.schema.json", "WorkItem"],
];

const header =
  "// Generated from schemas/core/*.schema.json. Do not edit by hand.\n";

function outputBaseName(schemaFile) {
  return schemaFile.replace(/\.schema\.json$/, "");
}

async function readSchema(schemaFile) {
  const source = await fs.readFile(path.join(schemaDir, schemaFile), "utf8");
  return JSON.parse(source);
}

function assertNoSuspiciousAny(schemaFile, source) {
  const suspiciousPatterns = [
    "z.array(z.any())",
    "z.union([z.any()",
    "z.object({ permissions: z.any()",
    '"permissions": z.any()',
    '"evidence_refs": z.array(z.any())',
  ];
  const found = suspiciousPatterns.filter((pattern) =>
    source.includes(pattern),
  );
  if (found.length > 0) {
    throw new Error(
      `${schemaFile} generated suspicious Zod any usage: ${found.join(", ")}`,
    );
  }
}

async function generateZod(schemaFile, typeName) {
  const schemaPath = path.join(schemaDir, schemaFile);
  const dereferenced = await $RefParser.dereference(schemaPath);
  const raw = jsonSchemaToZod(dereferenced, {
    name: `${typeName}Schema`,
    module: "esm",
    withJsdocs: true,
    zodVersion: 4,
  });
  const formatted = await prettier.format(`${header}${raw}`, {
    parser: "typescript",
  });
  assertNoSuspiciousAny(schemaFile, formatted);
  return formatted;
}

async function generateTypes(schemaFile, typeName) {
  const schema = await readSchema(schemaFile);
  const schemaForTypes = {
    ...schema,
    title: typeName,
  };
  return compile(schemaForTypes, typeName, {
    cwd: schemaDir,
    bannerComment: header.trimEnd(),
    declareExternallyReferenced: true,
    style: {
      semi: true,
      singleQuote: false,
      trailingComma: "none",
    },
    unknownAny: false,
  });
}

function generateIndex() {
  const lines = [header.trimEnd(), ""];
  for (const [schemaFile, typeName] of contracts) {
    const base = outputBaseName(schemaFile);
    lines.push(`export { ${typeName}Schema } from "./${base}.schema";`);
    lines.push(`export type { ${typeName} } from "./${base}.types";`);
  }
  lines.push("");
  return lines.join("\n");
}

async function generateAll() {
  const outputs = new Map();
  for (const [schemaFile, typeName] of contracts) {
    const base = outputBaseName(schemaFile);
    outputs.set(`${base}.schema.ts`, await generateZod(schemaFile, typeName));
    outputs.set(`${base}.types.ts`, await generateTypes(schemaFile, typeName));
  }
  outputs.set("index.ts", generateIndex());
  return outputs;
}

async function writeOutputs(outputs) {
  await fs.rm(generatedDir, { recursive: true, force: true });
  await fs.mkdir(generatedDir, { recursive: true });
  for (const [fileName, source] of outputs) {
    await fs.writeFile(path.join(generatedDir, fileName), source);
  }
}

async function checkOutputs(outputs) {
  const stale = [];
  for (const [fileName, expected] of outputs) {
    const filePath = path.join(generatedDir, fileName);
    let actual = null;
    try {
      actual = await fs.readFile(filePath, "utf8");
    } catch {
      stale.push(fileName);
      continue;
    }
    if (actual !== expected) {
      stale.push(fileName);
    }
  }
  if (stale.length > 0) {
    throw new Error(
      `Generated Core schema files are stale: ${stale.join(", ")}`,
    );
  }
}

const outputs = await generateAll();
if (checkOnly) {
  await checkOutputs(outputs);
  console.log(`Core schema generated files are fresh (${outputs.size} files).`);
} else {
  await writeOutputs(outputs);
  console.log(
    `Generated ${outputs.size} Core schema files in ${path.relative(rootDir, generatedDir)}.`,
  );
}
