import { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { 
  InstancedMesh, 
  Object3D, 
  CanvasTexture, 
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
  Group
} from "three";
import { useStore } from "../../store/useStore";

interface AsteroidBeltProps {
  /** Reference to current simulation time */
  timeRef: React.MutableRefObject<number>;
  /** Reference to the Sun's current world position (for galactic motion) */
  sunPositionRef: React.MutableRefObject<Vector3>;
}

/** Number of asteroids in the belt - reduced for better performance */
const ASTEROID_COUNT = 2500;

/**
 * Creates a procedural rocky asteroid texture using Canvas2D
 * Generates a grayscale rocky surface with noise and crater-like features
 * 
 * @param size - Texture size in pixels (power of 2 recommended)
 * @returns CanvasTexture ready for use in Three.js materials
 */
function createAsteroidTexture(size: number = 128): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get 2D context for asteroid texture");
  }

  /** Base rocky gray color */
  ctx.fillStyle = "#6b6b6b";
  ctx.fillRect(0, 0, size, size);

  /** Add noise and rocky details */
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    /** Random noise for rocky surface variation */
    const noise = Math.random() * 60 - 30;
    
    /** Occasional darker spots for craters/shadows */
    const craterChance = Math.random();
    const craterDarkness = craterChance > 0.95 ? -40 : craterChance > 0.85 ? -20 : 0;
    
    /** Occasional lighter spots for highlights */
    const highlightChance = Math.random();
    const highlight = highlightChance > 0.92 ? 30 : 0;

    const adjustment = noise + craterDarkness + highlight;

    data[i] = Math.max(0, Math.min(255, data[i] + adjustment));         // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjustment)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjustment)); // B
  }

  ctx.putImageData(imageData, 0, 0);

  /** Create Three.js texture from canvas */
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;

  return texture;
}

/**
 * AsteroidBelt - Renders thousands of asteroids using GPU instancing
 * 
 * Performance optimizations:
 * - InstancedMesh for single draw call
 * - Low-poly dodecahedron geometry (detail level 0)
 * - Procedural texture generated once and shared
 * - Frustum culling enabled by default
 * - Reduced count from 3500 to 2500
 * 
 * Galactic Motion:
 * - Asteroid belt follows Sun's position
 * - Belt remains centered on Sun as it moves
 */
export function AsteroidBelt({ timeRef, sunPositionRef }: AsteroidBeltProps) {
  /** Use selector to only subscribe to showAsteroids state */
  const showAsteroids = useStore((state) => state.showAsteroids);
  const meshRef = useRef<InstancedMesh>(null);
  const groupRef = useRef<Group>(null);
  const dummy = useMemo(() => new Object3D(), []);

  /** Create procedural asteroid texture once */
  const asteroidTexture = useMemo(() => createAsteroidTexture(128), []);

  /** Pre-compute asteroid positions and non-uniform scales for irregular shapes */
  const asteroids = useMemo(() => {
    const temp: Array<{ 
      x: number; 
      y: number; 
      z: number; 
      scaleX: number;
      scaleY: number;
      scaleZ: number;
    }> = [];
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Belt between Mars (38) and Jupiter (58) -> roughly 42-52
      const radius = 42 + Math.random() * 10;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // Increased vertical spread for more 3D appearance
      const y = (Math.random() - 0.5) * 6;
      
      /** Non-uniform scaling creates irregular rocky shapes */
      const baseScale = 0.1 + Math.random() * 0.25;
      const scaleX = baseScale * (0.5 + Math.random() * 1.2);
      const scaleY = baseScale * (0.4 + Math.random() * 0.8);
      const scaleZ = baseScale * (0.5 + Math.random() * 1.2);
      
      temp.push({ x, y, z, scaleX, scaleY, scaleZ });
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
      /** Apply non-uniform scale for irregular rocky shapes */
      dummy.scale.set(data.scaleX, data.scaleY, data.scaleZ);
      dummy.updateMatrix();
      
      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [asteroids, dummy]);

  /** Rotate the entire belt slowly and follow Sun's position */
  useFrame(() => {
    const galacticMotion = useStore.getState().galacticMotion;

    /** Update group position to follow Sun */
    if (groupRef.current) {
      groupRef.current.position.copy(sunPositionRef.current);

      /** In galactic mode, rotate belt 90° to align with X-Y orbital plane */
      if (galacticMotion) {
        groupRef.current.rotation.x = Math.PI / 2;
      } else {
        groupRef.current.rotation.x = 0;
      }
    }

    if (!meshRef.current || !showAsteroids) return;
    const time = timeRef.current;

    /** Rotate around appropriate axis based on mode */
    if (galacticMotion) {
      meshRef.current.rotation.y = 0; // Reset Y rotation
      meshRef.current.rotation.z = time * 0.01; // Rotate in X-Y plane
    } else {
      meshRef.current.rotation.z = 0; // Reset Z rotation
      meshRef.current.rotation.y = time * 0.01; // Rotate in X-Z plane
    }
  });

  if (!showAsteroids) return null;

  return (
    <group ref={groupRef}>
      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, ASTEROID_COUNT]}
        frustumCulled
      >
        {/* Low-poly icosahedron (detail 0) for angular rocky appearance */}
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          map={asteroidTexture}
          color="#9a9a9a"
          roughness={0.95}
          metalness={0.05}
          flatShading
        />
      </instancedMesh>
    </group>
  );
}
