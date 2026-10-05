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

interface SchemaObject {
  type?: string;
  required?: string[];
  properties?: Record<string, { type?: string; format?: string; enum?: string[]; $ref?: string; nullable?: boolean }>;
  enum?: string[];
  $ref?: string;
}

interface OpenApiDoc {
  openapi?: string;
  info?: { title?: string; version?: string; [key: string]: unknown };
  paths?: Record<string, Record<string, unknown>>;
  components?: {
    schemas?: Record<string, SchemaObject>;
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

function resolveRef(doc: OpenApiDoc, maybeRef: { $ref?: string } | undefined): SchemaObject | undefined {
  if (!maybeRef?.$ref) {
    return maybeRef as SchemaObject | undefined;
  }
  const match = maybeRef.$ref.match(/^#\/components\/schemas\/(.+)$/);
  assert(match, `unsupported $ref: ${maybeRef.$ref}`);
  return doc.components?.schemas?.[match[1]];
}

function assertEnum(schema: SchemaObject | undefined, values: string[], label: string): void {
  assert(schema, `${label} schema missing`);
  assert(Array.isArray(schema.enum), `${label} must declare enum`);
  assert(
    values.every((v) => schema.enum!.includes(v)) && schema.enum!.length === values.length,
    `${label} enum must be exactly [${values.join(', ')}]`,
  );
}

function assertStringProp(
  props: Record<string, { type?: string; format?: string; $ref?: string; nullable?: boolean }>,
  name: string,
  options: { format?: string; nullable?: boolean; label: string } = { label: name },
): void {
  const prop = props[name];
  assert(prop, `${options.label} missing property ${name}`);
  if (prop.$ref) {
    return;
  }
  assert(prop.type === 'string', `${options.label}.${name} must be string`);
  if (options.format) {
    assert(prop.format === options.format, `${options.label}.${name} must be format ${options.format}`);
  }
  if (options.nullable) {
    assert(prop.nullable === true, `${options.label}.${name} must be nullable`);
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

  assert(doc.openapi === '3.0.2', 'openapi must be exactly 3.0.2');
  assert(doc.info?.title, 'info.title is required');
  assert(doc.info?.version, 'info.version is required');

  const paths = doc.paths ?? {};
  assert(paths['/api/status'], 'path /api/status is required');
  assert(paths['/api/status'].get, 'GET /api/status is required');
  assert(paths['/api/status'].post, 'POST /api/status is required');
  assert(paths['/api/incidents'], 'path /api/incidents is required');
  assert(paths['/api/incidents'].get, 'GET /api/incidents is required');
  assert(paths['/api/incidents'].post, 'POST /api/incidents is required');

  const getStatus = paths['/api/status'].get as {
    responses?: Record<string, { content?: { 'application/json'?: { schema?: { type?: string; items?: { $ref?: string } } } } }>;
  };
  const statusArray = getStatus.responses?.['200']?.content?.['application/json']?.schema;
  assert(statusArray?.type === 'array', 'GET /api/status must return an array');
  assert(
    statusArray?.items?.$ref === '#/components/schemas/ServiceStatus',
    'GET /api/status items must $ref ServiceStatus',
  );

  const postStatus = paths['/api/status'].post as {
    requestBody?: { content?: { 'application/json'?: { schema?: { $ref?: string } } } };
  };
  assert(
    postStatus.requestBody?.content?.['application/json']?.schema?.$ref === '#/components/schemas/ServiceStatus',
    'POST /api/status body must $ref ServiceStatus',
  );

  const getIncidents = paths['/api/incidents'].get as {
    parameters?: Array<{ name?: string; in?: string }>;
    responses?: Record<string, { content?: { 'application/json'?: { schema?: { type?: string; items?: { $ref?: string } } } } }>;
  };
  const incidentArray = getIncidents.responses?.['200']?.content?.['application/json']?.schema;
  assert(incidentArray?.type === 'array', 'GET /api/incidents must return an array');
  assert(
    incidentArray?.items?.$ref === '#/components/schemas/Incident',
    'GET /api/incidents items must $ref Incident',
  );
  const queryParams = (getIncidents.parameters ?? []).filter((p) => p.in === 'query').map((p) => p.name);
  assert(queryParams.length > 0, 'GET /api/incidents must declare optional query filters');

  const postIncident = paths['/api/incidents'].post as {
    requestBody?: { content?: { 'application/json'?: { schema?: { $ref?: string } } } };
  };
  assert(
    postIncident.requestBody?.content?.['application/json']?.schema?.$ref === '#/components/schemas/Incident',
    'POST /api/incidents body must $ref Incident',
  );

  const schemas = doc.components?.schemas ?? {};
  assert(schemas.ServiceStatus, 'components.schemas.ServiceStatus is required');
  assert(schemas.Incident, 'components.schemas.Incident is required');

  const serviceStatus = schemas.ServiceStatus;
  assert(serviceStatus.type === 'object', 'ServiceStatus must be an object');
  for (const field of ['id', 'name', 'status', 'last_checked'] as const) {
    assert(serviceStatus.required?.includes(field), `ServiceStatus.required must include ${field}`);
  }
  assert(serviceStatus.properties, 'ServiceStatus.properties required');
  assertStringProp(serviceStatus.properties, 'id', { label: 'ServiceStatus' });
  assertStringProp(serviceStatus.properties, 'name', { label: 'ServiceStatus' });
  assertStringProp(serviceStatus.properties, 'last_checked', { format: 'date-time', label: 'ServiceStatus' });
  const statusEnum = resolveRef(doc, serviceStatus.properties.status);
  assertEnum(statusEnum, ['green', 'yellow', 'red'], 'ServiceStatus.status');

  const incident = schemas.Incident;
  assert(incident.type === 'object', 'Incident must be an object');
  for (const field of ['id', 'service_id', 'title', 'severity', 'description', 'started_at'] as const) {
    assert(incident.required?.includes(field), `Incident.required must include ${field}`);
  }
  assert(incident.properties, 'Incident.properties required');
  assertStringProp(incident.properties, 'id', { label: 'Incident' });
  assertStringProp(incident.properties, 'service_id', { label: 'Incident' });
  assertStringProp(incident.properties, 'title', { label: 'Incident' });
  assertStringProp(incident.properties, 'description', { label: 'Incident' });
  assertStringProp(incident.properties, 'started_at', { format: 'date-time', label: 'Incident' });
  assert(incident.properties.resolved_at, 'Incident.resolved_at is required');
  assertStringProp(incident.properties, 'resolved_at', { format: 'date-time', nullable: true, label: 'Incident' });
  const severityEnum = resolveRef(doc, incident.properties.severity);
  assertEnum(severityEnum, ['low', 'med', 'high', 'critical'], 'Incident.severity');

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
