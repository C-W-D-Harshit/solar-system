import { SceneCanvas } from "./components/SceneCanvas";
import { SolarSystemScene } from "./components/solar/SolarSystemScene";
import { Overlay } from "./components/ui/Overlay";

function App() {
  return (
    <>
      <SceneCanvas>
        <SolarSystemScene />
      </SceneCanvas>
      <Overlay />
    </>
  );
}

export default App;
