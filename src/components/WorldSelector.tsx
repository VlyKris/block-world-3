import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Plus, World } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

interface WorldSelectorProps {
  onWorldSelect: (worldId: string) => void;
}

export function WorldSelector({ onWorldSelect }: WorldSelectorProps) {
  const worlds = useQuery(api.worlds.getUserWorlds);
  const createWorld = useMutation(api.worlds.createWorld);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorldName, setNewWorldName] = useState("");

  const handleCreateWorld = async () => {
    if (!newWorldName.trim()) {
      toast.error("Please enter a world name");
      return;
    }

    try {
      setIsCreating(true);
      const worldId = await createWorld({
        name: newWorldName.trim(),
        seed: Math.floor(Math.random() * 1000000),
        isPublic: false,
      });
      
      toast.success("World created successfully!");
      onWorldSelect(worldId);
    } catch (error) {
      toast.error("Failed to create world");
      console.error(error);
    } finally {
      setIsCreating(false);
      setNewWorldName("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-green-400 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            MineCraft Clone
          </h1>
          <p className="text-xl text-white/90">
            Build, explore, and create in your own voxel world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create new world card */}
          <Dialog>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="h-48 cursor-pointer border-2 border-dashed border-primary/50 hover:border-primary transition-colors">
                  <CardContent className="flex flex-col items-center justify-center h-full">
                    <Plus className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-lg font-semibold">Create New World</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Start a fresh adventure
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New World</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="worldName">World Name</Label>
                  <Input
                    id="worldName"
                    value={newWorldName}
                    onChange={(e) => setNewWorldName(e.target.value)}
                    placeholder="My Awesome World"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateWorld();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleCreateWorld}
                  disabled={isCreating || !newWorldName.trim()}
                  className="w-full"
                >
                  {isCreating ? "Creating..." : "Create World"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Existing worlds */}
          {worlds?.map((world) => (
            <motion.div
              key={world._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="h-48 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onWorldSelect(world._id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <World className="h-5 w-5" />
                    {world.name}
                  </CardTitle>
                  <CardDescription>
                    Seed: {world.seed}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(world._creationTime).toLocaleDateString()}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Enter World
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {worlds && worlds.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-white/80 text-lg">
              No worlds yet. Create your first world to get started!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
