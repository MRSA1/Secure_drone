import React from 'react';
import { OptimizationResult } from '../types/drone';
import { TrendingUp, Zap, Clock, Target } from 'lucide-react';

interface MetricsPanelProps {
  optimization: OptimizationResult;
  avgEnergy: number;
  avgPhase: number;
  timingViolations: number;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  optimization,
  avgEnergy,
  avgPhase,
  timingViolations
}) => {
  const metrics = [
    {
      label: 'Objective Score',
      value: optimization.objective.toFixed(2),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      description: 'C + ∑E - λS optimization result'
    },
    {
      label: 'Total Energy',
      value: `${optimization.totalEnergy.toFixed(1)}%`,
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      description: 'Cumulative energy consumption'
    },
    {
      label: 'Sync Score',
      value: `${(optimization.syncScore * 100).toFixed(1)}%`,
      icon: <Target className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      description: 'Kuramoto order parameter (R)'
    },
    {
      label: 'Timing Violations',
      value: timingViolations.toString(),
      icon: <Clock className="w-5 h-5" />,
      color: timingViolations > 0 ? 'text-red-400' : 'text-green-400',
      bgColor: timingViolations > 0 ? 'bg-red-500/10' : 'bg-green-500/10',
      description: 'Strike + air time > T violations'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <div className={metric.color}>
                {metric.icon}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {metric.label}
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed">
            {metric.description}
          </p>

          {/* Progress bar for visual representation */}
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-500 ${
                  metric.color.includes('purple') ? 'bg-purple-500' :
                  metric.color.includes('yellow') ? 'bg-yellow-500' :
                  metric.color.includes('green') ? 'bg-green-500' :
                  'bg-red-500'
                }`}
                style={{ 
                  width: `${
                    metric.label === 'Sync Score' ? optimization.syncScore * 100 :
                    metric.label === 'Total Energy' ? Math.min(100, optimization.totalEnergy) :
                    metric.label === 'Objective Score' ? Math.min(100, Math.max(0, 100 - optimization.objective * 10)) :
                    timingViolations === 0 ? 100 : Math.max(0, 100 - timingViolations * 20)
                  }%` 
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};