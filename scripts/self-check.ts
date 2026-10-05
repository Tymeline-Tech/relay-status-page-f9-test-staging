/**
 * Machine-checkable self-check for generated TypeScript client stubs.
 * Ensures generated files exist, match the OpenAPI contract, and that the
 * public client factory export is wired correctly.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OPENAPI_PATH = path.join(ROOT, 'docs', 'openapi.yaml');
const GENERATED_DIR = path.join(ROOT, 'client', 'src', 'api', 'generated');
const CLIENT_FILE = path.join(GENERATED_DIR, 'apiClient.ts');
const API_INDEX = path.join(ROOT, 'client', 'src', 'api', 'index.ts');

interface OpenApiDoc {
  info?: { version?: string };
  paths?: Record<string, Record<string, unknown>>;
  components?: { schemas?: Record<string, unknown> };
}

function fail(message: string): never {
  console.error(`self-check FAILED: ${message}`);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    fail(message);
  }
}

function main(): void {
  assert(fs.existsSync(OPENAPI_PATH), `missing ${OPENAPI_PATH}`);
  assert(fs.existsSync(CLIENT_FILE), `missing ${CLIENT_FILE}`);
  assert(fs.existsSync(API_INDEX), `missing ${API_INDEX}`);

  const doc = parseYaml(fs.readFileSync(OPENAPI_PATH, 'utf8')) as OpenApiDoc;
  const specVersion = doc.info?.version ?? '';
  assert(specVersion.length > 0, 'OpenAPI info.version is empty');

  const clientSource = fs.readFileSync(CLIENT_FILE, 'utf8');
  assert(
    clientSource.includes(`openapi-spec-version: ${specVersion}`),
    `generated client does not match OpenAPI version ${specVersion}`,
  );
  assert(clientSource.includes('generated-by: openapi-typescript-codegen'), 'missing codegen stamp');
  assert(clientSource.includes('export class apiClient'), 'apiClient class missing');

  const schemas = doc.components?.schemas ?? {};
  for (const name of ['ServiceStatus', 'Incident'] as const) {
    assert(schemas[name], `schema ${name} missing from OpenAPI`);
    const modelPath = path.join(GENERATED_DIR, 'models', `${name}.ts`);
    assert(fs.existsSync(modelPath), `generated model missing: ${modelPath}`);
  }

  const paths = doc.paths ?? {};
  assert(paths['/api/status']?.get && paths['/api/status']?.post, '/api/status GET/POST required');
  assert(paths['/api/incidents']?.get && paths['/api/incidents']?.post, '/api/incidents GET/POST required');

  const indexSource = fs.readFileSync(API_INDEX, 'utf8');
  assert(indexSource.includes('createApiClient'), 'client/src/api/index.ts must export createApiClient');
  assert(
    indexSource.includes('./generated/apiClient') || indexSource.includes('./generated'),
    'client/src/api/index.ts must re-export the generated client',
  );

  // Confirm services were generated for the documented operations.
  const servicesDir = path.join(GENERATED_DIR, 'services');
  assert(fs.existsSync(servicesDir), 'generated services directory missing');
  const serviceFiles = fs.readdirSync(servicesDir).filter((f) => f.endsWith('.ts'));
  assert(serviceFiles.length > 0, 'no generated service files');

  console.log('self-check OK');
  console.log(`  openapi version: ${specVersion}`);
  console.log(`  apiClient:       ${CLIENT_FILE}`);
  console.log(`  models:          ServiceStatus, Incident`);
  console.log(`  services:        ${serviceFiles.join(', ')}`);
}

main();
