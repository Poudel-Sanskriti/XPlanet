'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface OrbitingRocketProps {
  planetX: number; // Planet center X position
  planetY: number; // Planet center Y position
  orbitRadius: number;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  isPaused?: boolean;
}

export function OrbitingRocket({
  planetX,
  planetY,
  orbitRadius,
  onDrag,
  onDragEnd,
  isPaused = false,
}: OrbitingRocketProps) {
  const [angle, setAngle] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAngle, setDragAngle] = useState(0);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Calculate rocket position based on angle
  const calculatePosition = (currentAngle: number) => {
    return {
      x: planetX + Math.cos(currentAngle) * orbitRadius,
      y: planetY + Math.sin(currentAngle) * orbitRadius,
    };
  };

  // Orbit animation (when not dragging or hovering)
  useEffect(() => {
    if (isDragging || isHovering || isPaused) return;

    const interval = setInterval(() => {
      setAngle((prev) => (prev + 0.02) % (Math.PI * 2)); // Clockwise rotation
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isDragging, isHovering, isPaused]);

  // Update rocket position based on angle
  useEffect(() => {
    if (!isDragging) {
      const pos = calculatePosition(angle);
      x.set(pos.x);
      y.set(pos.y);
    }
  }, [angle, isDragging, planetX, planetY, orbitRadius]);

  // Calculate nose angle (tangent to orbit + 90 degrees)
  const getNoseAngle = () => {
    if (isDragging) {
      return dragAngle;
    }
    // Tangent angle is orbit angle + 90 degrees (for clockwise)
    return (angle + Math.PI / 2) * (180 / Math.PI);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const mouseX = info.point.x;
    const mouseY = info.point.y;

    // Calculate nose direction based on mouse movement
    if (lastMousePos.x !== 0 || lastMousePos.y !== 0) {
      const dx = mouseX - lastMousePos.x;
      const dy = mouseY - lastMousePos.y;
      if (dx !== 0 || dy !== 0) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        setDragAngle(angle);
      }
    }

    setLastMousePos({ x: mouseX, y: mouseY });
    x.set(mouseX);
    y.set(mouseY);

    if (onDrag) {
      onDrag(mouseX, mouseY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setLastMousePos({ x: 0, y: 0 });

    // Calculate new angle based on final position relative to planet
    const finalX = x.get();
    const finalY = y.get();
    const newAngle = Math.atan2(finalY - planetY, finalX - planetX);
    setAngle(newAngle);

    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      style={{
        x,
        y,
        position: 'absolute',
        cursor: isDragging ? 'grabbing' : 'grab',
        rotate: getNoseAngle(),
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

      {/* Hover indicator */}
      {isHovering && !isDragging && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
