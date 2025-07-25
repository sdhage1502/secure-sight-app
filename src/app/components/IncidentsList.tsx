'use client';

import { AlertTriangle, Clock, CheckCircle2, Eye } from 'lucide-react';
import type { Camera, Incident } from '../types';

interface IncidentsListProps {
  incidents: Incident[];
  onResolveIncident: (incidentId: number) => void;
  cameras?: Camera[]; // Add cameras prop to lookup camera data
}

export default function IncidentsList({ incidents, onResolveIncident, cameras = [] }: IncidentsListProps) {
  
  // Helper function to get camera data for an incident
  const getCameraForIncident = (incident: Incident) => {
    if (incident.camera) {
      return incident.camera;
    }
    // Fall back to finding camera by ID from the cameras prop
    const camera = cameras.find(c => c.id === incident.cameraId);
    return camera || { id: incident.cameraId, name: `Camera ${incident.cameraId}`, location: 'Unknown location' };
  };
  const unresolvedIncidents = incidents.filter(incident => !incident.resolved);
  const resolvedCount = incidents.length - unresolvedIncidents.length;

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'Gun Threat':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'Face Recognised':
        return <Eye className="text-blue-500" size={16} />;
      case 'Unauthorised Access':
        return <AlertTriangle className="text-orange-500" size={16} />;
      default:
        return <AlertTriangle className="text-orange-500" size={16} />;
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'Gun Threat':
        return 'text-red-500';
      case 'Face Recognised':
        return 'text-blue-500';
      case 'Unauthorised Access':
        return 'text-orange-500';
      default:
        return 'text-orange-500';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500 p-2 rounded-full">
            <AlertTriangle className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold">
              {unresolvedIncidents.length} Unresolved Incidents
            </h2>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">{unresolvedIncidents.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">{resolvedCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="text-green-500" size={14} />
            <span className="text-gray-400">{resolvedCount} resolved incidents</span>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {unresolvedIncidents.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="text-green-500 mx-auto mb-3" size={48} />
            <div className="text-gray-400">No unresolved incidents</div>
          </div>
        ) : (
          unresolvedIncidents.map((incident) => {
            const camera = getCameraForIncident(incident);
            return (
            <div
              key={incident.id}
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
            >
              {/* Incident Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getIncidentIcon(incident.type)}
                  <span className={`font-medium text-sm ${getIncidentColor(incident.type)}`}>
                    {incident.type}
                  </span>
                </div>
                <button
                  onClick={() => onResolveIncident(incident.id)}
                  className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full transition-colors"
                >
                  Resolve →
                </button>
              </div>

              {/* Camera Info */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gray-600 rounded overflow-hidden">
                  <img
                    src="/api/placeholder/32/32"
                    alt="Camera thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    {camera.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {camera.location}
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="bg-gray-900 rounded-lg p-2 mb-3">
                <img
                  src="/api/placeholder/200/120"
                  alt="Incident thumbnail"
                  className="w-full h-24 object-cover rounded"
                />
              </div>

              {/* Time Info */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>
                    {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)}
                  </span>
                </div>
                <span>on {formatDate(incident.tsStart)}</span>
              </div>
            </div>
          );
          })
        )}
      </div>

      {/* Footer Stats */}
      {unresolvedIncidents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-red-500 font-semibold text-lg">
                {unresolvedIncidents.filter(i => i.type === 'Gun Threat').length}
              </div>
              <div className="text-gray-400 text-xs">Gun Threats</div>
            </div>
            <div>
              <div className="text-orange-500 font-semibold text-lg">
                {unresolvedIncidents.filter(i => i.type === 'Unauthorised Access').length}
              </div>
              <div className="text-gray-400 text-xs">Access</div>
            </div>
            <div>
              <div className="text-blue-500 font-semibold text-lg">
                {unresolvedIncidents.filter(i => i.type === 'Face Recognised').length}
              </div>
              <div className="text-gray-400 text-xs">Faces</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}