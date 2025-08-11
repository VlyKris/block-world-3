import { useFrame } from "@react-three/fiber";
import { useMutation, useQuery } from "convex/react";
import { useRef, useState, useCallback } from "react";
import { Vector3 } from "three";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Block } from "./Block";
import { TerrainGenerator } from "../../utils/terrainGenerator";

interface WorldProps {
  worldId: string;
  selectedBlock: string;
}

const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 4;

export function World({ worldId, selectedBlock }: WorldProps) {
  const [chunks, setChunks] = useState<Map<string, any>>(new Map());
  const [playerPosition, setPlayerPosition] = useState(new Vector3(0, 70, 0));
  const updateBlock = useMutation(api.chunks.updateBlock);
  const terrainGenerator = useRef(new TerrainGenerator(12345));

  // Generate chunk key
  const getChunkKey = (chunkX: number, chunkZ: number) => `${chunkX},${chunkZ}`;

  // Generate terrain for a chunk
  const generateChunk = useCallback((chunkX: number, chunkZ: number) => {
    const blocks: any[] = [];
    
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const worldX = chunkX * CHUNK_SIZE + x;
        const worldZ = chunkZ * CHUNK_SIZE + z;
        
        const height = terrainGenerator.current.getHeight(worldX, worldZ);
        
        // Generate blocks from bedrock to surface
        for (let y = 0; y <= height; y++) {
          let blockType = "stone";
          
          if (y === 0) blockType = "bedrock";
          else if (y === height && height > 62) blockType = "grass";
          else if (y > height - 3 && height > 62) blockType = "dirt";
          else if (y <= 62) blockType = "water";
          
          blocks.push({
            x: worldX,
            y,
            z: worldZ,
            type: blockType,
          });
        }
        
        // Add trees occasionally
        if (height > 62 && Math.random() < 0.02) {
          const treeHeight = 4 + Math.floor(Math.random() * 3);
          
          // Tree trunk
          for (let y = height + 1; y <= height + treeHeight; y++) {
            blocks.push({
              x: worldX,
              y,
              z: worldZ,
              type: "wood",
            });
          }
          
          // Tree leaves
          for (let dx = -2; dx <= 2; dx++) {
            for (let dz = -2; dz <= 2; dz++) {
              for (let dy = 0; dy <= 2; dy++) {
                if (Math.abs(dx) + Math.abs(dz) + Math.abs(dy) <= 3) {
                  blocks.push({
                    x: worldX + dx,
                    y: height + treeHeight + dy,
                    z: worldZ + dz,
                    type: "leaves",
                  });
                }
              }
            }
          }
        }
      }
    }
    
    return blocks;
  }, []);

  // Load chunks around player
  useFrame(() => {
    const currentChunkX = Math.floor(playerPosition.x / CHUNK_SIZE);
    const currentChunkZ = Math.floor(playerPosition.z / CHUNK_SIZE);
    
    const newChunks = new Map(chunks);
    
    // Load chunks in render distance
    for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
      for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
        const chunkX = currentChunkX + dx;
        const chunkZ = currentChunkZ + dz;
        const key = getChunkKey(chunkX, chunkZ);
        
        if (!newChunks.has(key)) {
          const blocks = generateChunk(chunkX, chunkZ);
          newChunks.set(key, { chunkX, chunkZ, blocks });
        }
      }
    }
    
    // Unload distant chunks
    for (const [key, chunk] of newChunks) {
      const distance = Math.max(
        Math.abs(chunk.chunkX - currentChunkX),
        Math.abs(chunk.chunkZ - currentChunkZ)
      );
      
      if (distance > RENDER_DISTANCE + 1) {
        newChunks.delete(key);
      }
    }
    
    if (newChunks.size !== chunks.size) {
      setChunks(newChunks);
    }
  });

  // Handle block placement/destruction
  const handleBlockInteraction = useCallback(async (position: Vector3, isPlacing: boolean) => {
    if (isPlacing) {
      await updateBlock({
        worldId: worldId as Id<"worlds">,
        x: Math.floor(position.x),
        y: Math.floor(position.y),
        z: Math.floor(position.z),
        blockType: selectedBlock,
      });
    } else {
      await updateBlock({
        worldId: worldId as Id<"worlds">,
        x: Math.floor(position.x),
        y: Math.floor(position.y),
        z: Math.floor(position.z),
      });
    }
    
    // Update local chunk data
    const chunkX = Math.floor(position.x / CHUNK_SIZE);
    const chunkZ = Math.floor(position.z / CHUNK_SIZE);
    const key = getChunkKey(chunkX, chunkZ);
    
    const chunk = chunks.get(key);
    if (chunk) {
      const newBlocks = chunk.blocks.filter((block: any) =>
        !(block.x === Math.floor(position.x) && 
          block.y === Math.floor(position.y) && 
          block.z === Math.floor(position.z))
      );
      
      if (isPlacing) {
        newBlocks.push({
          x: Math.floor(position.x),
          y: Math.floor(position.y),
          z: Math.floor(position.z),
          type: selectedBlock,
        });
      }
      
      const newChunks = new Map(chunks);
      newChunks.set(key, { ...chunk, blocks: newBlocks });
      setChunks(newChunks);
    }
  }, [chunks, selectedBlock, updateBlock, worldId]);

  // Render all blocks from loaded chunks
  const renderBlocks = () => {
    const blocks: JSX.Element[] = [];
    
    for (const chunk of chunks.values()) {
      for (const block of chunk.blocks) {
        blocks.push(
          <Block
            key={`${block.x}-${block.y}-${block.z}`}
            position={[block.x, block.y, block.z]}
            type={block.type}
            onInteract={handleBlockInteraction}
          />
        );
      }
    }
    
    return blocks;
  };

  return (
    <group>
      {renderBlocks()}
    </group>
  );
}
