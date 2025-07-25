export interface Camera {
  id: number;
  name: string;
  location: string;
  status?: 'active' | 'inactive'; // Optional since not in Prisma schema
  incidents?: Incident[]; // Optional relation
}

export interface Incident {
  id: number;
  cameraId: number;
  type: 'Unauthorised Access' | 'Gun Threat' | 'Face Recognised';
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  camera?: Camera; // Optional relation for when included
}

export type IncidentType = 
  | 'Unauthorised Access'
  | 'Gun Threat' 
  | 'Face Recognised'
  | 'Traffic congestion';

export interface VideoStream {
  cameraId: number;
  name: string;
  streamUrl: string;
  streamType: 'live' | 'backup';
  status: 'online' | 'offline' | 'configured';
  quality: string;
  fps: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalCameras: number;
  onlineCameras: number;
  totalIncidents: number;
  unresolvedIncidents: number;
  incidentsByType: Record<IncidentType, number>;
  lastUpdated: string;
}