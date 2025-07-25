'use client';

import { Camera as CameraIcon, AlertTriangle, Eye, MapPin, Signal, Clock } from 'lucide-react';
import type { Camera, Incident } from '../types';

interface CameraListProps {
  cameras: Camera[];
  selectedCamera: Camera | null;
  onCameraSelect: (camera: Camera) => void;
  incidents: Incident[];
}

export default function CameraList({ 
  cameras = [], 
  selectedCamera, 
  onCameraSelect, 
  incidents = [] 
}: CameraListProps) {
  
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'Gun Threat':
        return <AlertTriangle className="text-red-500" size={12} />;
      case 'Face Recognised':
        return <Eye className="text-blue-500" size={12} />;
      case 'Unauthorised Access':
        return <AlertTriangle className="text-orange-500" size={12} />;
      default:
        return <AlertTriangle className="text-orange-500" size={12} />;
    }
  };

  const getCameraIncidents = (cameraId: number) => {
    return incidents.filter(incident => 
      incident.cameraId === cameraId && !incident.resolved
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  // Generate demo video thumbnails for each camera
  const getCameraThumbnail = (cameraId: number) => {
    const thumbnails = {
      1: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&crop=center',
      2: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center',
      3: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop&crop=center'
    };
    return thumbnails[cameraId as keyof typeof thumbnails] || '/api/placeholder/160/90';
  };

  // Add error boundary
  if (!cameras.length) {
    return (
      <div className="dashboard-card">
        <p className="text-gray-400 text-center">No cameras available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg flex items-center space-x-2">
          <CameraIcon size={20} />
          <span>Camera List</span>
        </h3>
        <div className="text-gray-400 text-sm">
          {cameras.length} cameras online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map((camera) => {
          const cameraIncidents = getCameraIncidents(camera.id);
          const isSelected = selectedCamera?.id === camera.id;
          const lastIncident = cameraIncidents[0];
          
          return (
            <div
              key={camera.id}
              onClick={() => onCameraSelect(camera)}
              className={`relative bg-gray-700 rounded-lg p-3 cursor-pointer transition-all hover:bg-gray-600 ${
                isSelected ? 'ring-2 ring-orange-500 bg-gray-600' : ''
              }`}
            >
              {/* Camera Status Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></div>
                  <span className="text-white font-medium text-sm">{camera.name}</span>
                  <Signal className="text-green-500" size={12} />
                </div>
                {cameraIncidents.length > 0 && (
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {cameraIncidents.length}
                  </div>
                )}
              </div>

              {/* Camera Preview with Overlay */}
              <div className="relative bg-gray-900 rounded-lg mb-3 aspect-video overflow-hidden group">
                <img
                  src={getCameraThumbnail(camera.id)}
                  alt={`${camera.name} preview`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/160/90';
                  }}
                />
                
                {/* Live Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="font-medium">LIVE</span>
                  </div>
                  
                  {/* Camera ID */}
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Camera - {camera.id.toString().padStart(2, '0')}
                  </div>
                  
                  {/* Timestamp */}
                  <div className="absolute bottom-2 left-2 text-white text-xs font-mono">
                    {new Date().toLocaleString('en-GB', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: '2-digit',
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false 
                    })}
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-orange-500 rounded-lg"></div>
                )}
              </div>

              {/* Location Info */}
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="text-gray-400" size={12} />
                <span className="text-gray-400 text-xs">{camera.location}</span>
                <div className="flex-1"></div>
                <div className="text-green-500 text-xs font-medium">1080p</div>
              </div>

              {/* Recent Incidents */}
              {cameraIncidents.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 font-medium">Recent Activity:</div>
                  {cameraIncidents.slice(0, 2).map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between text-xs bg-gray-800 rounded p-2"
                    >
                      <div className="flex items-center space-x-2">
                        {getIncidentIcon(incident.type)}
                        <span className="text-gray-300 font-medium">{incident.type}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400">{formatTime(incident.tsStart)}</div>
                        <div className="text-gray-500 text-xs">{getTimeAgo(incident.tsStart)}</div>
                      </div>
                    </div>
                  ))}
                  {cameraIncidents.length > 2 && (
                    <div className="text-xs text-gray-400 text-center py-1 bg-gray-800 rounded">
                      +{cameraIncidents.length - 2} more events
                    </div>
                  )}
                  
                  {/* Last Activity */}
                  {lastIncident && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 pt-1 border-t border-gray-600">
                      <Clock size={10} />
                      <span>Last activity: {getTimeAgo(lastIncident.tsStart)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="text-green-500 text-xs font-medium mb-1">✓ All Clear</div>
                  <div className="text-gray-400 text-xs">No active incidents</div>
                </div>
              )}

              {/* Multiple Events Indicator */}
              {cameraIncidents.length >= 4 && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                  Multiple Events ⚠
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-green-500 font-semibold text-lg">{cameras.length}</div>
            <div className="text-gray-400 text-xs">Online</div>
          </div>
          <div>
            <div className="text-red-500 font-semibold text-lg">
              {incidents.filter(i => !i.resolved).length}
            </div>
            <div className="text-gray-400 text-xs">Active Alerts</div>
          </div>
          <div>
            <div className="text-blue-500 font-semibold text-lg">
              {incidents.filter(i => i.type === 'Face Recognised' && !i.resolved).length}
            </div>
            <div className="text-gray-400 text-xs">Face Alerts</div>
          </div>
          <div>
            <div className="text-orange-500 font-semibold text-lg">
              {incidents.filter(i => i.type === 'Unauthorised Access' && !i.resolved).length}
            </div>
            <div className="text-gray-400 text-xs">Access Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
}