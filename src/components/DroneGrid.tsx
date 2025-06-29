import React from 'react';
import { DroneState } from '../types/drone';
import { Activity, Zap, Clock, Target } from 'lucide-react';

interface DroneGridProps {
  drones: DroneState[];
  selectedDrone: string | null;
  onSelectDrone: (droneId: string) => void;
}

export const DroneGrid: React.FC<DroneGridProps> = ({ drones, selectedDrone, onSelectDrone }) => {
  const getStatusColor = (status: DroneState['status']) => {
    const colors = {
      active: 'bg-green-500',
      syncing: 'bg-blue-500',
      idle: 'bg-yellow-500',
      error: 'bg-red-500'
    };
    return colors[status];
  };

  const getStatusIcon = (status: DroneState['status']) => {
    const icons = {
      active: <Activity className="w-4 h-4" />,
      syncing: <Target className="w-4 h-4" />,
      idle: <Clock className="w-4 h-4" />,
      error: <Zap className="w-4 h-4" />
    };
    return icons[status];
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {drones.map((drone) => (
        <div
          key={drone.id}
          onClick={() => onSelectDrone(drone.id)}
          className={`
            relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105
            ${selectedDrone === drone.id 
              ? 'bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border-2 border-cyan-400' 
              : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
            }
            backdrop-blur-sm
          `}
        >
          {/* Status indicator */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(drone.status)} shadow-lg animate-pulse`} />
              <span className="text-sm font-medium text-gray-300">{drone.id}</span>
            </div>
            <div className="text-gray-400">
              {getStatusIcon(drone.status)}
            </div>
          </div>

          {/* Phase visualization */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Phase</span>
              <span className="text-xs text-cyan-400">{(drone.phase * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${drone.phase * 100}%` }}
              />
            </div>
          </div>

          {/* Energy level */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Energy</span>
              <span className="text-xs text-green-400">{drone.energy.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  drone.energy > 60 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  drone.energy > 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{ width: `${drone.energy}%` }}
              />
            </div>
          </div>

          {/* Position */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>X: {drone.position.x.toFixed(1)}</div>
            <div>Y: {drone.position.y.toFixed(1)}</div>
            <div>Z: {drone.position.z.toFixed(1)}</div>
          </div>

          {/* Timing info */}
          <div className="mt-2 text-xs text-gray-500">
            <div>Strike: {drone.strikeTime.toFixed(2)}s</div>
            <div>Air: {drone.airTime.toFixed(2)}s</div>
          </div>

          {/* Selection indicator */}
          {selectedDrone === drone.id && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};