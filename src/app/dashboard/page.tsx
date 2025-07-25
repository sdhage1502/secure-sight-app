'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import VideoPlayer from '../components/VideoPlayer';
import CameraList from '../components/CameraList';
import IncidentsList from '../components/IncidentsList';
import Timeline from '../components/Timeline';
import { fetchCameras, fetchIncidents, resolveIncident } from '../../lib/api';
import type { Camera, Incident } from '../types';

export default function Dashboard() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [camerasData, incidentsData] = await Promise.all([
        fetchCameras(),
        fetchIncidents(false),
      ]);

      setCameras(camerasData);
      setIncidents(incidentsData);

      if (camerasData.length > 0 && !selectedCamera) {
        setSelectedCamera(camerasData[0]);
      }
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

  const handleResolveIncident = async (incidentId: number) => {
    try {
      await resolveIncident(incidentId);
      const updatedIncidents = await fetchIncidents(false);
      setIncidents(updatedIncidents);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {selectedCamera && (
                <VideoPlayer
                  camera={selectedCamera}
                  incidents={incidents.filter((i) => i.cameraId === selectedCamera.id)}
                />
              )}
            </div>

            <div className="mt-4">
              <Timeline incidents={incidents.filter((i) => selectedCamera && i.cameraId === selectedCamera.id)} />
            </div>

            <div className="mt-4">
              <CameraList
                cameras={cameras}
                selectedCamera={selectedCamera}
                onCameraSelect={setSelectedCamera}
                incidents={incidents}
              />
            </div>
          </div>

          <div className="xl:col-span-1">
            <IncidentsList
              incidents={incidents}
              onResolveIncident={handleResolveIncident}
              cameras={cameras}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
