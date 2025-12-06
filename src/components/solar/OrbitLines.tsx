import { useMemo, useRef } from "react";
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineLoop } from "three";
import { useStore } from "../../store/useStore";
import { solarSystemData } from "../../data/solarSystem";

/**
 * Number of segments for orbit circles
 * 64 provides smooth curves while being GPU-efficient
 */
const ORBIT_SEGMENTS = 64;

/**
 * Generate circle points for an orbit path
 * @param radius - The orbital radius
 * @param segments - Number of line segments
 * @returns Float32Array of vertex positions
 */
function generateOrbitVertices(radius: number, segments: number): Float32Array {
  const vertices = new Float32Array(segments * 3);
  const angleStep = (Math.PI * 2) / segments;

  for (let i = 0; i < segments; i++) {
    const angle = i * angleStep;
    vertices[i * 3] = Math.cos(angle) * radius;     // x
    vertices[i * 3 + 1] = 0;                         // y (flat on XZ plane)
    vertices[i * 3 + 2] = Math.sin(angle) * radius; // z
  }

  return vertices;
}

/**
 * OrbitLines - Renders all planetary orbit paths using efficient WebGL lines
 * 
 * Performance optimizations:
 * - Uses LineLoop instead of ringGeometry (much fewer triangles)
 * - Single shared material for all orbits
 * - Geometry is pre-computed and memoized
 * - Static - no per-frame updates needed
 */
export function OrbitLines() {
  const showOrbits = useStore((state) => state.showOrbits);
  
  /** Shared material for all orbit lines - created once */
  const materialRef = useRef<LineBasicMaterial | null>(null);
  
  /** Pre-compute all orbit geometries */
  const orbits = useMemo(() => {
    // Get only planets (not the sun)
    const planets = solarSystemData.filter((body) => body.type === "planet");
    
    // Create shared material if not exists
    if (!materialRef.current) {
      materialRef.current = new LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        depthWrite: false, // Prevent z-fighting
      });
    }
    
    return planets.map((planet) => {
      const geometry = new BufferGeometry();
      const vertices = generateOrbitVertices(planet.distance, ORBIT_SEGMENTS);
      geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
      
      return {
        id: planet.id,
        geometry,
        distance: planet.distance,
      };
    });
  }, []);

  if (!showOrbits) return null;

  return (
    <group>
      {orbits.map((orbit) => (
        <primitive
          key={orbit.id}
          object={new LineLoop(orbit.geometry, materialRef.current ?? undefined)}
        />
      ))}
    </group>
  );
}

