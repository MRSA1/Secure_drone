import { useState, useEffect, useCallback } from 'react';
import { DroneState, SwarmParams, OptimizationResult } from '../types/drone';
import { BiologicalSync } from '../core/sync-logic';
import { SwarmOptimization } from '../core/optimization';
import { BiophysicsEngine } from '../core/kinematics';

export const useSwarmSimulation = (initialParams: SwarmParams) => {
  const [drones, setDrones] = useState<DroneState[]>([]);
  const [params, setParams] = useState<SwarmParams>(initialParams);
  const [isActive, setIsActive] = useState(false);
  const [optimization, setOptimization] = useState<OptimizationResult>({
    cost: 0,
    totalEnergy: 0,
    syncScore: 0,
    objective: 0
  });
  const [timingViolations, setTimingViolations] = useState(0);

  // Initialize drones
  const initializeDrones = useCallback(() => {
    const droneCount = 12;
    const newDrones: DroneState[] = [];

    for (let i = 0; i < droneCount; i++) {
      newDrones.push({
        id: `D${i.toString().padStart(2, '0')}`,
        position: {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          z: Math.random() * 20 + 10
        },
        velocity: {
          x: (Math.random() - 0.5) * 5,
          y: (Math.random() - 0.5) * 5,
          z: (Math.random() - 0.5) * 2
        },
        phase: Math.random(),
        energy: Math.random() * 40 + 60, // 60-100%
        status: Math.random() > 0.8 ? 'idle' : 'active',
        lastSync: Date.now(),
        strikeTime: Math.random() * 0.4 + 0.2, // 0.2-0.6s
        airTime: Math.random() * 0.5 + 0.3 // 0.3-0.8s
      });
    }

    setDrones(newDrones);
  }, []);

  // Simulation step
  const simulationStep = useCallback(() => {
    if (!isActive) return;

    setDrones(prevDrones => {
      const updatedDrones = prevDrones.map(drone => {
        // Skip if drone has low energy
        if (drone.energy < params.energyThreshold) {
          return {
            ...drone,
            status: 'idle' as const,
            energy: Math.min(100, drone.energy + 2) // Slow recharge
          };
        }

        // Get neighbor phases for synchronization
        const neighbors = prevDrones.filter(d => d.id !== drone.id);
        const neighborPhases = neighbors
          .filter(neighbor => {
            const dx = neighbor.position.x - drone.position.x;
            const dy = neighbor.position.y - drone.position.y;
            const dz = neighbor.position.z - drone.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            return distance < 30; // Communication range
          })
          .map(neighbor => neighbor.phase);

        // Update phase using biological synchronization
        const newPhase = BiologicalSync.updatePhaseWithTiming(
          drone.phase,
          neighborPhases,
          drone.strikeTime,
          drone.airTime,
          params.totalSyncT,
          params.couplingStrength
        );

        // Update position using schooling behavior
        const neighborPositions = neighbors
          .filter(neighbor => {
            const dx = neighbor.position.x - drone.position.x;
            const dy = neighbor.position.y - drone.position.y;
            const dz = neighbor.position.z - drone.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            return distance < 25;
          })
          .map(neighbor => ({
            position: neighbor.position,
            velocity: neighbor.velocity
          }));

        const schoolingForce = BiophysicsEngine.calculateSchoolingForce(
          drone.position,
          drone.velocity,
          neighborPositions
        );

        // Apply forces and update physics
        const acceleration = {
          x: schoolingForce.x * 0.1,
          y: schoolingForce.y * 0.1,
          z: schoolingForce.z * 0.1
        };

        const { position: newPosition, velocity: newVelocity } = BiophysicsEngine.updatePosition3D(
          drone.position,
          drone.velocity,
          acceleration,
          0.1, // dt
          1.0  // fluid density
        );

        // Energy consumption based on movement
        const speed = Math.sqrt(
          newVelocity.x * newVelocity.x + 
          newVelocity.y * newVelocity.y + 
          newVelocity.z * newVelocity.z
        );
        const energyConsumption = speed * 0.05 + 0.1;

        // Determine status
        let newStatus: DroneState['status'] = 'active';
        if (neighborPhases.length > 0) {
          const phaseDiff = Math.abs(newPhase - neighborPhases[0]);
          if (phaseDiff > 0.1 && phaseDiff < 0.9) {
            newStatus = 'syncing';
          }
        }

        return {
          ...drone,
          phase: newPhase,
          position: newPosition,
          velocity: newVelocity,
          energy: Math.max(0, drone.energy - energyConsumption),
          status: newStatus,
          lastSync: Date.now()
        };
      });

      // Calculate metrics
      const phases = updatedDrones.map(d => d.phase);
      const energies = updatedDrones.map(d => d.energy);
      const syncScore = BiologicalSync.calculateSyncScore(phases);
      
      // Count timing violations
      const violations = updatedDrones.filter(d => 
        d.strikeTime + d.airTime > params.totalSyncT
      ).length;

      setTimingViolations(violations);

      // Calculate optimization result
      const cost = SwarmOptimization.calculateOperationalCost(
        params.totalSyncT,
        updatedDrones.length,
        1.0
      );

      const optimizationResult = SwarmOptimization.evaluateStrategy(
        cost,
        energies,
        syncScore,
        params.lambdaPenalty
      );

      setOptimization(optimizationResult);

      return updatedDrones;
    });
  }, [isActive, params]);

  // Initialize on mount
  useEffect(() => {
    initializeDrones();
  }, [initializeDrones]);

  // Run simulation
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(simulationStep, 100); // 10 FPS
    return () => clearInterval(interval);
  }, [simulationStep, isActive]);

  return {
    drones,
    params,
    setParams,
    isActive,
    setIsActive,
    optimization,
    timingViolations,
    syncScore: optimization.syncScore,
    reinitialize: initializeDrones
  };
};