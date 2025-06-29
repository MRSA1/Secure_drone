export class BiophysicsEngine {
  /**
   * Fish-inspired projectile motion with environmental factors
   * 2D projectile equations: x(t), y(t)
   */
  static projectilePosition(
    v0: number,
    angleRad: number,
    t: number,
    g: number = 9.81,
    windResistance: number = 0.02
  ): { x: number; y: number } {
    const drag = Math.exp(-windResistance * t);
    const x = v0 * Math.cos(angleRad) * t * drag;
    const y = v0 * Math.sin(angleRad) * t * drag - 0.5 * g * t * t;
    
    return { x, y };
  }

  /**
   * Dolphin-inspired 3D movement with fluid dynamics
   * Control dynamics: r_i(t), v_i(t)
   */
  static updatePosition3D(
    currentPos: { x: number; y: number; z: number },
    currentVel: { x: number; y: number; z: number },
    acceleration: { x: number; y: number; z: number },
    dt: number,
    fluidDensity: number = 1.0
  ): { position: { x: number; y: number; z: number }, velocity: { x: number; y: number; z: number } } {
    // Apply fluid resistance (dolphin swimming physics)
    const resistance = 0.95 - (fluidDensity * 0.1);
    
    // Update velocity with acceleration and resistance
    const newVel = {
      x: (currentVel.x + acceleration.x * dt) * resistance,
      y: (currentVel.y + acceleration.y * dt) * resistance,
      z: (currentVel.z + acceleration.z * dt) * resistance
    };

    // Update position
    const newPos = {
      x: currentPos.x + newVel.x * dt,
      y: currentPos.y + newVel.y * dt,
      z: currentPos.z + newVel.z * dt
    };

    return { position: newPos, velocity: newVel };
  }

  /**
   * Calculate strike trajectory for fish-like behavior
   */
  static calculateStrikeTrajectory(
    startPos: { x: number; y: number; z: number },
    targetPos: { x: number; y: number; z: number },
    strikeVelocity: number
  ): { trajectory: Array<{ x: number; y: number; z: number; t: number }>, strikeTime: number } {
    const dx = targetPos.x - startPos.x;
    const dy = targetPos.y - startPos.y;
    const dz = targetPos.z - startPos.z;
    
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const strikeTime = distance / strikeVelocity;
    
    const trajectory: Array<{ x: number; y: number; z: number; t: number }> = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * strikeTime;
      const progress = i / steps;
      
      trajectory.push({
        x: startPos.x + dx * progress,
        y: startPos.y + dy * progress,
        z: startPos.z + dz * progress,
        t: t
      });
    }

    return { trajectory, strikeTime };
  }

  /**
   * Schooling behavior simulation (fish flocking)
   */
  static calculateSchoolingForce(
    dronePos: { x: number; y: number; z: number },
    droneVel: { x: number; y: number; z: number },
    neighbors: Array<{
      position: { x: number; y: number; z: number };
      velocity: { x: number; y: number; z: number };
    }>,
    separationRadius: number = 5,
    alignmentRadius: number = 10,
    cohesionRadius: number = 15
  ): { x: number; y: number; z: number } {
    let separation = { x: 0, y: 0, z: 0 };
    let alignment = { x: 0, y: 0, z: 0 };
    let cohesion = { x: 0, y: 0, z: 0 };
    
    let sepCount = 0, alignCount = 0, cohCount = 0;

    neighbors.forEach(neighbor => {
      const dx = neighbor.position.x - dronePos.x;
      const dy = neighbor.position.y - dronePos.y;
      const dz = neighbor.position.z - dronePos.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Separation: avoid crowding
      if (distance < separationRadius && distance > 0) {
        separation.x -= dx / distance;
        separation.y -= dy / distance;
        separation.z -= dz / distance;
        sepCount++;
      }

      // Alignment: match neighbor velocities
      if (distance < alignmentRadius) {
        alignment.x += neighbor.velocity.x;
        alignment.y += neighbor.velocity.y;
        alignment.z += neighbor.velocity.z;
        alignCount++;
      }

      // Cohesion: move toward center of neighbors
      if (distance < cohesionRadius) {
        cohesion.x += neighbor.position.x;
        cohesion.y += neighbor.position.y;
        cohesion.z += neighbor.position.z;
        cohCount++;
      }
    });

    // Normalize forces
    if (sepCount > 0) {
      separation.x /= sepCount;
      separation.y /= sepCount;
      separation.z /= sepCount;
    }

    if (alignCount > 0) {
      alignment.x = (alignment.x / alignCount) - droneVel.x;
      alignment.y = (alignment.y / alignCount) - droneVel.y;
      alignment.z = (alignment.z / alignCount) - droneVel.z;
    }

    if (cohCount > 0) {
      cohesion.x = (cohesion.x / cohCount) - dronePos.x;
      cohesion.y = (cohesion.y / cohCount) - dronePos.y;
      cohesion.z = (cohesion.z / cohCount) - dronePos.z;
    }

    // Combine forces with weights
    return {
      x: separation.x * 1.5 + alignment.x * 1.0 + cohesion.x * 1.0,
      y: separation.y * 1.5 + alignment.y * 1.0 + cohesion.y * 1.0,
      z: separation.z * 1.5 + alignment.z * 1.0 + cohesion.z * 1.0
    };
  }
}