/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Incident } from '../models/Incident';
import type { IncidentInput } from '../models/IncidentInput';
import type { IncidentStatus } from '../models/IncidentStatus';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class IncidentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List incidents
     * Returns known incidents, newest first.
     * @param status Filter by incident status
     * @returns Incident Incident list
     * @throws ApiError
     */
    public listIncidents(
        status?: IncidentStatus,
    ): CancelablePromise<Array<Incident>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/incidents',
            query: {
                'status': status,
            },
            errors: {
                500: `Unexpected server error`,
            },
        });
    }
    /**
     * Create an incident
     * Opens a new incident record.
     * @param requestBody
     * @returns Incident Incident created
     * @throws ApiError
     */
    public createIncident(
        requestBody: IncidentInput,
    ): CancelablePromise<Incident> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/incidents',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                500: `Unexpected server error`,
            },
        });
    }
}
