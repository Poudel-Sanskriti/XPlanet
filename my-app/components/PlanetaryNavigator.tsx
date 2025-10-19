'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, animate } from 'framer-motion';
import { ParallaxStars } from './ParallaxStars';
import { PlanetScene } from './Planet3D';
import EarthModel from './EarthModel';
import MarsModel from './MarsModel';
import JupiterModel from './JupiterModel';
import SaturnModel from './SaturnModel';
import { UserProfileBadge } from './UserProfileBadge';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

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
  { type: 'saturn', name: 'Investment', route: '/planet/investment', position: 3 },
];

const PLANET_DIAMETER = 600; // Doubled from 300
const ORBIT_RADIUS = 360; // Adjusted for larger planet

export function PlanetaryNavigator() {
  const [rocketPos, setRocketPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingRocket, setIsDraggingRocket] = useState(false);
  const [rocketAngle, setRocketAngle] = useState(0);
  const [orbitingPlanetIndex, setOrbitingPlanetIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(1920);
  const [screenHeight, setScreenHeight] = useState(1080);
  const [isMounted, setIsMounted] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [panningEnabled, setPanningEnabled] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const router = useRouter();

  // Handle screen dimensions after mount
  useEffect(() => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
    setIsMounted(true);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate planet center position
  const getPlanetCenter = (planetIndex: number) => {
    const baseX = screenWidth / 2;
    const baseY = screenHeight / 2;
    return {
      x: baseX + (planetIndex * screenWidth),
      y: baseY,
    };
  };

  // Calculate rocket orbital position
  const getOrbitalPosition = (planetIndex: number, angle: number) => {
    const center = getPlanetCenter(planetIndex);
    return {
      x: center.x + Math.cos(angle) * ORBIT_RADIUS,
      y: center.y + Math.sin(angle) * ORBIT_RADIUS,
    };
  };

  // Rocket orbit animation - One revolution every 30 seconds
  useEffect(() => {
    if (isDraggingRocket || isFlying || !isMounted) return;

    const interval = setInterval(() => {
      // 2*PI radians in 30 seconds = 2*PI/(30*60) per frame at 60fps
      setRocketAngle((prev) => (prev + (Math.PI * 2) / (30 * 60)) % (Math.PI * 2));
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isDraggingRocket, isFlying, isMounted]);

  // Update rocket position when orbiting
  useEffect(() => {
    if (!isDraggingRocket && !isFlying && isMounted) {
      const pos = getOrbitalPosition(orbitingPlanetIndex, rocketAngle);
      setRocketPos(pos);

      // Center camera on orbiting planet
      const targetScroll = -orbitingPlanetIndex * screenWidth;
      scrollX.set(targetScroll);
    }
  }, [rocketAngle, orbitingPlanetIndex, isDraggingRocket, isFlying, isMounted, screenWidth]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousPlanet();
      } else if (e.key === 'ArrowRight') {
        handleNextPlanet();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orbitingPlanetIndex, isFlying]);

  // Find nearest planet to a position
  const findNearestPlanet = (x: number, y: number): number => {
    let nearestIndex = 0;
    let minDistance = Infinity;

    PLANETS.forEach((planet, index) => {
      const center = getPlanetCenter(index);
      const distance = Math.sqrt(
        Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  // Handle rocket drag
  const handleRocketDrag = (x: number, y: number) => {
    setRocketPos({ x, y });

    // Only allow panning if cooldown is over
    if (!panningEnabled) return;

    // Only pan when rocket is in the last 1/6th of the screen (left or right edge)
    const leftPanZone = screenWidth / 6; // Left 1/6th
    const rightPanZone = screenWidth * (5 / 6); // Right 1/6th

    const currentScroll = scrollX.get();
    const centerX = screenWidth / 2;

    // Check if rocket is in panning zones
    if (x < leftPanZone) {
      // Pan left (towards previous planets)
      const minScroll = 0; // Earth boundary
      const panAmount = (leftPanZone - x) / leftPanZone; // 0 to 1
      // Slower panning: 2s per planet = screenWidth pixels in 2000ms at 60fps = screenWidth/120 per frame
      const targetScroll = currentScroll + panAmount * (screenWidth / 120);
      const newScroll = Math.min(minScroll, targetScroll);
      scrollX.set(newScroll);

      // Check if a new planet reached the midpoint
      const planetAtCenter = Math.round(-newScroll / screenWidth);
      if (planetAtCenter !== orbitingPlanetIndex) {
        // Planet reached center, disable panning for 3s
        setPanningEnabled(false);
        setOrbitingPlanetIndex(planetAtCenter);
        setTimeout(() => setPanningEnabled(true), 3000);
      }
    } else if (x > rightPanZone) {
      // Pan right (towards next planets)
      const maxScroll = -(PLANETS.length - 1) * screenWidth; // Saturn boundary
      const panAmount = (x - rightPanZone) / (screenWidth - rightPanZone); // 0 to 1
      // Slower panning: 2s per planet = screenWidth pixels in 2000ms at 60fps = screenWidth/120 per frame
      const targetScroll = currentScroll - panAmount * (screenWidth / 120);
      const newScroll = Math.max(maxScroll, targetScroll);
      scrollX.set(newScroll);

      // Check if a new planet reached the midpoint
      const planetAtCenter = Math.round(-newScroll / screenWidth);
      if (planetAtCenter !== orbitingPlanetIndex) {
        // Planet reached center, disable panning for 3s
        setPanningEnabled(false);
        setOrbitingPlanetIndex(planetAtCenter);
        setTimeout(() => setPanningEnabled(true), 3000);
      }
    }
  };

  const handleRocketDragStart = () => {
    setIsDraggingRocket(true);
    setShowTutorial(false);
    setHasInteracted(true);
  };

  const handleRocketDragEnd = (x: number, y: number) => {
    setIsDraggingRocket(false);

    // Find nearest planet
    const nearestPlanetIndex = findNearestPlanet(x, y);
    const targetCenter = getPlanetCenter(nearestPlanetIndex);

    // Calculate target orbital position (same angle relative to planet)
    const dx = x - targetCenter.x;
    const dy = y - targetCenter.y;
    const targetAngle = Math.atan2(dy, dx);
    const targetPos = getOrbitalPosition(nearestPlanetIndex, targetAngle);

    // Animate rocket flying to orbit with S-curve
    setIsFlying(true);

    const startX = x;
    const startY = y;

    // Generate randomized S-curve control points (subtle curves)
    const midX = (startX + targetPos.x) / 2;
    const midY = (startY + targetPos.y) / 2;

    // Random offset for S-curve (20-40% of distance, subtle)
    const distance = Math.sqrt(Math.pow(targetPos.x - startX, 2) + Math.pow(targetPos.y - startY, 2));
    const curveStrength = distance * (0.2 + Math.random() * 0.2); // 20-40% of distance

    // Perpendicular direction for curve
    const perpX = -(targetPos.y - startY) / distance;
    const perpY = (targetPos.x - startX) / distance;

    // Two control points for S-curve (one on each side of midpoint)
    const control1X = startX + (midX - startX) * 0.5 + perpX * curveStrength * (Math.random() > 0.5 ? 1 : -1);
    const control1Y = startY + (midY - startY) * 0.5 + perpY * curveStrength * (Math.random() > 0.5 ? 1 : -1);

    const control2X = midX + (targetPos.x - midX) * 0.5 - perpX * curveStrength * (Math.random() > 0.5 ? 1 : -1);
    const control2Y = midY + (targetPos.y - midY) * 0.5 - perpY * curveStrength * (Math.random() > 0.5 ? 1 : -1);

    // Cubic Bezier curve helper
    const cubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number) => {
      const u = 1 - t;
      return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
    };

    animate(0, 1, {
      duration: 1.2,
      ease: 'easeInOut',
      onUpdate: (progress) => {
        // Calculate position along S-curve using cubic Bezier
        const currentX = cubicBezier(progress, startX, control1X, control2X, targetPos.x);
        const currentY = cubicBezier(progress, startY, control1Y, control2Y, targetPos.y);
        setRocketPos({ x: currentX, y: currentY });

        // Smoothly scroll camera to target planet
        const targetScroll = -nearestPlanetIndex * screenWidth;
        const currentScroll = scrollX.get();
        scrollX.set(currentScroll + (targetScroll - currentScroll) * progress * 0.4);
      },
      onComplete: () => {
        setOrbitingPlanetIndex(nearestPlanetIndex);
        setRocketAngle(targetAngle);
        setIsFlying(false);
      },
    });
  };

  // Navigate to planet page on planet click
  const handlePlanetClick = (planetIndex: number) => {
    if (planetIndex === orbitingPlanetIndex && planetIndex !== 0) {
      router.push(PLANETS[planetIndex].route);
    }
  };

  // Navigate to previous planet
  const handlePreviousPlanet = () => {
    if (orbitingPlanetIndex > 0 && !isFlying) {
      const targetIndex = orbitingPlanetIndex - 1;
      const targetScroll = -targetIndex * screenWidth;

      // Smooth scroll to previous planet
      animate(scrollX.get(), targetScroll, {
        duration: 1,
        ease: 'easeInOut',
        onUpdate: (v) => scrollX.set(v),
        onComplete: () => {
          setOrbitingPlanetIndex(targetIndex);
        }
      });
    }
  };

  // Navigate to next planet
  const handleNextPlanet = () => {
    if (orbitingPlanetIndex < PLANETS.length - 1 && !isFlying) {
      const targetIndex = orbitingPlanetIndex + 1;
      const targetScroll = -targetIndex * screenWidth;

      // Smooth scroll to next planet
      animate(scrollX.get(), targetScroll, {
        duration: 1,
        ease: 'easeInOut',
        onUpdate: (v) => scrollX.set(v),
        onComplete: () => {
          setOrbitingPlanetIndex(targetIndex);
        }
      });
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading XPlanet...</div>
      </div>
    );
  }

  const searchBarWidth = (PLANET_DIAMETER * 2) / 3;

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
    >
      {/* User Profile Badge */}
      <UserProfileBadge />

      {/* Parallax Star Background */}
      <ParallaxStars scrollOffset={scrollX.get()} />

      {/* Planets Container - Continuous scrolling */}
      <motion.div
        className="absolute inset-0"
        style={{ x: scrollX }}
      >
        {PLANETS.map((planet, index) => {
          const planetCenter = getPlanetCenter(index);
          return (
            <div
              key={planet.type}
              className="absolute"
              style={{
                left: `${planetCenter.x - PLANET_DIAMETER / 2}px`,
                top: `${planetCenter.y - PLANET_DIAMETER / 2}px`,
                width: `${PLANET_DIAMETER}px`,
                height: `${PLANET_DIAMETER}px`,
              }}
              onClick={() => handlePlanetClick(index)}
            >
              {/* Render 3D models for all planets */}
              <div className="w-full h-full cursor-pointer">
                {planet.type === 'earth' && <EarthModel />}
                {planet.type === 'mars' && <MarsModel />}
                {planet.type === 'jupiter' && <JupiterModel />}
                {planet.type === 'saturn' && <SaturnModel />}
              </div>

              {/* Click hint - only show for non-home planets when active */}
              {index !== 0 && index === orbitingPlanetIndex && (
                <motion.div
                  className="absolute text-center pointer-events-none"
                  style={{
                    left: `${PLANET_DIAMETER / 2 - 100}px`,
                    top: `${PLANET_DIAMETER + 30}px`,
                    width: '200px',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-cyan-400 font-medium">Click to explore →</p>
                </motion.div>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Orbiting/Draggable Rocket */}
      {rocketPos && (
        <RocketComponent
          x={rocketPos.x}
          y={rocketPos.y}
          angle={
            isDraggingRocket
              ? Math.atan2(
                  rocketPos.y - (rocketPos.y - 10),
                  rocketPos.x - (rocketPos.x - 10)
                ) * (180 / Math.PI)
              : (rocketAngle + Math.PI / 2) * (180 / Math.PI)
          }
          onDragStart={handleRocketDragStart}
          onDrag={handleRocketDrag}
          onDragEnd={handleRocketDragEnd}
          scrollX={scrollX.get()}
        />
      )}

      {/* Search Box (only on Earth) */}
      {orbitingPlanetIndex === 0 && (
        <motion.div
          className="absolute"
          style={{
            left: `${screenWidth / 2 - searchBarWidth / 2}px`,
            top: `${screenHeight / 2 + PLANET_DIAMETER / 2 - 50}px`,
            width: `${searchBarWidth}px`,
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

      {/* Navigation Buttons */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50">
        {/* Previous Button */}
        <motion.button
          onClick={handlePreviousPlanet}
          disabled={orbitingPlanetIndex === 0 || isFlying}
          className="p-4 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/50
                   text-cyan-300 hover:bg-cyan-500/30 hover:scale-110 transition-all
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        {/* Planet Indicators */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/50 backdrop-blur-md border border-cyan-500/30">
          {PLANETS.map((planet, index) => (
            <div
              key={planet.type}
              className={`w-2 h-2 rounded-full transition-all ${
                index === orbitingPlanetIndex
                  ? 'bg-cyan-400 w-8'
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          onClick={handleNextPlanet}
          disabled={orbitingPlanetIndex === PLANETS.length - 1 || isFlying}
          className="p-4 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/50
                   text-cyan-300 hover:bg-cyan-500/30 hover:scale-110 transition-all
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Current Planet Info - Moved higher to avoid overlap */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40">
        <motion.div
          key={orbitingPlanetIndex}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-3 rounded-full bg-gray-900/70 backdrop-blur-md border border-cyan-500/30"
        >
          <h3 className="text-xl font-bold text-white text-center">
            {PLANETS[orbitingPlanetIndex].name}
          </h3>
        </motion.div>
      </div>

      {/* Floating Action Button - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-40">
        {/* Chat Button */}
        <motion.button
          onClick={() => router.push('/chat')}
          className="group p-4 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600
                   hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/50
                   hover:shadow-blue-500/70 transition-all flex items-center gap-3"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Chat with Captain Gemini"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="text-white font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300">
            Ask Captain Gemini
          </span>
        </motion.button>
      </div>

      {/* Tutorial Overlay - First visit */}
      {showTutorial && orbitingPlanetIndex === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Rocket drag hint - positioned to the side */}
          <motion.div
            className="absolute"
            style={{
              left: rocketPos ? `${rocketPos.x + 100}px` : '50%',
              top: rocketPos ? `${rocketPos.y - 50}px` : '50%'
            }}
            animate={{
              x: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="px-4 py-2 bg-cyan-500/90 backdrop-blur-md rounded-full border-2 border-cyan-300 shadow-lg shadow-cyan-500/50">
              <p className="text-white font-semibold text-xs whitespace-nowrap">
                🚀 Drag me!
              </p>
            </div>
          </motion.div>

          {/* Panning zone indicators */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1/6 bg-gradient-to-r from-cyan-500/20 to-transparent border-r border-cyan-500/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <ChevronLeft className="w-12 h-12 text-cyan-300" />
            </div>
          </motion.div>

          <motion.div
            className="absolute right-0 top-0 bottom-0 w-1/6 bg-gradient-to-l from-cyan-500/20 to-transparent border-l border-cyan-500/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <ChevronRight className="w-12 h-12 text-cyan-300" />
            </div>
          </motion.div>

          {/* Instruction - Positioned on the side to avoid overlap */}
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="px-6 py-4 bg-gray-900/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 shadow-xl max-w-xs"
            >
              <p className="text-cyan-300 text-sm leading-relaxed">
                Drag the rocket to the <span className="text-cyan-400 font-bold">glowing edges</span> to explore other planets 🌟
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Dismiss tutorial button */}
      {showTutorial && (
        <button
          onClick={() => setShowTutorial(false)}
          className="fixed top-6 right-6 z-50 px-4 py-2 bg-gray-900/70 backdrop-blur-md border border-cyan-500/30 text-cyan-300 rounded-full hover:bg-gray-900/90 transition-all text-sm"
        >
          Got it! ✨
        </button>
      )}
    </div>
  );
}

// Separate rocket component for drag handling
function RocketComponent({
  x,
  y,
  angle,
  onDragStart,
  onDrag,
  onDragEnd,
  scrollX,
}: {
  x: number;
  y: number;
  angle: number;
  onDragStart: () => void;
  onDrag: (x: number, y: number) => void;
  onDragEnd: (x: number, y: number) => void;
  scrollX: number;
}) {
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x, y });
  const [noseAngle, setNoseAngle] = useState(angle);

  useEffect(() => {
    setNoseAngle(angle);
  }, [angle]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        onDragStart();
        setDragStartPos({ x, y });
        setLastPos({ x, y });
      }}
      onDrag={(event, info) => {
        const newX = x + info.offset.x;
        const newY = y + info.offset.y;

        // Calculate nose angle from movement direction
        if (lastPos.x !== newX || lastPos.y !== newY) {
          const dx = newX - lastPos.x;
          const dy = newY - lastPos.y;
          if (dx !== 0 || dy !== 0) {
            setNoseAngle(Math.atan2(dy, dx) * (180 / Math.PI));
          }
        }

        setLastPos({ x: newX, y: newY });
        onDrag(newX, newY);
      }}
      onDragEnd={(event, info) => {
        const finalX = x + info.offset.x;
        const finalY = y + info.offset.y;
        onDragEnd(finalX, finalY);
      }}
      style={{
        x: x + scrollX,
        y,
        position: 'absolute',
        cursor: 'grab',
        rotate: noseAngle,
        left: -24,
        top: -24,
      }}
      className="w-12 h-12 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Rocket SVG */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 8px rgba(66, 133, 244, 0.8))' }}
      >
        {/* Main body */}
        <path
          d="M24 4 L30 36 L24 32 L18 36 Z"
          fill="url(#rocket-gradient)"
          stroke="#2563eb"
          strokeWidth="1"
        />
        {/* Wings */}
        <path d="M18 24 L12 32 L18 28 Z" fill="#8b5cf6" />
        <path d="M30 24 L36 32 L30 28 Z" fill="#8b5cf6" />
        {/* Window */}
        <circle cx="24" cy="16" r="3" fill="#60a5fa" stroke="#1e40af" strokeWidth="1" />
        {/* Flame */}
        <motion.path
          d="M20 36 L24 44 L28 36"
          fill="url(#flame-gradient)"
          animate={{
            d: [
              'M20 36 L24 44 L28 36',
              'M20 36 L24 46 L28 36',
              'M20 36 L24 44 L28 36',
            ],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Gradients */}
        <defs>
          <linearGradient id="rocket-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="flame-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
