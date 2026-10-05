/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceStatus } from '../models/ServiceStatus';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class StatusService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List service statuses
     * Returns the current health status for all tracked services.
     * @returns ServiceStatus Current service statuses
     * @throws ApiError
     */
    public listServiceStatuses(): CancelablePromise<Array<ServiceStatus>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/status',
            errors: {
                500: `Unexpected server error`,
            },
        });
    }
    /**
     * Create or update a service status
     * Ingests a health-check result for a named service.
     * @param requestBody
     * @returns ServiceStatus Status recorded
     * @throws ApiError
     */
    public upsertServiceStatus(
        requestBody: ServiceStatus,
    ): CancelablePromise<ServiceStatus> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/status',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                500: `Unexpected server error`,
            },
        });
    }
}
