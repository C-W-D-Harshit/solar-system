import { SceneCanvas } from "./components/SceneCanvas";
import { SolarSystemScene } from "./components/solar/SolarSystemScene";
import { Overlay } from "./components/ui/Overlay";
import { BackgroundMusic } from "./components/BackgroundMusic";

function App() {
  return (
    <>
      <SceneCanvas>
        <SolarSystemScene />
      </SceneCanvas>
      <Overlay />
      <BackgroundMusic />
    </>
  );
}

export default App;
