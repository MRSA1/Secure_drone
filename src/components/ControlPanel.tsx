import React from 'react';
import { SwarmParams } from '../types/drone';
import { Settings, Zap, Timer, Target, TrendingUp } from 'lucide-react';

interface ControlPanelProps {
  params: SwarmParams;
  onParamsChange: (params: SwarmParams) => void;
  isActive: boolean;
  onToggleActive: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  onParamsChange,
  isActive,
  onToggleActive
}) => {
  const handleParamChange = (key: keyof SwarmParams, value: number) => {
    onParamsChange({
      ...params,
      [key]: value
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Swarm Parameters</h3>
        </div>
        <button
          onClick={onToggleActive}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-300
            ${isActive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
            }
          `}
        >
          {isActive ? 'Stop Swarm' : 'Start Swarm'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Sync Time */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-blue-400" />
            <label className="text-sm font-medium text-gray-300">
              Total Sync Time (T)
            </label>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={params.totalSyncT}
              onChange={(e) => handleParamChange('totalSyncT', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.5s</span>
              <span className="text-cyan-400 font-medium">{params.totalSyncT.toFixed(1)}s</span>
              <span>5.0s</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">Global synchronization cycle duration</p>
        </div>

        {/* Coupling Strength */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-green-400" />
            <label className="text-sm font-medium text-gray-300">
              Coupling Strength
            </label>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={params.couplingStrength}
              onChange={(e) => handleParamChange('couplingStrength', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.1</span>
              <span className="text-green-400 font-medium">{params.couplingStrength.toFixed(2)}</span>
              <span>1.0</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">Kuramoto oscillator coupling intensity</p>
        </div>

        {/* Lambda Penalty */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <label className="text-sm font-medium text-gray-300">
              Sync Reward (λ)
            </label>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={params.lambdaPenalty}
              onChange={(e) => handleParamChange('lambdaPenalty', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.1</span>
              <span className="text-purple-400 font-medium">{params.lambdaPenalty.toFixed(1)}</span>
              <span>2.0</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">Synchronization reward weight in optimization</p>
        </div>

        {/* Gravity Constant */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <label className="text-sm font-medium text-gray-300">
              Gravity Constant
            </label>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="0.5"
              value={params.gravityConstant}
              onChange={(e) => handleParamChange('gravityConstant', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1.0</span>
              <span className="text-yellow-400 font-medium">{params.gravityConstant.toFixed(1)} m/s²</span>
              <span>20.0</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">Projectile motion physics parameter</p>
        </div>

        {/* Energy Threshold */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-red-400" />
            <label className="text-sm font-medium text-gray-300">
              Energy Threshold
            </label>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={params.energyThreshold}
              onChange={(e) => handleParamChange('energyThreshold', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10%</span>
              <span className="text-red-400 font-medium">{params.energyThreshold.toFixed(0)}%</span>
              <span>90%</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">Minimum energy level before recharge</p>
        </div>
      </div>

      {/* Mathematical Equations Display */}
      <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
        <h4 className="text-sm font-medium text-cyan-400 mb-3">Active Mathematical Models</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-2">
            <div className="text-gray-400">Phase Evolution:</div>
            <div className="text-green-400">dφᵢ/dt = Ω + K·sin(φⱼ - φᵢ)</div>
          </div>
          <div className="space-y-2">
            <div className="text-gray-400">Optimization:</div>
            <div className="text-purple-400">min C + ∑E - λS</div>
          </div>
          <div className="space-y-2">
            <div className="text-gray-400">Timing Constraint:</div>
            <div className="text-blue-400">t_strike + t_air = T</div>
          </div>
          <div className="space-y-2">
            <div className="text-gray-400">Projectile Motion:</div>
            <div className="text-yellow-400">x(t), y(t) = f(v₀, θ, g)</div>
          </div>
        </div>
      </div>
    </div>
  );
};