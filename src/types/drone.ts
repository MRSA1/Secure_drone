export interface DroneState {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  phase: number;
  energy: number;
  status: 'active' | 'syncing' | 'idle' | 'error';
  lastSync: number;
  strikeTime: number;
  airTime: number;
}

export interface SwarmParams {
  totalSyncT: number;
  couplingStrength: number;
  lambdaPenalty: number;
  gravityConstant: number;
  energyThreshold: number;
}

export interface OptimizationResult {
  cost: number;
  totalEnergy: number;
  syncScore: number;
  objective: number;
}