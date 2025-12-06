export interface CelestialBody {
  id: string;
  name: string;
  type: "star" | "planet" | "moon" | "dwarf-planet";
  radius: number; // Relative size (e.g., Earth = 1)
  distance: number; // Distance from parent (Sun for planets)
  orbitSpeed: number; // Radians per frame or relative factor
  rotationSpeed: number; // Radians per frame
  color: string;
  textureUrl?: string; // URL to the texture image
  ringColor?: string; // For Saturn/Uranus
  description: string;

  // Display data
  details: {
    diameter: string;
    distanceFromSun: string;
    orbitalPeriod: string;
    dayLength: string;
    temp: string;
  };
}

export interface AsteroidConfig {
  count: number;
  minRadius: number;
  maxRadius: number;
  minSize: number;
  maxSize: number;
}
