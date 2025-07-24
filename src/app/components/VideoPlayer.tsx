'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw,
  Settings,
  Maximize2,
  Volume2
} from 'lucide-react';

interface Camera {
  id: number;
  name: string;
  location: string;
}

interface Incident {
  id: number;
  cameraId: number;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
}

interface VideoPlayerProps {
  camera: Camera;
  incidents: Incident[];
}

export default function VideoPlayer({ camera, incidents }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Demo video URLs - you can replace these with your actual video sources
  const videoSources = {
    1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    3: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  };

  const currentVideoUrl = videoSources[camera.id as keyof typeof videoSources] || videoSources[1];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [currentVideoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB');
    const time = now.toLocaleTimeString('en-GB', { hour12: false });
    return `${date} - ${time}`;
  };

  return (
    <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden">
      {/* Video Display */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={currentVideoUrl}
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Overlay Information */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-2 rounded">
          <div className="text-white text-sm font-medium">{camera.name}</div>
          <div className="text-gray-300 text-xs">{getCurrentTimestamp()}</div>
        </div>

        {/* Incident Alerts */}
        {incidents.filter(i => !i.resolved).length > 0 && (
          <div className="absolute top-4 right-4 space-y-2">
            {incidents.filter(i => !i.resolved).slice(0, 3).map((incident) => (
              <div key={incident.id} className="bg-red-600 bg-opacity-90 px-3 py-2 rounded text-white text-sm">
                <div className="font-medium">{incident.type}</div>
                <div className="text-xs opacity-90">
                  {new Date(incident.tsStart).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Center Play Button */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all"
          >
            <div className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all">
              <Play className="text-black" size={32} fill="currentColor" />
            </div>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => skipTime(-10)}
              className="text-white hover:text-orange-500 transition-colors"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={togglePlay}
              className="bg-orange-500 hover:bg-orange-600 rounded-full p-2 transition-colors"
            >
              {isPlaying ? (
                <Pause className="text-white" size={20} fill="currentColor" />
              ) : (
                <Play className="text-white" size={20} fill="currentColor" />
              )}
            </button>
            
            <button
              onClick={() => skipTime(10)}
              className="text-white hover:text-orange-500 transition-colors"
            >
              <SkipForward size={20} />
            </button>

            <div className="text-white text-sm">
              1x <span className="text-gray-400 ml-2">{getCurrentTimestamp()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="text-white hover:text-orange-500 transition-colors">
              <RotateCcw size={18} />
            </button>
            <button className="text-white hover:text-orange-500 transition-colors">
              <Volume2 size={18} />
            </button>
            <button className="text-white hover:text-orange-500 transition-colors">
              <Settings size={18} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-orange-500 transition-colors"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}