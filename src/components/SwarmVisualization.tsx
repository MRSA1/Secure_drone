import React, { useEffect, useRef } from 'react';
import { DroneState } from '../types/drone';

interface SwarmVisualizationProps {
  drones: DroneState[];
  selectedDrone: string | null;
  syncScore: number;
}

export const SwarmVisualization: React.FC<SwarmVisualizationProps> = ({
  drones,
  selectedDrone,
  syncScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < rect.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, rect.height);
      ctx.stroke();
    }
    for (let i = 0; i < rect.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(rect.width, i);
      ctx.stroke();
    }

    // Calculate scale for positioning drones
    const scaleX = rect.width / 100;
    const scaleY = rect.height / 100;

    // Draw connections between nearby drones
    ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 + syncScore * 0.7})`;
    ctx.lineWidth = 1;
    drones.forEach((drone, i) => {
      drones.slice(i + 1).forEach(otherDrone => {
        const dx = drone.position.x - otherDrone.position.x;
        const dy = drone.position.y - otherDrone.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 25) { // Connection threshold
          const x1 = (drone.position.x + 50) * scaleX;
          const y1 = (drone.position.y + 50) * scaleY;
          const x2 = (otherDrone.position.x + 50) * scaleX;
          const y2 = (otherDrone.position.y + 50) * scaleY;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      });
    });

    // Draw drones
    drones.forEach(drone => {
      const x = (drone.position.x + 50) * scaleX;
      const y = (drone.position.y + 50) * scaleY;
      const isSelected = selectedDrone === drone.id;

      // Draw drone body
      ctx.fillStyle = isSelected ? '#06b6d4' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 8 : 6, 0, 2 * Math.PI);
      ctx.fill();

      // Draw phase indicator (ring around drone)
      const phaseAngle = drone.phase * 2 * Math.PI;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 12, -Math.PI / 2, -Math.PI / 2 + phaseAngle);
      ctx.stroke();

      // Draw energy level (inner circle)
      ctx.fillStyle = drone.energy > 50 ? '#10b981' : drone.energy > 25 ? '#f59e0b' : '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Draw drone ID
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(drone.id, x, y - 20);

      // Draw status indicator
      const statusColors = {
        active: '#10b981',
        syncing: '#3b82f6',
        idle: '#f59e0b',
        error: '#ef4444'
      };
      ctx.fillStyle = statusColors[drone.status];
      ctx.beginPath();
      ctx.arc(x + 10, y - 10, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw synchronization waves (visual effect)
    if (syncScore > 0.5) {
      const waveRadius = 50 + Math.sin(Date.now() * 0.01) * 20;
      ctx.strokeStyle = `rgba(6, 182, 212, ${(syncScore - 0.5) * 0.6})`;
      ctx.lineWidth = 2;
      
      drones.forEach(drone => {
        const x = (drone.position.x + 50) * scaleX;
        const y = (drone.position.y + 50) * scaleY;
        
        ctx.beginPath();
        ctx.arc(x, y, waveRadius, 0, 2 * Math.PI);
        ctx.stroke();
      });
    }

  }, [drones, selectedDrone, syncScore]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Swarm Formation</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Sync Score: <span className="text-cyan-400 font-medium">{(syncScore * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-400">Active</span>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-400">Syncing</span>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-400">Idle</span>
          </div>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-80 rounded-lg bg-gray-900"
        style={{ imageRendering: 'pixelated' }}
      />
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Real-time bio-inspired drone formation with Kuramoto synchronization
      </div>
    </div>
  );
};