import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  Line,
  LineLoop,
  Group,
  Vector3,
} from "three";
import { useStore } from "../../store/useStore";
import { solarSystemData } from "../../data/solarSystem";

/**
 * Number of segments for orbit circles
 * 64 provides smooth curves while being GPU-efficient
 */
const ORBIT_SEGMENTS = 64;

/** Galactic motion speed - must match SolarSystemScene.tsx */
const GALACTIC_MOTION_SPEED = 5;

/** Number of complete helix turns to show in galactic motion mode */
const HELIX_TURNS = 5;

interface OrbitLinesProps {
  /** Reference to the Sun's current world position (for galactic motion) */
  sunPositionRef: React.MutableRefObject<Vector3>;
  /** Reference to current simulation time */
  timeRef: React.MutableRefObject<number>;
}

/**
 * Generate circle points for a 2D orbit path (normal mode)
 * @param radius - The orbital radius
 * @param segments - Number of line segments
 * @returns Float32Array of vertex positions
 */
function generateCircleVertices(
  radius: number,
  segments: number
): Float32Array {
  const vertices = new Float32Array(segments * 3);
  const angleStep = (Math.PI * 2) / segments;

  for (let i = 0; i < segments; i++) {
    const angle = i * angleStep;
    vertices[i * 3] = Math.cos(angle) * radius; // x
    vertices[i * 3 + 1] = 0; // y (flat on XZ plane)
    vertices[i * 3 + 2] = Math.sin(angle) * radius; // z
  }

  return vertices;
}

/**
 * Generate helical points for a 3D orbit path (galactic motion mode)
 * Creates a helix that represents the planet's path as the Sun moves forward
 * Each planet orbits at a fixed height, creating stacked spirals
 *
 * @param radius - The orbital radius
 * @param orbitSpeed - Orbital speed (radians per time unit)
 * @param segments - Number of line segments per turn
 * @param currentTime - Current simulation time for positioning the helix
 * @param heightOffset - Fixed Y-position for this planet (creates 3D stacking)
 * @returns Float32Array of vertex positions
 */
function generateHelixVertices(
  radius: number,
  orbitSpeed: number,
  segments: number,
  currentTime: number = 0,
  heightOffset: number = 0
): Float32Array {
  /** Total segments for multiple helix turns */
  const totalSegments = segments * HELIX_TURNS;
  const vertices = new Float32Array(totalSegments * 3);

  /** Calculate forward distance per complete orbit */
  const orbitPeriod = (Math.PI * 2) / orbitSpeed;
  const forwardDistancePerOrbit = orbitPeriod * GALACTIC_MOTION_SPEED;

  /** Total backward distance to show trail */
  const totalTrailDistance = forwardDistancePerOrbit * HELIX_TURNS;

  /** Current angle of the planet in its orbit */
  const currentAngle = currentTime * orbitSpeed;

  for (let i = 0; i < totalSegments; i++) {
    /** Calculate angle going backward in time from current position */
    const angle = currentAngle - (i / totalSegments) * (Math.PI * 2 * HELIX_TURNS);

    /** Progress backward along the trail (0 = current position, 1 = furthest back) */
    const progress = i / totalSegments;

    /** Create spiral: orbit in X-Y plane, trail extends in Z */
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius + heightOffset; // Circular motion + height offset
    const z = -progress * totalTrailDistance; // Trail extending backward

    vertices[i * 3] = x;
    vertices[i * 3 + 1] = y;
    vertices[i * 3 + 2] = z;
  }

  return vertices;
}

/**
 * OrbitLines - Renders all planetary orbit paths using efficient WebGL lines
 *
 * Performance optimizations:
 * - Uses LineLoop for 2D orbits, Line for 3D helices
 * - Single shared material for all orbits
 * - Geometry is recomputed when galactic motion mode changes
 *
 * Galactic Motion:
 * - In normal mode: 2D circular orbits on XZ plane
 * - In galactic motion mode: 3D helical orbits showing the spiral path
 * - Orbit lines follow Sun's position in galactic motion mode
 */
export function OrbitLines({ sunPositionRef, timeRef }: OrbitLinesProps) {
  const showOrbits = useStore((state) => state.showOrbits);
  const galacticMotion = useStore((state) => state.galacticMotion);
  const groupRef = useRef<Group>(null);

  /** Shared material for all orbit lines - created once */
  const materialRef = useRef<LineBasicMaterial | null>(null);

  /** Store references to line objects for dynamic updates */
  const lineRefs = useRef<Map<string, Line>>(new Map());

  /** Create shared material once */
  if (!materialRef.current) {
    materialRef.current = new LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      depthWrite: false, // Prevent z-fighting
    });
  }

  /** Update material opacity when galactic motion mode changes */
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = galacticMotion ? 0.7 : 0.15;
      materialRef.current.linewidth = galacticMotion ? 2 : 1;
    }
  }, [galacticMotion]);

  /** Pre-compute orbit geometries - for normal mode only */
  const orbits = useMemo(() => {
    /** Get only planets (not the sun) */
    const planets = solarSystemData.filter((body) => body.type === "planet");

    return planets.map((planet) => {
      return {
        id: planet.id,
        distance: planet.distance,
        orbitSpeed: planet.orbitSpeed,
        inclination: planet.inclination ?? 0,
      };
    });
  }, []);

  /** Update orbit lines dynamically in galactic motion mode */
  useFrame(() => {
    if (groupRef.current) {
      if (galacticMotion) {
        /** In galactic motion mode, position the group at Sun's position */
        groupRef.current.position.copy(sunPositionRef.current);

        /** Update each helix geometry with current time */
        orbits.forEach((orbit) => {
          const line = lineRefs.current.get(orbit.id);
          if (line && line.geometry) {
            const vertices = generateHelixVertices(
              orbit.distance,
              orbit.orbitSpeed,
              ORBIT_SEGMENTS,
              timeRef.current,
              orbit.inclination
            );
            line.geometry.setAttribute(
              "position",
              new Float32BufferAttribute(vertices, 3)
            );
            line.geometry.attributes.position.needsUpdate = true;
          }
        });
      } else {
        /** In normal mode, keep lines at origin */
        groupRef.current.position.set(0, 0, 0);
      }
    }
  });

  if (!showOrbits) return null;

  return (
    <group ref={groupRef}>
      {orbits.map((orbit) => {
        /** Create geometry based on mode */
        let geometry: BufferGeometry;
        let vertices: Float32Array;

        if (galacticMotion) {
          /** Generate 3D helical path for galactic motion mode */
          vertices = generateHelixVertices(
            orbit.distance,
            orbit.orbitSpeed,
            ORBIT_SEGMENTS,
            timeRef.current,
            orbit.inclination
          );
          geometry = new BufferGeometry();
          geometry.setAttribute(
            "position",
            new Float32BufferAttribute(vertices, 3)
          );

          /** Create Line for helices and store reference */
          const line = new Line(geometry, materialRef.current ?? undefined);
          lineRefs.current.set(orbit.id, line);

          return <primitive key={orbit.id} object={line} />;
        } else {
          /** Generate 2D circular path for normal mode */
          vertices = generateCircleVertices(orbit.distance, ORBIT_SEGMENTS);
          geometry = new BufferGeometry();
          geometry.setAttribute(
            "position",
            new Float32BufferAttribute(vertices, 3)
          );

          /** Use LineLoop for closed circles */
          return (
            <primitive
              key={orbit.id}
              object={new LineLoop(geometry, materialRef.current ?? undefined)}
            />
          );
        }
      })}
    </group>
  );
}
