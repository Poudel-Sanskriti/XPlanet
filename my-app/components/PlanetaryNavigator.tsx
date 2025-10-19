'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { ParallaxStars } from './ParallaxStars';
import { PlanetScene } from './Planet3D';
import { OrbitingRocket } from './OrbitingRocket';
import { useRouter } from 'next/navigation';

type PlanetType = 'earth' | 'mars' | 'jupiter' | 'saturn';

interface PlanetConfig {
  type: PlanetType;
  name: string;
  route: string;
  position: number; // Screen widths from origin
}

const PLANETS: PlanetConfig[] = [
  { type: 'earth', name: 'Home', route: '/', position: 0 },
  { type: 'mars', name: 'Credit & Loans', route: '/planet/credit', position: 1 },
  { type: 'jupiter', name: 'Budgeting & Goals', route: '/planet/budget', position: 2 },
  { type: 'saturn', name: 'Insurance', route: '/planet/insurance', position: 3 },
];

export function PlanetaryNavigator() {
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [rocketDragPos, setRocketDragPos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const controls = useAnimation();
  const router = useRouter();

  const currentPlanet = PLANETS[currentPlanetIndex];
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const orbitRadius = 180; // Distance from planet center to rocket

  // Calculate planet center position
  const getPlanetCenter = (planetIndex: number) => {
    const baseX = screenWidth / 2;
    const baseY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
    return {
      x: baseX - (currentPlanetIndex * screenWidth) + (planetIndex * screenWidth),
      y: baseY,
    };
  };

  // Pan to a specific planet
  const panToPlanet = async (planetIndex: number) => {
    if (planetIndex < 0 || planetIndex >= PLANETS.length) return;

    setIsPanning(true);
    const targetScroll = -planetIndex * screenWidth;

    await controls.start({
      x: targetScroll,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        mass: 0.8,
      },
    });

    setCurrentPlanetIndex(planetIndex);
    scrollX.set(targetScroll);
    setIsPanning(false);
  };

  // Handle rocket drag
  const handleRocketDrag = (x: number, y: number) => {
    setRocketDragPos({ x, y });

    // Check if in panning zone
    const panThreshold = screenWidth * (5 / 6); // Right side threshold
    const leftPanThreshold = screenWidth * (1 / 6); // Left side threshold

    if (x > panThreshold && currentPlanetIndex < PLANETS.length - 1) {
      // Pan right to next planet
      if (!isPanning) {
        panToPlanet(currentPlanetIndex + 1);
      }
    } else if (x < leftPanThreshold && currentPlanetIndex > 0) {
      // Pan left to previous planet
      if (!isPanning) {
        panToPlanet(currentPlanetIndex - 1);
      }
    }
  };

  const handleRocketDragEnd = () => {
    setRocketDragPos(null);
  };

  // Navigate to planet page on planet click
  const handlePlanetClick = (planetIndex: number) => {
    if (planetIndex === currentPlanetIndex && planetIndex !== 0) {
      router.push(PLANETS[planetIndex].route);
    }
  };

  const center = getPlanetCenter(currentPlanetIndex);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
    >
      {/* Parallax Star Background */}
      <ParallaxStars scrollOffset={scrollX.get()} />

      {/* Planets Container */}
      <motion.div
        className="absolute inset-0"
        animate={controls}
        style={{ x: scrollX }}
      >
        {PLANETS.map((planet, index) => {
          const planetCenter = getPlanetCenter(index);
          return (
            <div
              key={planet.type}
              className="absolute"
              style={{
                left: `${index * screenWidth}px`,
                top: 0,
                width: `${screenWidth}px`,
                height: '100vh',
              }}
            >
              {/* Planet */}
              <div
                className="absolute cursor-pointer"
                style={{
                  left: `${planetCenter.x - 150}px`,
                  top: `${planetCenter.y - 150}px`,
                  width: '300px',
                  height: '300px',
                }}
                onClick={() => handlePlanetClick(index)}
              >
                <PlanetScene type={planet.type} className="w-full h-full" />
              </div>

              {/* Planet Label */}
              <motion.div
                className="absolute text-center"
                style={{
                  left: `${planetCenter.x - 100}px`,
                  top: `${planetCenter.y + 200}px`,
                  width: '200px',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index === currentPlanetIndex ? 1 : 0.5, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">{planet.name}</h2>
                {index !== 0 && index === currentPlanetIndex && (
                  <p className="text-sm text-cyan-400">Click to explore →</p>
                )}
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Orbiting Rocket */}
      {!isPanning && (
        <OrbitingRocket
          planetX={center.x}
          planetY={center.y}
          orbitRadius={orbitRadius}
          onDrag={handleRocketDrag}
          onDragEnd={handleRocketDragEnd}
          isPaused={isPanning}
        />
      )}

      {/* Search Box (only on Earth) */}
      {currentPlanetIndex === 0 && (
        <motion.div
          className="absolute"
          style={{
            left: `${center.x - 300}px`,
            top: `${center.y + 250}px`,
            width: '600px',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="text"
            placeholder="What would you like to learn?"
            className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-cyan-400/30
                     text-white placeholder-white/50 focus:outline-none focus:border-cyan-400
                     focus:ring-4 focus:ring-cyan-400/20 transition-all"
            onClick={() => router.push('/chat')}
            readOnly
          />
        </motion.div>
      )}

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {PLANETS.map((planet, index) => (
          <button
            key={planet.type}
            onClick={() => panToPlanet(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentPlanetIndex
                ? 'bg-cyan-400 scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to ${planet.name}`}
          />
        ))}
      </div>
    </div>
  );
}
