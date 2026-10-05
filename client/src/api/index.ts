/**
 * Public API surface for the Relay Status Page React client.
 * Re-exports the generated OpenAPI client and a typed factory helper.
 */
export { apiClient } from './generated/apiClient';
export type { OpenAPIConfig } from './generated/core/OpenAPI';
export { ApiError } from './generated/core/ApiError';
export type { ServiceStatus } from './generated/models/ServiceStatus';
export type { Incident } from './generated/models/Incident';
export type { ServiceStatusInput } from './generated/models/ServiceStatusInput';
export type { IncidentInput } from './generated/models/IncidentInput';

import { apiClient } from './generated/apiClient';
import type { OpenAPIConfig } from './generated/core/OpenAPI';

/**
 * Create a typed API client bound to the given base URL / config.
 */
export function createApiClient(config: Partial<OpenAPIConfig> = {}): apiClient {
  return new apiClient({
    ...config,
    BASE: config.BASE ?? '',
  });
}
