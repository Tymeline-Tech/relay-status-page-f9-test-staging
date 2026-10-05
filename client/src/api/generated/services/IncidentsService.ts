/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Incident } from '../models/Incident';
import type { IncidentSeverity } from '../models/IncidentSeverity';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class IncidentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List incidents
     * Returns known incidents, optionally filtered by query parameters.
     * @param serviceId Filter incidents by related service identifier
     * @param severity Filter incidents by severity level
     * @param resolved When true, return only resolved incidents; when false, only open ones
     * @returns Incident Incident list
     * @throws ApiError
     */
    public listIncidents(
        serviceId?: string,
        severity?: IncidentSeverity,
        resolved?: boolean,
    ): CancelablePromise<Array<Incident>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/incidents',
            query: {
                'service_id': serviceId,
                'severity': severity,
                'resolved': resolved,
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
        requestBody: Incident,
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
