import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { AsteroidBelt } from "./AsteroidBelt";
import { CameraController } from "./CameraController";
import { OrbitLines } from "./OrbitLines";
import { solarSystemData } from "../../data/solarSystem";
import { useStore } from "../../store/useStore";

/**
 * SolarSystemScene - Main scene containing all celestial bodies
 * 
 * Performance optimizations:
 * - OrbitLines: Centralized orbit rendering with GPU-efficient LineLoop
 * - Memoized planet data iteration
 */
export function SolarSystemScene() {
  /** Use individual selectors to prevent re-renders from unrelated state changes */
  const isPlaying = useStore((state) => state.isPlaying);
  const timeScale = useStore((state) => state.timeScale);
  const timeRef = useRef(0);

  /** Update simulation time */
  useFrame((_, delta) => {
    if (isPlaying) {
      timeRef.current += delta * timeScale;
    }
  });

  return (
    <group>
      {/* Camera controller */}
      <CameraController timeRef={timeRef} />
      
      {/* Centralized orbit lines - single batch render */}
      <OrbitLines />
      
      {/* Celestial bodies */}
      {solarSystemData.map((body) => {
        if (body.type === "star") return <Sun key={body.id} data={body} />;
        return <Planet key={body.id} data={body} timeRef={timeRef} />;
      })}
      
      {/* Asteroid belt with instanced rendering */}
      <AsteroidBelt timeRef={timeRef} />
    </group>
  );
}
