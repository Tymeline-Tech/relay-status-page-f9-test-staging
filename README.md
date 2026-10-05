# Relay Status Page F9 Test

Monorepo foundation for the Relay Status Page: OpenAPI 3.0 contract and
generated TypeScript client stubs for the React app.

## Scripts

- `npm run validate:openapi` — validate and rewrite `docs/openapi.yaml`
- `npm run generate:client` — generate `client/src/api/generated/` from the OpenAPI spec
- `npm test` — regenerate client stubs and run the self-check

## Client usage

```ts
import { createApiClient } from './src/api';

const client = createApiClient({ BASE: '' });
const statuses = await client.status.listServiceStatuses();
const incidents = await client.incidents.listIncidents();
```
