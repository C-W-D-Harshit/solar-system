import { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D } from "three";
import { useStore } from "../../store/useStore";

interface AsteroidBeltProps {
  timeRef: React.MutableRefObject<number>;
}

export function AsteroidBelt({ timeRef }: AsteroidBeltProps) {
  /** Use selector to only subscribe to showAsteroids state */
  const showAsteroids = useStore((state) => state.showAsteroids);
  const meshRef = useRef<InstancedMesh>(null);
  const count = 3500;
  const dummy = useMemo(() => new Object3D(), []);

  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
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
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [asteroids, dummy]);

  useFrame(() => {
    if (!meshRef.current || !showAsteroids) return;
    // Rotate the entire belt slowly
    const time = timeRef.current;
    meshRef.current.rotation.y = time * 0.01;
  });

  if (!showAsteroids) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#8b8b8b"
        roughness={0.9}
        metalness={0.1}
        flatShading
      />
    </instancedMesh>
  );
}
