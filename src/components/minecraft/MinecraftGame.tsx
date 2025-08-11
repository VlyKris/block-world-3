import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { Suspense, useState } from "react";
import { World } from "./World";
import { Player } from "./Player";
import { UI } from "./UI";
import { Loader2 } from "lucide-react";

interface MinecraftGameProps {
  worldId: string;
}

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

export function MinecraftGame({ worldId }: MinecraftGameProps) {
  const [selectedBlock, setSelectedBlock] = useState("grass");

  return (
    <div className="w-full h-screen relative">
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{ fov: 75, near: 0.1, far: 1000 }}
          style={{ background: "linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[50, 50, 25]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
            />
            
            <Physics gravity={[0, -30, 0]}>
              <World worldId={worldId} selectedBlock={selectedBlock} />
              <Player worldId={worldId} />
            </Physics>
            
            <PointerLockControls />
          </Suspense>
        </Canvas>
      </KeyboardControls>
      
      <UI 
        selectedBlock={selectedBlock} 
        onBlockSelect={setSelectedBlock}
      />
      
      {/* Loading overlay */}
      <div className="absolute top-4 left-4 text-white">
        <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading world...</span>
        </div>
      </div>
    </div>
  );
}
