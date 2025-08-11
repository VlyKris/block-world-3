// TODO: THIS IS THE DEFAULT DASHBOARD PAGE THAT THE USER WILL SEE AFTER AUTHENTICATION. ADD MAIN FUNCTIONALITY HERE.
// This is the entry point for users who have just signed in

import { Protected } from "@/lib/protected-page";
import { WorldSelector } from "@/components/WorldSelector";
import { MinecraftGame } from "@/components/minecraft/MinecraftGame";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);

  const handleBackToWorlds = () => {
    setSelectedWorldId(null);
  };

  return (
    <Protected>
      {selectedWorldId ? (
        <div className="relative w-full h-screen">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 left-4 z-50"
          >
            <Button
              onClick={handleBackToWorlds}
              variant="outline"
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Worlds
            </Button>
          </motion.div>
          <MinecraftGame worldId={selectedWorldId} />
        </div>
      ) : (
        <WorldSelector onWorldSelect={setSelectedWorldId} />
      )}
    </Protected>
  );
}