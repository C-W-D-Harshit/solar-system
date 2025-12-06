import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { AsteroidBelt } from "./AsteroidBelt";
import { CameraController } from "./CameraController";
import { solarSystemData } from "../../data/solarSystem";
import { useStore } from "../../store/useStore";

export function SolarSystemScene() {
  /** Use individual selectors to prevent re-renders from unrelated state changes */
  const isPlaying = useStore((state) => state.isPlaying);
  const timeScale = useStore((state) => state.timeScale);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (isPlaying) {
      timeRef.current += delta * timeScale;
    }
  });

  return (
    <group>
      <CameraController timeRef={timeRef} />
      {solarSystemData.map((body) => {
        if (body.type === "star") return <Sun key={body.id} data={body} />;
        return <Planet key={body.id} data={body} timeRef={timeRef} />;
      })}
      <AsteroidBelt timeRef={timeRef} />
    </group>
  );
}
