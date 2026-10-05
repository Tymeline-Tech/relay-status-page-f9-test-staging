/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceStatusEnum } from './ServiceStatusEnum';
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
    status: ServiceStatusEnum;
    /**
     * Timestamp of the most recent health check (ISO-8601)
     */
    last_checked: string;
};

