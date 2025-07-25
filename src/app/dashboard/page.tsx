'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import VideoPlayer from '../components/VideoPlayer';
import CameraList from '../components/CameraList';
import IncidentsList from '../components/IncidentsList';
import Timeline from '../components/Timeline';
import type { Camera, Incident } from '../types';

export default function Dashboard() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchCameras(), fetchIncidents()]);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  // Add error boundary
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <main className="container mx-auto px-4 py-6">
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
                cameras={cameras}
                selectedCamera={selectedCamera}
                onCameraSelect={setSelectedCamera}
                incidents={incidents}
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
      </main>
    </div>
  );
}