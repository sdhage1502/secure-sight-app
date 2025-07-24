'use client';

import { useState } from 'react';
import { AlertTriangle, Eye, Users } from 'lucide-react';

interface Incident {
  id: number;
  cameraId: number;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
}

interface TimelineProps {
  incidents: Incident[];
}

export default function Timeline({ incidents }: TimelineProps) {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  // Generate 24 hours timeline
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'Gun Threat':
        return <AlertTriangle className="text-red-500" size={14} />;
      case 'Face Recognised':
        return <Eye className="text-blue-500" size={14} />;
      case 'Unauthorised Access':
        return <AlertTriangle className="text-orange-500" size={14} />;
      default:
        return <AlertTriangle className="text-orange-500" size={14} />;
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'Gun Threat':
        return 'bg-red-500';
      case 'Face Recognised':
        return 'bg-blue-500';
      case 'Unauthorised Access':
        return 'bg-orange-500';
      default:
        return 'bg-orange-500';
    }
  };

  const getIncidentsForHour = (hour: number) => {
    return incidents.filter(incident => {
      const incidentHour = new Date(incident.tsStart).getHours();
      return incidentHour === hour;
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getCurrentTimeMarker = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const percentage = (currentMinute / 60) * 100;
    
    return {
      hour: currentHour,
      percentage,
      time: now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    };
  };

  const currentTime = getCurrentTimeMarker();

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">
          Timeline - 24 Hour View
        </h3>
        <div className="text-gray-400 text-sm">
          Current Time: {currentTime.time}
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Hour Labels */}
        <div className="flex mb-2">
          {hours.map(hour => (
            <div key={hour} className="flex-1 text-center">
              <div className="text-gray-400 text-xs">
                {hour.toString().padStart(2, '0')}:00
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Track */}
        <div className="relative bg-gray-700 h-12 rounded-lg overflow-hidden">
          {/* Hour Divisions */}
          {hours.map(hour => (
            <div
              key={hour}
              className="absolute top-0 bottom-0 border-r border-gray-600"
              style={{ left: `${(hour / 24) * 100}%` }}
            />
          ))}

          {/* Current Time Indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-20"
            style={{ 
              left: `${((currentTime.hour + (currentTime.percentage / 100)) / 24) * 100}%` 
            }}
          >
            <div className="absolute -top-6 -left-8 bg-yellow-400 text-black text-xs px-2 py-1 rounded whitespace-nowrap">
              {currentTime.time}
            </div>
          </div>

          {/* Incident Markers */}
          {incidents.map((incident) => {
            const startTime = new Date(incident.tsStart);
            const endTime = new Date(incident.tsEnd);
            const startHour = startTime.getHours();
            const startMinute = startTime.getMinutes();
            const endHour = endTime.getHours();
            const endMinute = endTime.getMinutes();
            
            const startPercentage = ((startHour + (startMinute / 60)) / 24) * 100;
            const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Duration in minutes
            const widthPercentage = (duration / (24 * 60)) * 100;

            return (
              <div
                key={incident.id}
                className={`absolute top-1 h-10 ${getIncidentColor(incident.type)} rounded cursor-pointer hover:opacity-80 transition-opacity z-10`}
                style={{
                  left: `${startPercentage}%`,
                  width: `${Math.max(widthPercentage, 0.5)}%`
                }}
                title={`${incident.type} - ${formatTime(incident.tsStart)}`}
              >
                <div className="flex items-center justify-center h-full">
                  {getIncidentIcon(incident.type)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-gray-400">Unauthorised Access</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-400">Face Recognised</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-400">Gun Threat</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="text-gray-400" size={12} />
            <span className="text-gray-400">4 Multiple Events</span>
          </div>
        </div>

        {/* Recent Events Summary */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Unauthorised Access', 'Face Recognised', 'Gun Threat'].map(type => {
            const typeIncidents = incidents.filter(i => i.type === type);
            const recentIncident = typeIncidents[0];
            
            return (
              <div key={type} className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  {getIncidentIcon(type)}
                  <span className="text-white text-sm font-medium">{type}</span>
                </div>
                {recentIncident ? (
                  <div className="text-gray-400 text-xs">
                    Last: {formatTime(recentIncident.tsStart)}
                    <div className="text-gray-500 mt-1">
                      Total today: {typeIncidents.length}
                    </div>
                  </div>
                ) : (
                  <div className="text-green-500 text-xs">No incidents today</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}