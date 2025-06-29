import { OptimizationResult } from '../types/drone';

export class SwarmOptimization {
  /**
   * Multi-objective optimization: min C + ∑E - λS
   * C = operational cost
   * E = energy consumption
   * S = synchronization score
   * λ = synchronization reward weight
   */
  static evaluateStrategy(
    costC: number,
    energyList: number[],
    syncScore: number,
    lambdaPenalty: number = 0.8
  ): OptimizationResult {
    const totalEnergy = energyList.reduce((sum, e) => sum + e, 0);
    const objective = costC + totalEnergy - lambdaPenalty * syncScore;

    return {
      cost: costC,
      totalEnergy,
      syncScore,
      objective
    };
  }

  /**
   * Calculate operational cost based on mission parameters
   */
  static calculateOperationalCost(
    missionTime: number,
    droneCount: number,
    complexity: number = 1.0
  ): number {
    return missionTime * droneCount * complexity * 0.5;
  }

  /**
   * Energy efficiency calculation
   */
  static calculateEnergyEfficiency(
    distances: number[],
    velocities: number[],
    syncScore: number
  ): number {
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
    
    // Higher sync = lower energy waste
    const efficiencyBonus = syncScore * 0.3;
    return Math.max(0, 1.0 - (avgDistance * 0.01 + avgVelocity * 0.05) + efficiencyBonus);
  }

  /**
   * Adaptive parameter tuning based on performance
   */
  static adaptParameters(
    currentParams: { couplingStrength: number; lambdaPenalty: number },
    performanceHistory: number[],
    targetPerformance: number = 0.8
  ): { couplingStrength: number; lambdaPenalty: number } {
    if (performanceHistory.length < 3) return currentParams;

    const recentPerformance = performanceHistory.slice(-3).reduce((sum, p) => sum + p, 0) / 3;
    const trend = recentPerformance - targetPerformance;

    let newCoupling = currentParams.couplingStrength;
    let newLambda = currentParams.lambdaPenalty;

    if (trend < -0.1) {
      // Performance declining, increase coupling
      newCoupling = Math.min(1.0, newCoupling + 0.05);
      newLambda = Math.min(1.0, newLambda + 0.02);
    } else if (trend > 0.1) {
      // Performance good, can reduce intensity
      newCoupling = Math.max(0.1, newCoupling - 0.02);
      newLambda = Math.max(0.1, newLambda - 0.01);
    }

    return {
      couplingStrength: newCoupling,
      lambdaPenalty: newLambda
    };
  }
}