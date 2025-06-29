import React, { useState } from 'react';
import { useSwarmSimulation } from './hooks/useSwarmSimulation';
import { DroneGrid } from './components/DroneGrid';
import { ControlPanel } from './components/ControlPanel';
import { SwarmVisualization } from './components/SwarmVisualization';
import { MetricsPanel } from './components/MetricsPanel';
import { SwarmParams } from './types/drone';
import { Bone as Drone, Waves, Activity } from 'lucide-react';

const initialParams: SwarmParams = {
  totalSyncT: 1.0,
  couplingStrength: 0.7,
  lambdaPenalty: 0.8,
  gravityConstant: 9.81,
  energyThreshold: 30
};

function App() {
  const {
    drones,
    params,
    setParams,
    isActive,
    setIsActive,
    optimization,
    timingViolations,
    syncScore,
    reinitialize
  } = useSwarmSimulation(initialParams);

  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);

  const avgEnergy = drones.length > 0 
    ? drones.reduce((sum, drone) => sum + drone.energy, 0) / drones.length 
    : 0;

  const avgPhase = drones.length > 0
    ? drones.reduce((sum, drone) => sum + drone.phase, 0) / drones.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-cyan-600 rounded-lg">
                <Drone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">BioSync Drone Control</h1>
                <p className="text-gray-400 text-sm">Bio-inspired swarm synchronization system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-300">
                  {drones.filter(d => d.status === 'active').length} Active
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Waves className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-gray-300">
                  Sync: {(syncScore * 100).toFixed(1)}%
                </span>
              </div>
              <button
                onClick={reinitialize}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isActive}
              >
                Reset Swarm
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metrics */}
        <MetricsPanel
          optimization={optimization}
          avgEnergy={avgEnergy}
          avgPhase={avgPhase}
          timingViolations={timingViolations}
        />

        {/* Control Panel */}
        <ControlPanel
          params={params}
          onParamsChange={setParams}
          isActive={isActive}
          onToggleActive={() => setIsActive(!isActive)}
        />

        {/* Visualization */}
        <SwarmVisualization
          drones={drones}
          selectedDrone={selectedDrone}
          syncScore={syncScore}
        />

        {/* Drone Grid */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Drone Status Grid</h3>
          <DroneGrid
            drones={drones}
            selectedDrone={selectedDrone}
            onSelectDrone={setSelectedDrone}
          />
        </div>

        {/* Mathematical Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Bio-Mathematical Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-cyan-400">Kuramoto Synchronization</h4>
              <div className="text-sm text-gray-300 space-y-2">
                <p>Phase evolution follows biological oscillator dynamics:</p>
                <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                  dφᵢ/dt = ωᵢ + (K/N) ∑ⱼ sin(φⱼ - φᵢ)
                </div>
                <p className="text-gray-400">Where K = coupling strength, ωᵢ = natural frequency</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-green-400">Dolphin Formation Control</h4>
              <div className="text-sm text-gray-300 space-y-2">
                <p>Three-dimensional movement with fluid dynamics:</p>
                <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                  F⃗ = F⃗ₛₑₚ + F⃗ₐₗᵢgₙ + F⃗cₒₕₑsᵢₒₙ
                </div>
                <p className="text-gray-400">Separation, alignment, and cohesion forces</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-purple-400">Multi-Objective Optimization</h4>
              <div className="text-sm text-gray-300 space-y-2">
                <p>Minimize cost while maximizing synchronization:</p>
                <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                  min J = C + ∑ᵢ Eᵢ - λS
                </div>
                <p className="text-gray-400">C = cost, E = energy, S = sync score, λ = weight</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-yellow-400">Fish Strike Timing</h4>
              <div className="text-sm text-gray-300 space-y-2">
                <p>Projectile motion with timing constraints:</p>
                <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                  t_strike + t_air ≤ T_sync
                </div>
                <p className="text-gray-400">Biological timing must respect sync cycles</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-800/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>Bio-inspired drone swarm control system implementing Kuramoto synchronization and dolphin formation dynamics</p>
            <p className="mt-2">Mathematical models: Phase coupling • Projectile motion • Multi-objective optimization</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;