/* openapi-spec-version: 1.0.0 */
/* generated-by: openapi-typescript-codegen */
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { IncidentsService } from './services/IncidentsService';
import { StatusService } from './services/StatusService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class apiClient {
    public readonly incidents: IncidentsService;
    public readonly status: StatusService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.incidents = new IncidentsService(this.request);
        this.status = new StatusService(this.request);
    }
}

