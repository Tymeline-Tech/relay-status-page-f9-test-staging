/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IncidentSeverity } from './IncidentSeverity';
/**
 * A service interruption or degradation event
 */
export type Incident = {
    /**
     * Stable incident identifier
     */
    id: string;
    /**
     * Identifier of the affected service
     */
    service_id: string;
    /**
     * Short human-readable incident title
     */
    title: string;
    severity: IncidentSeverity;
    /**
     * Detailed description of the incident
     */
    description: string;
    /**
     * When the incident began (ISO-8601)
     */
    started_at: string;
    /**
     * When the incident was resolved; null if still open
     */
    resolved_at?: string | null;
};

