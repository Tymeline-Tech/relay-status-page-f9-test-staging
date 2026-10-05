/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthState } from './HealthState';
/**
 * Current health status for a single service
 */
export type ServiceStatus = {
    /**
     * Stable service identifier
     */
    id: string;
    /**
     * Human-readable service name
     */
    name: string;
    status: HealthState;
    /**
     * Optional operator-facing note
     */
    description?: string;
    /**
     * Last status change timestamp (ISO-8601)
     */
    updatedAt: string;
};

