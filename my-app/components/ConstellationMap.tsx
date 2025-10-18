'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Planet, PlanetProps } from './Planet';
import { X } from 'lucide-react';
import userData from '@/data/user-data.json';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
}

export function ConstellationMap() {
  const [stars, setStars] = useState<Star[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showTutorial, setShowTutorial] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate stars on mount
  useEffect(() => {
    const generateStars = (width: number, height: number): Star[] => {
      return Array.from({ length: 150 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleDelay: Math.random() * 3,
      }));
    };

    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setDimensions({ width, height });
        setStars(generateStars(width, height));
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('xplanet-tutorial-seen');
    if (hasSeenTutorial) {
      setShowTutorial(false);
    }

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('xplanet-tutorial-seen', 'true');
  };

  // Calculate planet positions based on viewport (triangle formation)
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const radius = Math.min(dimensions.width, dimensions.height) * 0.25;

  // Map user scores to planet sizes (higher score = larger planet)
  const budgetSize = 40 + (userData.budgetScore / 100) * 20; // 40-60px
  const creditSize = 40 + (userData.creditScore / 850) * 20; // Credit scores max at 850
  const goalsSize = 40 + (userData.goalsProgress / 100) * 20;

  const planets: PlanetProps[] = [
    {
      id: 'budget',
      name: 'Budget Galaxy',
      position: { x: centerX - radius * 1.2, y: centerY + radius * 0.6 },
      size: budgetSize,
      color: '#ffd700', // meteor-gold
      glow: userData.budgetScore > 60,
      score: userData.budgetScore,
      delay: 0.2,
    },
    {
      id: 'credit',
      name: 'Credit Nebula',
      position: { x: centerX + radius * 1.2, y: centerY + radius * 0.6 },
      size: creditSize,
      color: '#6a4c93', // nebula-purple
      glow: userData.creditScore > 650,
      score: userData.creditScore,
      delay: 0.4,
    },
    {
      id: 'goals',
      name: 'Goals Constellation',
      position: { x: centerX, y: centerY - radius * 0.8 },
      size: goalsSize,
      color: '#1dd3b0', // planet-teal
      glow: userData.goalsProgress > 30,
      score: userData.goalsProgress,
      delay: 0.6,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden"
    >
      {/* SVG Canvas */}
      <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0">
        {/* Star field */}
        {stars.map((star, i) => (
          <motion.circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="white"
            initial={{ opacity: star.opacity }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: star.twinkleDelay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Connecting lines between planets */}
        <g opacity={0.3}>
          {/* Budget to Credit */}
          <motion.line
            x1={planets[0].position.x}
            y1={planets[0].position.y}
            x2={planets[1].position.x}
            y2={planets[1].position.y}
            stroke="#00d9ff"
            strokeWidth={2}
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
          {/* Credit to Goals */}
          <motion.line
            x1={planets[1].position.x}
            y1={planets[1].position.y}
            x2={planets[2].position.x}
            y2={planets[2].position.y}
            stroke="#00d9ff"
            strokeWidth={2}
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 1.0 }}
          />
          {/* Goals to Budget */}
          <motion.line
            x1={planets[2].position.x}
            y1={planets[2].position.y}
            x2={planets[0].position.x}
            y2={planets[0].position.y}
            stroke="#00d9ff"
            strokeWidth={2}
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />
        </g>

        {/* Planets */}
        {planets.map((planet) => (
          <Planet key={planet.id} {...planet} />
        ))}
      </svg>

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10"
            onClick={closeTutorial}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-500/50 rounded-2xl p-8 max-w-md mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeTutorial}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close tutorial"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="text-6xl mb-4">🌌</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome to Your Financial Galaxy!
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Navigate through three cosmic realms to master your finances:
                </p>
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <div className="text-white font-semibold">Budget Galaxy</div>
                      <div className="text-sm text-gray-400">Track your spending habits</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <div className="text-white font-semibold">Credit Nebula</div>
                      <div className="text-sm text-gray-400">Monitor your credit health</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <div className="text-white font-semibold">Goals Constellation</div>
                      <div className="text-sm text-gray-400">Achieve your financial dreams</div>
                    </div>
                  </div>
                </div>
                <p className="text-cyan-400 text-sm mb-4">
                  Click on any planet to explore!
                </p>
                <button
                  onClick={closeTutorial}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Start Exploring
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute top-8 left-0 right-0 text-center pointer-events-none"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Your Financial Galaxy
        </h1>
        <p className="text-gray-400 text-lg">
          Hover over planets to see your progress
        </p>
      </motion.div>
    </div>
  );
}

export default ConstellationMap;
