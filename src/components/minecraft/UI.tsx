import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface UIProps {
  selectedBlock: string;
  onBlockSelect: (block: string) => void;
}

const blockTypes = [
  { type: "grass", name: "Grass", color: "#4CAF50" },
  { type: "dirt", name: "Dirt", color: "#8D6E63" },
  { type: "stone", name: "Stone", color: "#9E9E9E" },
  { type: "wood", name: "Wood", color: "#795548" },
  { type: "leaves", name: "Leaves", color: "#2E7D32" },
];

export function UI({ selectedBlock, onBlockSelect }: UIProps) {
  return (
    <>
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-4 h-4">
          <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Block selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      >
        <Card className="p-2 bg-black/50 border-white/20">
          <div className="flex gap-2">
            {blockTypes.map((block) => (
              <Button
                key={block.type}
                variant={selectedBlock === block.type ? "default" : "outline"}
                size="sm"
                onClick={() => onBlockSelect(block.type)}
                className="w-12 h-12 p-0"
                style={{
                  backgroundColor: selectedBlock === block.type ? block.color : "transparent",
                  borderColor: block.color,
                }}
              >
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: block.color }}
                />
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 text-white"
      >
        <Card className="p-4 bg-black/50 border-white/20">
          <div className="text-sm space-y-1">
            <div><strong>WASD</strong> - Move</div>
            <div><strong>Space</strong> - Jump</div>
            <div><strong>Shift</strong> - Run</div>
            <div><strong>Left Click</strong> - Break block</div>
            <div><strong>Right Click</strong> - Place block</div>
            <div><strong>Mouse</strong> - Look around</div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}
