'use client';

import { motion } from 'framer-motion';

interface PlanetHeaderProps {
  name: string;
  icon: string;
  tagline: string;
  color: string;
}

export function PlanetHeader({ name, icon, tagline, color }: PlanetHeaderProps) {
  return (
    <div className="relative pt-24 pb-12 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
          className="text-8xl mb-4"
        >
          {icon}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-white mb-3"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300"
          style={{ color: color }}
        >
          {tagline}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 mx-auto h-1 w-32 rounded-full"
          style={{ backgroundColor: color, opacity: 0.6 }}
        />
      </div>
    </div>
  );
}
