'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import VideoPlayer from '../components/VideoPlayer';
import CameraList from '../components/CameraList';
import IncidentsList from '../components/IncidentsList';
import Timeline from '../components/Timeline';

interface Camera {
  id: number;
  name: string;
  location: string;
  incidents: Incident[];
}

interface Incident {
  id: number;
  cameraId: number;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  camera: Camera;
}

export default function Dashboard() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCameras();
    fetchIncidents();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await fetch('/api/cameras');
      const data = await response.json();
      setCameras(data);
      if (data.length > 0) {
        setSelectedCamera(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents?resolved=false');
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveIncident = async (incidentId: number) => {
    try {
      await fetch(`/api/incidents/${incidentId}`, {
        method: 'PATCH',
      });
      fetchIncidents(); // Refresh incidents
    } catch (error) {
      console.error('Failed to resolve incident:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="xl:col-span-3">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {selectedCamera && (
                <VideoPlayer 
                  camera={selectedCamera}
                  incidents={incidents.filter(i => i.cameraId === selectedCamera.id)}
                />
              )}
            </div>
            
            {/* Timeline */}
            <div className="mt-4">
              <Timeline 
                incidents={incidents.filter(i => selectedCamera && i.cameraId === selectedCamera.id)}
              />
            </div>
            
            {/* Camera List */}
            <div className="mt-4">
              <CameraList 
                // cameras={cameras}
                // selectedCamera={selectedCamera}
                // onCameraSelect={setSelectedCamera}
                // incidents={incidents}
              />
            </div>
          </div>
          
          {/* Incidents Sidebar */}
          <div className="xl:col-span-1">
            <IncidentsList 
              incidents={incidents}
              onResolveIncident={resolveIncident}
            />
          </div>
        </div>
      </div>
    </div>
  );
}