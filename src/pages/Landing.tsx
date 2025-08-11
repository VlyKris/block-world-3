import { AuthButton } from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Gamepad2, Pickaxe, Users, Zap } from "lucide-react";
import { Link } from "react-router";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-green-400 to-green-600">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center p-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <Pickaxe className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white">MineCraft Clone</span>
        </div>
        <AuthButton
          trigger={<Button variant="secondary" size="lg">Play Now</Button>}
          dashboardTrigger={<Button variant="secondary" size="lg"><Link to="/dashboard">Enter Game</Link></Button>}
        />
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center py-20 px-6 max-w-6xl mx-auto"
      >
        <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
          Build Your World
        </h1>
        <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Create, explore, and survive in an infinite world of blocks. 
          Craft tools, build structures, and let your imagination run wild.
        </p>
        <AuthButton
          trigger={
            <Button size="lg" className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700">
              Start Building
            </Button>
          }
          dashboardTrigger={
            <Button size="lg" className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700">
              <Link to="/dashboard">Continue Playing</Link>
            </Button>
          }
        />
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Endless Possibilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center"
            >
              <Gamepad2 className="h-16 w-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Creative Mode</h3>
              <p className="text-white/80">
                Unlimited resources and the ability to fly. Perfect for building massive structures and letting your creativity flow.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center"
            >
              <Zap className="h-16 w-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Survival Mode</h3>
              <p className="text-white/80">
                Gather resources, craft tools, and survive the night. Experience the thrill of building from nothing.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center"
            >
              <Users className="h-16 w-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Multiplayer</h3>
              <p className="text-white/80">
                Build together with friends. Share your worlds and collaborate on epic constructions.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Screenshots/Demo */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="py-20 px-6 bg-white/5"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Experience the Adventure
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <div className="aspect-video bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <div className="text-white text-2xl font-bold">
                🎮 Game Preview Coming Soon
              </div>
            </div>
          </div>
          <p className="text-white/80 text-lg mb-8">
            Explore vast landscapes, mine deep underground, and build towering structures that reach the clouds.
          </p>
          <AuthButton
            trigger={
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-green-600">
                Join the Adventure
              </Button>
            }
            dashboardTrigger={
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-green-600">
                <Link to="/dashboard">Return to Game</Link>
              </Button>
            }
          />
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-12 px-6 text-center"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Pickaxe className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">MineCraft Clone</span>
          </div>
          <p className="text-white/60">
            Built with React, Three.js, and Convex. Open source and ready to expand.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}