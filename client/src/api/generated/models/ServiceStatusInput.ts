/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthState } from './HealthState';
/**
 * Payload for recording a service health check
 */
export type ServiceStatusInput = {
    name: string;
    status: HealthState;
    description?: string;
};

