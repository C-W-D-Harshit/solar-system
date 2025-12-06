import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import { Html, useTexture } from "@react-three/drei";
import type { CelestialBody } from "../../types";
import { useStore } from "../../store/useStore";

interface PlanetProps {
  data: CelestialBody;
  timeRef: React.MutableRefObject<number>;
}

/**
 * Planet component - renders a planet with realistic texture and orbital motion
 * Supports rings (Saturn/Uranus) and labels
 */
export function Planet({ data, timeRef }: PlanetProps) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  /** Use individual selectors to prevent unnecessary re-renders */
  const selectBody = useStore((state) => state.selectBody);
  const showLabels = useStore((state) => state.showLabels);
  const showOrbits = useStore((state) => state.showOrbits);

  /** Load planet texture - uses the planet's configured texture path */
  const texture = useTexture(data.textureUrl ?? `/textures/${data.id}.jpg`);

  useFrame((_state, delta) => {
    const time = timeRef.current;
    const angle = time * data.orbitSpeed;
    const x = Math.cos(angle) * data.distance;
    const z = Math.sin(angle) * data.distance;

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * data.rotationSpeed * 20; // Speed up rotation for visual effect
    }
  });

  return (
    <group>
      {/* Orbit path - Static relative to parent (Sun) */}
      {showOrbits && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[data.distance - 0.1, data.distance + 0.1, 128]}
          />
          <meshBasicMaterial
            color="#ffffff"
            opacity={0.15}
            transparent
            side={2}
          />
        </mesh>
      )}

      {/* The Planet Group moves */}
      <group ref={groupRef} position={[data.distance, 0, 0]}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            selectBody(data);
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <sphereGeometry args={[data.radius, 64, 64]} />
          <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Rings for Saturn/Uranus */}
        {data.ringColor && (
          <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[data.radius * 1.4, data.radius * 2.2, 64]} />
            <meshStandardMaterial
              color={data.ringColor}
              opacity={0.7}
              transparent
              side={2}
            />
          </mesh>
        )}

        {showLabels && (
          <Html
            position={[0, data.radius + 1, 0]}
            center
            distanceFactor={40}
            occlude
          >
            <div className="bg-black/60 text-white px-2 py-0.5 rounded text-xs whitespace-nowrap border border-white/20 pointer-events-none select-none backdrop-blur-sm">
              {data.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
