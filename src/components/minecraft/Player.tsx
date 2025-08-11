import { useBox } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Vector3 } from "three";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface PlayerProps {
  worldId: string;
}

export function Player({ worldId }: PlayerProps) {
  const { camera } = useThree();
  const playerData = useQuery(api.players.getPlayer, { 
    worldId: worldId as Id<"worlds"> 
  });
  const updatePosition = useMutation(api.players.updatePlayerPosition);
  
  const [, get] = useKeyboardControls();
  const velocity = useRef([0, 0, 0]);
  const isOnGround = useRef(false);
  
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 70, 0],
    args: [0.6, 1.8, 0.6],
    material: {
      friction: 0.1,
    },
  }));

  // Update camera position to follow player
  useFrame(() => {
    if (ref.current) {
      const position = ref.current.position;
      camera.position.copy(position);
      camera.position.y += 0.8; // Eye level
      
      // Handle movement
      const { forward, backward, left, right, jump, run } = get();
      
      const direction = new Vector3();
      const frontVector = new Vector3(0, 0, Number(backward) - Number(forward));
      const sideVector = new Vector3(Number(left) - Number(right), 0, 0);
      
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(run ? 8 : 4)
        .applyEuler(camera.rotation);
      
      velocity.current[0] = direction.x;
      velocity.current[2] = direction.z;
      
      // Jumping
      if (jump && isOnGround.current) {
        velocity.current[1] = 10;
        isOnGround.current = false;
      }
      
      api.velocity.set(...velocity.current);
      
      // Update position in database occasionally
      if (Math.random() < 0.01) { // 1% chance per frame
        updatePosition({
          worldId: worldId as Id<"worlds">,
          position: {
            x: position.x,
            y: position.y,
            z: position.z,
          },
          rotation: {
            x: camera.rotation.x,
            y: camera.rotation.y,
          },
        });
      }
    }
  });

  // Handle ground detection
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      velocity.current = v;
      isOnGround.current = Math.abs(v[1]) < 0.1;
    });
    
    return unsubscribe;
  }, [api]);

  // Set initial position from database
  useEffect(() => {
    if (playerData && ref.current) {
      api.position.set(
        playerData.position.x,
        playerData.position.y,
        playerData.position.z
      );
    }
  }, [playerData, api]);

  return <mesh ref={ref} visible={false} />;
}
