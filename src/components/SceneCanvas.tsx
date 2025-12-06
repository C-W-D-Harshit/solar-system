import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, Stars } from "@react-three/drei";
import { Suspense, memo, useRef } from "react";
import { Group } from "three";

interface SceneCanvasProps {
  children: React.ReactNode;
}

/**
 * Stars background that follows the camera position
 * This creates a "skybox" effect where stars always appear infinitely far away
 */
const StarsBackground = memo(function StarsBackground() {
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();

  /** Update stars position to follow camera on every frame */
  useFrame(() => {
    if (groupRef.current) {
      // Copy camera position so stars always surround the viewer
      groupRef.current.position.copy(camera.position);
    }
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={300}
        depth={60}
        count={4000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </group>
  );
});

/**
 * Main 3D canvas wrapper for the solar system scene
 * Contains camera setup, controls, lighting, and starfield background
 * 
 * WebGL Performance Optimizations:
 * - powerPreference: "high-performance" - Forces discrete GPU on hybrid systems
 * - logarithmicDepthBuffer: true - Better precision for large scale scenes
 * - dpr capped at [1, 2] for performance scaling
 */
export function SceneCanvas({ children }: SceneCanvasProps) {
  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas
        camera={{ position: [0, 60, 120], fov: 45, near: 0.1, far: 20000 }}
        dpr={[1, 2]}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true,
          alpha: false,
        }}
      >
        <color attach="background" args={["#000005"]} />

        {/* Stars are memoized and outside Suspense to prevent re-renders */}
        <StarsBackground />

        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>

        <OrbitControls
          makeDefault
          minDistance={10}
          maxDistance={1000}
          enablePan={true}
          enableDamping={true}
          dampingFactor={0.05}
        />

        <ambientLight intensity={0.1} />
      </Canvas>
    </div>
  );
}
