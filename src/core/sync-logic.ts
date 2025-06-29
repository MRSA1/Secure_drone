import { DroneState } from '../types/drone';

export class BiologicalSync {
  /**
   * Timing-Aware Kuramoto Model with biological constraints
   * Based on dolphin/fish synchronization patterns
   */
  static updatePhaseWithTiming(
    currentPhase: number,
    receivedPhases: number[],
    strikeTime: number,
    airTime: number,
    totalSyncT: number,
    couplingStrength: number = 0.5
  ): number {
    if (receivedPhases.length === 0) {
      return currentPhase;
    }

    // Convert to complex representation for phase calculations
    const neighborVectors = receivedPhases.map(phase => 
      ({ 
        real: Math.cos(2 * Math.PI * phase), 
        imag: Math.sin(2 * Math.PI * phase) 
      })
    );

    // Calculate mean field
    const meanReal = neighborVectors.reduce((sum, v) => sum + v.real, 0) / neighborVectors.length;
    const meanImag = neighborVectors.reduce((sum, v) => sum + v.imag, 0) / neighborVectors.length;

    // Phase difference calculation
    const ownReal = Math.cos(2 * Math.PI * currentPhase);
    const ownImag = Math.sin(2 * Math.PI * currentPhase);
    
    const crossReal = meanReal * ownReal + meanImag * ownImag;
    const crossImag = meanImag * ownReal - meanReal * ownImag;
    
    const phaseDiff = Math.atan2(crossImag, crossReal) / (2 * Math.PI);
    
    let nextPhase = (currentPhase + couplingStrength * phaseDiff) % 1.0;
    if (nextPhase < 0) nextPhase += 1.0;

    // Biological timing constraint: t_strike + t_air = T
    if (strikeTime + airTime > totalSyncT) {
      console.warn(`[BiologicalSync] Timing constraint violated: ${strikeTime + airTime} > ${totalSyncT}`);
      // Apply penalty by delaying synchronization
      nextPhase = (nextPhase - 0.1) % 1.0;
      if (nextPhase < 0) nextPhase += 1.0;
    }

    return nextPhase;
  }

  /**
   * Calculate synchronization order parameter (Kuramoto R)
   */
  static calculateSyncScore(phases: number[]): number {
    if (phases.length === 0) return 0;

    const sumReal = phases.reduce((sum, phase) => sum + Math.cos(2 * Math.PI * phase), 0);
    const sumImag = phases.reduce((sum, phase) => sum + Math.sin(2 * Math.PI * phase), 0);

    const R = Math.sqrt(sumReal * sumReal + sumImag * sumImag) / phases.length;
    return R;
  }

  /**
   * Dolphin-inspired formation control
   */
  static calculateFormationForce(
    dronePos: { x: number; y: number; z: number },
    neighbors: Array<{ x: number; y: number; z: number }>,
    desiredDistance: number = 10
  ): { x: number; y: number; z: number } {
    let forceX = 0, forceY = 0, forceZ = 0;

    neighbors.forEach(neighbor => {
      const dx = neighbor.x - dronePos.x;
      const dy = neighbor.y - dronePos.y;
      const dz = neighbor.z - dronePos.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance > 0) {
        const forceMagnitude = (desiredDistance - distance) * 0.1;
        forceX += (dx / distance) * forceMagnitude;
        forceY += (dy / distance) * forceMagnitude;
        forceZ += (dz / distance) * forceMagnitude;
      }
    });

    return { x: forceX, y: forceY, z: forceZ };
  }
}