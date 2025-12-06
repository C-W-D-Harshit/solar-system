import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group, DoubleSide, RepeatWrapping, Vector3 } from "three";
import { Html, useTexture } from "@react-three/drei";
import type { CelestialBody } from "../../types";
import { useStore } from "../../store/useStore";

interface PlanetProps {
  /** Celestial body data for the planet */
  data: CelestialBody;
  /** Reference to current simulation time */
  timeRef: React.MutableRefObject<number>;
  /** Reference to the Sun's current world position (for galactic motion) */
  sunPositionRef: React.MutableRefObject<Vector3>;
}

/**
 * Calculate geometry segments based on planet size
 * Larger planets get more segments, smaller planets need fewer
 * This provides LOD-like optimization without runtime switching
 * 
 * @param radius - Planet radius
 * @returns Number of segments for width and height
 */
function getGeometrySegments(radius: number): number {
  if (radius >= 3) return 48;      // Large planets (Jupiter, Saturn)
  if (radius >= 1.5) return 32;    // Medium planets (Uranus, Neptune)
  return 24;                        // Small planets (Mercury, Venus, Earth, Mars)
}

/**
 * PlanetRing - Renders a textured ring for planets like Saturn
 * Separated to properly handle conditional texture loading
 */
interface PlanetRingProps {
  radius: number;
  ringTextureUrl?: string;
}

function PlanetRing({ radius, ringTextureUrl }: PlanetRingProps) {
  /** Load ring texture if available */
  const ringTexture = useTexture(ringTextureUrl ?? "/textures/saturn_ring.png");

  /** Configure texture for radial ring mapping */
  useMemo(() => {
    if (ringTexture) {
      ringTexture.wrapS = RepeatWrapping;
      ringTexture.wrapT = RepeatWrapping;
    }
  }, [ringTexture]);

  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.4, 64]} />
      <meshBasicMaterial
        map={ringTexture}
        color="#ffffff"
        opacity={0.9}
        transparent
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Simple colored ring fallback when no texture is available
 */
interface SimpleRingProps {
  radius: number;
  ringColor: string;
}

function SimpleRing({ radius, ringColor }: SimpleRingProps) {
  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.2, 32]} />
      <meshBasicMaterial
        color={ringColor}
        opacity={0.7}
        transparent
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Planet component - renders a planet with realistic texture and orbital motion
 * Supports rings (Saturn/Uranus) and labels
 * 
 * Performance optimizations:
 * - Dynamic geometry segments based on planet size (LOD-like)
 * - Orbit lines moved to centralized OrbitLines component
 * - Reduced ring segments (32 instead of 64)
 * - MeshBasicMaterial for rings (no lighting calculations)
 * - useFrame priority for consistent update order
 * 
 * Galactic Motion:
 * - Planet follows Sun's position while maintaining orbit
 * - Creates helical path as Sun moves forward
 */
export function Planet({ data, timeRef, sunPositionRef }: PlanetProps) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  
  /** Use individual selectors to prevent unnecessary re-renders */
  const selectBody = useStore((state) => state.selectBody);
  const showLabels = useStore((state) => state.showLabels);

  /** Load planet texture - uses the planet's configured texture path */
  const texture = useTexture(data.textureUrl ?? `/textures/${data.id}.jpg`);

  /** Calculate geometry segments once based on planet size */
  const segments = useMemo(() => getGeometrySegments(data.radius), [data.radius]);

  useFrame((_state, delta) => {
    const time = timeRef.current;
    const angle = time * data.orbitSpeed;
    
    /** Calculate orbital position relative to Sun */
    const orbitalX = Math.cos(angle) * data.distance;
    const orbitalZ = Math.sin(angle) * data.distance;
    
    /** Add Sun's position for galactic motion (creates helical path) */
    const worldX = orbitalX + sunPositionRef.current.x;
    const worldY = sunPositionRef.current.y;
    const worldZ = orbitalZ + sunPositionRef.current.z;

    if (groupRef.current) {
      groupRef.current.position.set(worldX, worldY, worldZ);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * data.rotationSpeed * 20;
    }
  });

  return (
    <group ref={groupRef} position={[data.distance, 0, 0]}>
      {/* Planet sphere with optimized geometry */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          selectBody(data);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <sphereGeometry args={[data.radius, segments, segments]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={0.8} 
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Rings for Saturn/Uranus - textured when available */}
      {data.ringColor && data.ringTextureUrl && (
        <PlanetRing
          radius={data.radius}
          ringTextureUrl={data.ringTextureUrl}
        />
      )}
      {data.ringColor && !data.ringTextureUrl && (
        <SimpleRing
          radius={data.radius}
          ringColor={data.ringColor}
        />
      )}

      {/* Labels rendered via HTML overlay */}
      {showLabels && (
        <Html
          position={[0, data.radius + 1, 0]}
          center
          distanceFactor={40}
          occlude
          sprite
        >
          <div className="bg-black/60 text-white px-2 py-0.5 rounded text-xs whitespace-nowrap border border-white/20 pointer-events-none select-none backdrop-blur-sm">
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
}
