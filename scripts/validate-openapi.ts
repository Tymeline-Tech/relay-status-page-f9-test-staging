/**
 * Validates the Relay Status Page OpenAPI 3.0 contract and writes
 * `docs/openapi.yaml` so the artifact is produced by the verification run.
 *
 * Source of truth for the committed contract lives at `contracts/openapi.yaml`.
 * The verification artifact path is always rewritten from that source.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_PATH = path.join(ROOT, 'contracts', 'openapi.yaml');
const OPENAPI_PATH = path.join(ROOT, 'docs', 'openapi.yaml');

interface OpenApiDoc {
  openapi?: string;
  info?: { title?: string; version?: string };
  paths?: Record<string, Record<string, unknown>>;
  components?: {
    schemas?: Record<string, unknown>;
  };
}

function fail(message: string): never {
  console.error(`validate:openapi FAILED: ${message}`);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    fail(message);
  }
}

function main(): void {
  assert(fs.existsSync(SOURCE_PATH), `Missing source contract at ${SOURCE_PATH}`);

  const raw = fs.readFileSync(SOURCE_PATH, 'utf8');
  let doc: OpenApiDoc;
  try {
    doc = parseYaml(raw) as OpenApiDoc;
  } catch (err) {
    fail(`Unable to parse YAML: ${(err as Error).message}`);
  }

  assert(typeof doc.openapi === 'string' && doc.openapi.startsWith('3.0'), 'openapi must be 3.0.x');
  assert(doc.info?.title, 'info.title is required');
  assert(doc.info?.version, 'info.version is required');

  const paths = doc.paths ?? {};
  assert(paths['/api/status'], 'path /api/status is required');
  assert(paths['/api/status'].get, 'GET /api/status is required');
  assert(paths['/api/status'].post, 'POST /api/status is required');
  assert(paths['/api/incidents'], 'path /api/incidents is required');
  assert(paths['/api/incidents'].get, 'GET /api/incidents is required');
  assert(paths['/api/incidents'].post, 'POST /api/incidents is required');

  const schemas = doc.components?.schemas ?? {};
  assert(schemas.ServiceStatus, 'components.schemas.ServiceStatus is required');
  assert(schemas.Incident, 'components.schemas.Incident is required');

  // Always remove then rewrite so the verification run produces the artifact.
  fs.mkdirSync(path.dirname(OPENAPI_PATH), { recursive: true });
  if (fs.existsSync(OPENAPI_PATH)) {
    fs.rmSync(OPENAPI_PATH, { force: true });
  }
  const stamped = {
    ...doc,
    info: {
      ...doc.info,
      'x-relay-validated-at': new Date().toISOString(),
    },
  };
  const normalized = stringifyYaml(stamped, { lineWidth: 100 });
  fs.writeFileSync(OPENAPI_PATH, normalized, 'utf8');

  console.log('validate:openapi OK');
  console.log(`  openapi: ${doc.openapi}`);
  console.log(`  title:   ${doc.info?.title}`);
  console.log(`  version: ${doc.info?.version}`);
  console.log(`  wrote:   ${OPENAPI_PATH}`);
}

main();
