import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { AsteroidBelt } from "./AsteroidBelt";
import { CameraController } from "./CameraController";
import { OrbitLines } from "./OrbitLines";
import { solarSystemData } from "../../data/solarSystem";
import { useStore } from "../../store/useStore";
import {
  GALACTIC_MOTION_SPEED,
  INITIAL_ORBIT_ADVANCE,
  GALACTIC_SPEED_MULTIPLIER,
} from "../../constants/galacticMotion";

/** Fixed direction vector for galactic motion (normalized) */
const GALACTIC_DIRECTION = new Vector3(0, 0, 1).normalize();

/**
 * SolarSystemScene - Main scene containing all celestial bodies
 *
 * Performance optimizations:
 * - OrbitLines: Centralized orbit rendering with GPU-efficient LineLoop
 * - Memoized planet data iteration
 *
 * Galactic Motion Mode:
 * - Sun moves forward along a fixed vector
 * - All planets follow Sun's position while continuing to orbit
 * - Creates smooth helical paths for planets
 */
export function SolarSystemScene() {
  /** Use individual selectors to prevent re-renders from unrelated state changes */
  const isPlaying = useStore((state) => state.isPlaying);
  const timeScale = useStore((state) => state.timeScale);
  const galacticMotion = useStore((state) => state.galacticMotion);
  const timeRef = useRef(0);

  /** Sun's current position - shared across all child components */
  const sunPositionRef = useRef(new Vector3(0, 0, 0));

  /** Handle galactic motion mode changes */
  useEffect(() => {
    if (galacticMotion) {
      /** When entering galactic mode, advance time by initial orbits */
      /** This creates visible spiral trails from the start */
      timeRef.current += Math.PI * 2 * INITIAL_ORBIT_ADVANCE;
    } else {
      /** Reset Sun position when exiting galactic motion mode */
      sunPositionRef.current.set(0, 0, 0);
    }
  }, [galacticMotion]);

  /** Reusable scratch vector to avoid allocations in hot path */
  const scratchVector = useRef(new Vector3());

  /** Update simulation time and Sun position */
  useFrame((_, delta) => {
    if (isPlaying) {
      /** In galactic mode, apply speed multiplier for better visual effect */
      const effectiveTimeScale = galacticMotion
        ? timeScale * GALACTIC_SPEED_MULTIPLIER
        : timeScale;
      timeRef.current += delta * effectiveTimeScale;

      /** Update Sun's position when galactic motion is enabled */
      if (galacticMotion) {
        scratchVector.current
          .copy(GALACTIC_DIRECTION)
          .multiplyScalar(delta * effectiveTimeScale * GALACTIC_MOTION_SPEED);
        sunPositionRef.current.add(scratchVector.current);
      }
    }
  });

  return (
    <group>
      {/* Camera controller */}
      <CameraController timeRef={timeRef} sunPositionRef={sunPositionRef} />

      {/* Centralized orbit lines - single batch render */}
      <OrbitLines sunPositionRef={sunPositionRef} timeRef={timeRef} />

      {/* Celestial bodies */}
      {solarSystemData.map((body) => {
        if (body.type === "star") {
          return (
            <Sun key={body.id} data={body} sunPositionRef={sunPositionRef} />
          );
        }
        return (
          <Planet
            key={body.id}
            data={body}
            timeRef={timeRef}
            sunPositionRef={sunPositionRef}
          />
        );
      })}

      {/* Asteroid belt with instanced rendering */}
      <AsteroidBelt timeRef={timeRef} sunPositionRef={sunPositionRef} />
    </group>
  );
}
