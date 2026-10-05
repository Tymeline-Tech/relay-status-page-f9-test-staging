/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IncidentSeverity } from './IncidentSeverity';
import type { IncidentStatus } from './IncidentStatus';
/**
 * Payload for opening a new incident
 */
export type IncidentInput = {
    title: string;
    description?: string;
    status: IncidentStatus;
    severity: IncidentSeverity;
    affectedServices?: Array<string>;
};

