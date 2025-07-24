'use client';

import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface Camera {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  events: Array<{ type: 'Unauthorised Access' | 'Gun Threat' | 'Face Recognised'; time: string }>;
}

const CameraList: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await fetch('/api/cameras');
        const data = await response.json();
        setCameras(data.map((cam: any) => ({
          id: cam.id,
          name: cam.name,
          status: 'active', // Simplified; adjust based on actual data
          events: cam.incidents?.map((inc: any) => ({
            type: inc.type,
            time: new Date(inc.tsStart).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          })) || [],
        })));
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };
    fetchCameras();
  }, []);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Unauthorised Access':
        return 'bg-gradient-to-br from-gradient-start to-gradient-end';
      case 'Face Recognised':
        return 'bg-blue-500';
      case 'Gun Threat':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="dashboard-card">
      <div className="border-b border-gradient-end pb-4 mb-4">
        <h3 className="dashboard-header text-lg">Camera List</h3>
      </div>
      <div>
        <div className="space-y-4">
          {cameras.map((camera) => (
            <div key={camera.id} className={`p-4 rounded-dashboard cursor-pointer border-l-4 transition-all hover:bg-gradient-end ${
              camera.id === 1 ? 'bg-gradient-to-br from-gradient-start to-gradient-end border-gradient-start shadow-dashboard' : 'bg-gray-900 border-transparent'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-gradient-end" />
                  <span className="text-white text-base font-semibold">{camera.name}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {camera.events.map((event, index) => (
                  <div key={index} className={`inline-block ${getEventColor(event.type)} text-white text-xs px-3 py-1 rounded-dashboard transition-transform hover:scale-105`}>
                    <span className="hidden sm:inline">{event.type}</span>
                    <span className="sm:hidden">{event.type.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
              {camera.id === 1 && (
                <div className="flex items-center justify-between text-xs text-gradient-end">
                  <span>{camera.events.length} Multiple Events</span>
                  <span className="font-bold">Active</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CameraList;