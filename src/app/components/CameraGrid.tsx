'use client';

import { Camera } from 'lucide-react';
import type { Camera as CameraType } from '../types';

interface CameraGridProps {
  cameras: CameraType[];
  onCameraSelect?: (camera: CameraType) => void;
}

const CameraGrid: React.FC<CameraGridProps> = ({ cameras, onCameraSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cameras.map((camera) => (
        <div
          key={camera.id}
          onClick={() => onCameraSelect?.(camera)}
          className="dashboard-card cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all duration-200"
        >
          <div className="relative">
            <img src="/image.png" alt={`Camera ${camera.id}`} className="w-full h-20 sm:h-24 md:h-28 object-cover" />
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded">
              <div className="flex items-center space-x-1">
                <div className={`w-1.5 h-1.5 rounded-full ${(camera.status || 'active') === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
              {camera.incidents && camera.incidents.length > 0 ? camera.incidents[0].type : 'No Incidents'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CameraGrid;