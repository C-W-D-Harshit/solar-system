import { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D } from "three";
import { useStore } from "../../store/useStore";

interface AsteroidBeltProps {
  timeRef: React.MutableRefObject<number>;
}

/** Number of asteroids in the belt - reduced for better performance */
const ASTEROID_COUNT = 2500;

/**
 * AsteroidBelt - Renders thousands of asteroids using GPU instancing
 * 
 * Performance optimizations:
 * - InstancedMesh for single draw call
 * - Low-poly dodecahedron geometry (detail level 0)
 * - MeshBasicMaterial instead of Standard (no lighting calculations)
 * - Frustum culling enabled by default
 * - Reduced count from 3500 to 2500
 */
export function AsteroidBelt({ timeRef }: AsteroidBeltProps) {
  /** Use selector to only subscribe to showAsteroids state */
  const showAsteroids = useStore((state) => state.showAsteroids);
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  /** Pre-compute asteroid positions and scales */
  const asteroids = useMemo(() => {
    const temp: Array<{ x: number; y: number; z: number; scale: number }> = [];
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Belt between Mars (38) and Jupiter (58) -> roughly 42-52
      const radius = 42 + Math.random() * 10;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // Slight vertical spread
      const y = (Math.random() - 0.5) * 3;
      const scale = 0.1 + Math.random() * 0.3;
      temp.push({ x, y, z, scale });
    }
    return temp;
  }, []);

  /** Initialize instance matrices once on mount */
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    asteroids.forEach((data, i) => {
      dummy.position.set(data.x, data.y, data.z);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.scale.setScalar(data.scale);
      dummy.updateMatrix();
      
      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [asteroids, dummy]);

  /** Rotate the entire belt slowly */
  useFrame(() => {
    if (!meshRef.current || !showAsteroids) return;
    const time = timeRef.current;
    meshRef.current.rotation.y = time * 0.01;
  });

  if (!showAsteroids) return null;

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, ASTEROID_COUNT]}
      frustumCulled
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color="#8b8b8b"
      />
    </instancedMesh>
  );
}
