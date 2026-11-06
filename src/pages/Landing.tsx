import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Crown, Users, BookOpen } from 'lucide-react';

const modes = [
  {
    title: 'Local Play',
    description: 'Play against a friend on the same device',
    icon: Users,
    path: '/play/local',
    available: true,
  },
  {
    title: 'Chess Rules',
    description: 'Learn how each piece moves, special rules, and basic strategy',
    icon: BookOpen,
    path: '/rules',
    available: true,
  },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, hsl(43 72% 55%), transparent 70%)' }} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-12 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="w-10 h-10 text-primary" />
          <h1 className="font-display text-5xl md:text-6xl font-bold gold-text">
            Royal Chess
          </h1>
        </div>
        <p className="font-body text-xl text-muted-foreground max-w-md mx-auto">
          A beautiful 3D chessboard for two players on the same device.
        </p>
      </motion.div>

      {/* Mode cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full relative z-10"
      >
        {modes.map((mode) => (
          <button
            key={mode.title}
            onClick={() => mode.available && navigate(mode.path)}
            disabled={!mode.available}
            className="glass-panel p-6 text-left transition-all duration-300 hover:gold-glow hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center gap-3 mb-3">
              <mode.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <h2 className="font-display text-lg text-foreground">{mode.title}</h2>
            </div>
            <p className="font-body text-sm text-muted-foreground">{mode.description}</p>
            {!mode.available && (
              <span className="inline-block mt-2 text-[10px] font-display text-primary/60 uppercase tracking-widest">Coming Soon</span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-xs text-muted-foreground font-display tracking-widest uppercase relative z-10"
      >
        Crafted with precision & elegance
      </motion.p>
    </div>
  );
};

export default Landing;
