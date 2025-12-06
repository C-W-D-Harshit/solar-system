import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useTexture } from "@react-three/drei";
import type { CelestialBody } from "../../types";
import { useStore } from "../../store/useStore";

interface SunProps {
  data: CelestialBody;
}

/**
 * Sun component - renders the star at the center of the solar system
 * Uses texture mapping for realistic appearance with emissive glow
 */
export function Sun({ data }: SunProps) {
  const meshRef = useRef<Mesh>(null);
  /** Select only the action function - stable reference, won't cause re-renders */
  const selectBody = useStore((state) => state.selectBody);

  /** Load the sun texture from local assets */
  const texture = useTexture(data.textureUrl ?? "/textures/sun.jpg");

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Main sun sphere with texture */}
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
        <meshBasicMaterial map={texture} />
        <pointLight intensity={300} decay={1} distance={500} color="#fff5e0" />
      </mesh>

      {/* Inner glow layer */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshBasicMaterial
          color="#ffcc00"
          transparent
          opacity={0.15}
          side={2}
        />
      </mesh>

      {/* Outer glow/corona effect */}
      <mesh scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.05}
          side={2}
        />
      </mesh>
    </group>
  );
}
