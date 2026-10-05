/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IncidentSeverity } from './IncidentSeverity';
import type { IncidentStatus } from './IncidentStatus';
/**
 * A service interruption or degradation event
 */
export type Incident = {
    id: string;
    title: string;
    description?: string;
    status: IncidentStatus;
    severity: IncidentSeverity;
    /**
     * Service names impacted by this incident
     */
    affectedServices?: Array<string>;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
};

