# Relay Status Page F9 Test

Monorepo foundation for the Relay Status Page: frozen OpenAPI 3.0.2 contract and
generated TypeScript client stubs for the React app.

## Layout

- `contracts/openapi.yaml` — committed OpenAPI 3.0.2 source of truth (`ServiceStatus`, `Incident`, `/api/status`, `/api/incidents`)
- `docs/openapi.yaml` — verification artifact (written by `validate:openapi` / `generate:client`)
- `client/src/api/generated/` — generated TypeScript client (written by `npm test`)
- `client/src/api/index.ts` — exports `createApiClient` factory for the React app

## Scripts

- `npm run validate:openapi` — validate the contract and write `docs/openapi.yaml`
- `npm run generate:client` — generate `client/src/api/generated/` from the OpenAPI spec
- `npm test` — regenerate client stubs and run the self-check

## Client usage

```ts
import { createApiClient } from './src/api';

const client = createApiClient({ BASE: '' });
const statuses = await client.status.listServiceStatuses();
const incidents = await client.incidents.listIncidents();
```
