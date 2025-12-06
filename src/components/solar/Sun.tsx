import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, AdditiveBlending, BackSide } from "three";
import { useTexture } from "@react-three/drei";
import type { CelestialBody } from "../../types";
import { useStore } from "../../store/useStore";

interface SunProps {
  data: CelestialBody;
}

/**
 * Sun component - renders the star at the center of the solar system
 * Uses texture mapping with layered glow effects for natural appearance
 * 
 * Performance optimizations:
 * - Reduced geometry segments (32 instead of 64)
 * - Additive blending for glow (GPU compositing)
 * - BackSide rendering for outer glow (avoids z-fighting)
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
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshBasicMaterial map={texture} />
        <pointLight intensity={300} decay={1} distance={500} color="#fff5e0" />
      </mesh>

      {/* Inner soft glow - slightly larger, very transparent */}
      <mesh scale={1.02}>
        <sphereGeometry args={[data.radius, 24, 24]} />
        <meshBasicMaterial
          color="#ffdd44"
          transparent
          opacity={0.15}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Middle glow layer */}
      <mesh scale={1.08}>
        <sphereGeometry args={[data.radius, 20, 20]} />
        <meshBasicMaterial
          color="#ffaa22"
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
          side={BackSide}
        />
      </mesh>

      {/* Outer glow/corona - rendered on backside for halo effect */}
      <mesh scale={1.2}>
        <sphereGeometry args={[data.radius, 16, 16]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.04}
          blending={AdditiveBlending}
          depthWrite={false}
          side={BackSide}
        />
      </mesh>
    </group>
  );
}
