import type { Camera, Incident } from '../app/types';

export function fetchCameras(): Promise<Camera[]>;

export function fetchIncidents(resolved?: boolean): Promise<Incident[]>;

export function resolveIncident(incidentId: number): Promise<void>;
