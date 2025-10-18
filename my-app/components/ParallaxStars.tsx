'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  layer: number; // 1 = far, 2 = mid, 3 = close
  glowSize: number;
}

interface ParallaxStarsProps {
  scrollOffset?: number; // For parallax effect when panning
}

export function ParallaxStars({ scrollOffset = 0 }: ParallaxStarsProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 200;
      const newStars: Star[] = [];

      for (let i = 0; i < starCount; i++) {
        const layer = Math.random() < 0.3 ? 3 : Math.random() < 0.6 ? 2 : 1;

        newStars.push({
          x: Math.random() * 100, // Percentage
          y: Math.random() * 100,
          size: layer === 3 ? 2 + Math.random() * 1.5 : layer === 2 ? 1.5 + Math.random() : 1 + Math.random() * 0.5,
          opacity: 0.3 + Math.random() * 0.7,
          layer,
          glowSize: layer === 3 ? 4 : layer === 2 ? 3 : 2,
        });
      }

      setStars(newStars);
    };

    generateStars();
  }, []);

  // Calculate parallax offset based on scroll and layer
  const getParallaxOffset = (layer: number) => {
    const baseSpeed = scrollOffset * 0.1; // Base parallax movement
    if (layer === 3) return baseSpeed * 0.3; // Close stars move more
    if (layer === 2) return baseSpeed * 0.15; // Mid stars move moderately
    return baseSpeed * 0.05; // Far stars barely move
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        background: 'linear-gradient(to left, #000833 0%, #000833 75%, #06135C 100%)',
      }}
    >
      {/* Render stars by layer (far to close for proper z-index) */}
      {[1, 2, 3].map((layer) => (
        <div key={layer} className="absolute inset-0">
          {stars
            .filter((star) => star.layer === layer)
            .map((star, index) => {
              const parallaxX = getParallaxOffset(star.layer);

              return (
                <motion.div
                  key={`${layer}-${index}`}
                  className="absolute rounded-full"
                  style={{
                    left: `calc(${star.x}% + ${parallaxX}px)`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    backgroundColor: '#ffffff',
                    opacity: star.opacity,
                    boxShadow: `0 0 ${star.glowSize}px rgba(255, 255, 255, ${star.opacity * 0.8})`,
                  }}
                  animate={{
                    opacity: [star.opacity, star.opacity * 0.5, star.opacity],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: Math.random() * 2,
                  }}
                />
              );
            })}
        </div>
      ))}
    </div>
  );
}
