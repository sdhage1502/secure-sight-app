'use client';

import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface Camera {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  events: Array<{ type: 'Unauthorised Access' | 'Gun Threat' | 'Face Recognised'; time: string }>;
}

const CameraGrid: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await fetch('/api/cameras');
        const data = await response.json();
        setCameras(data.map((cam: any) => ({
          id: cam.id,
          name: cam.name,
          status: cam.status || 'active',
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cameras.map((camera) => (
        <div key={camera.id} className="dashboard-card cursor-pointer hover:ring-2 hover:ring-gradient-start transition-all duration-200">
          <div className="relative">
            <img src="/image.png" alt={`Camera ${camera.id}`} className="w-full h-20 sm:h-24 md:h-28 object-cover" />
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded">
              <div className="flex items-center space-x-1">
                <div className={`w-1.5 h-1.5 rounded-full ${camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-white text-xs">LIVE</span>
              </div>
            </div>
          </div>
          <div className="p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">{camera.name}</span>
              <Camera className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {camera.events.length > 0 ? camera.events[0].type : 'No Events'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CameraGrid;