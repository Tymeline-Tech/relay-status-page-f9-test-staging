/**
 * Generates TypeScript API client stubs from docs/openapi.yaml into
 * client/src/api/generated/ using openapi-typescript-codegen.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const require = createRequire(import.meta.url);
const { generate } = require('openapi-typescript-codegen') as {
  generate: (options: {
    input: string;
    output: string;
    httpClient: string;
    clientName: string;
    useUnionTypes: boolean;
    exportCore: boolean;
    exportServices: boolean;
    exportModels: boolean;
  }) => Promise<void>;
};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OPENAPI_PATH = path.join(ROOT, 'docs', 'openapi.yaml');
const OUTPUT_DIR = path.join(ROOT, 'client', 'src', 'api', 'generated');
const CLIENT_FILE = path.join(OUTPUT_DIR, 'apiClient.ts');

interface OpenApiDoc {
  openapi?: string;
  info?: { version?: string };
  paths?: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
}

function fail(message: string): never {
  console.error(`generate:client FAILED: ${message}`);
  process.exit(1);
}

async function main(): Promise<void> {
  if (!fs.existsSync(OPENAPI_PATH)) {
    fail(`OpenAPI spec not found at ${OPENAPI_PATH}`);
  }

  const raw = fs.readFileSync(OPENAPI_PATH, 'utf8');
  const doc = parseYaml(raw) as OpenApiDoc;
  const specVersion = doc.info?.version ?? 'unknown';

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Clear previous generation so the artifact is freshly produced.
  for (const entry of fs.readdirSync(OUTPUT_DIR)) {
    fs.rmSync(path.join(OUTPUT_DIR, entry), { recursive: true, force: true });
  }

  await generate({
    input: OPENAPI_PATH,
    output: OUTPUT_DIR,
    httpClient: 'fetch',
    clientName: 'apiClient',
    useUnionTypes: true,
    exportCore: true,
    exportServices: true,
    exportModels: true,
  });

  if (!fs.existsSync(CLIENT_FILE)) {
    fail(`Expected generated file missing: ${CLIENT_FILE}`);
  }

  const clientSource = fs.readFileSync(CLIENT_FILE, 'utf8');
  if (!clientSource.includes('export class apiClient')) {
    fail('Generated apiClient.ts does not export class apiClient');
  }

  // Stamp a small meta header so self-check can verify version alignment.
  const stamp = [
    `/* openapi-spec-version: ${specVersion} */`,
    `/* generated-by: openapi-typescript-codegen */`,
    '',
  ].join('\n');
  fs.writeFileSync(CLIENT_FILE, stamp + clientSource, 'utf8');

  const schemaNames = Object.keys(doc.components?.schemas ?? {});
  const pathKeys = Object.keys(doc.paths ?? {});

  console.log('generate:client OK');
  console.log(`  spec version: ${specVersion}`);
  console.log(`  paths:        ${pathKeys.join(', ')}`);
  console.log(`  schemas:      ${schemaNames.join(', ')}`);
  console.log(`  wrote:        ${CLIENT_FILE}`);
}

main().catch((err: Error) => {
  fail(err.message);
});
