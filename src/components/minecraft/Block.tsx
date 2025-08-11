import { useBox } from "@react-three/cannon";
import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";

interface BlockProps {
  position: [number, number, number];
  type: string;
  onInteract: (position: Vector3, isPlacing: boolean) => void;
}

const blockTextures: Record<string, string> = {
  grass: "#4CAF50",
  dirt: "#8D6E63",
  stone: "#9E9E9E",
  wood: "#795548",
  leaves: "#2E7D32",
  water: "#2196F3",
  bedrock: "#424242",
};

export function Block({ position, type, onInteract }: BlockProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const [ref] = useBox(() => ({
    position,
    type: "Static",
    args: [1, 1, 1],
  }));

  const handleClick = (event: any) => {
    event.stopPropagation();
    
    if (event.button === 0) {
      // Left click - destroy block
      onInteract(new Vector3(...position), false);
    } else if (event.button === 2) {
      // Right click - place block
      const normal = event.face.normal;
      const newPosition = new Vector3(...position).add(normal);
      onInteract(newPosition, true);
    }
  };

  const color = blockTextures[type] || "#FFFFFF";
  const opacity = type === "water" ? 0.7 : 1;

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={handleClick}
      onContextMenu={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial
        color={hovered ? "#FFEB3B" : color}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}
