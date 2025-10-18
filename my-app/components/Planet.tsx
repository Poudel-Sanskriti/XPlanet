'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export interface PlanetProps {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: number;
  color: string;
  glow: boolean;
  score?: number;
  delay?: number;
}

export function Planet({ id, name, position, size, color, glow, score, delay = 0 }: PlanetProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/planet/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 100
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Navigate to ${name} planet`}
      className="cursor-pointer focus:outline-none"
      style={{ outline: 'none' }}
    >
      {/* Glow effect */}
      {glow && (
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={size + 15}
          fill={color}
          opacity={0.3}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            r: [size + 10, size + 20, size + 10],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Planet body */}
      <motion.circle
        cx={position.x}
        cy={position.y}
        r={size}
        fill={`url(#gradient-${id})`}
        stroke={color}
        strokeWidth={2}
        whileHover={{
          scale: 1.15,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
      />

      {/* Gradient definition */}
      <defs>
        <radialGradient id={`gradient-${id}`}>
          <stop offset="0%" stopColor={color} stopOpacity={0.8} />
          <stop offset="100%" stopColor={color} stopOpacity={0.3} />
        </radialGradient>
      </defs>

      {/* Planet name (appears on hover) */}
      <motion.g
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <rect
          x={position.x - 60}
          y={position.y - size - 40}
          width={120}
          height={30}
          rx={15}
          fill="rgba(0, 0, 0, 0.8)"
          stroke={color}
          strokeWidth={1}
        />
        <text
          x={position.x}
          y={position.y - size - 20}
          textAnchor="middle"
          fill="white"
          fontSize={14}
          fontWeight="bold"
        >
          {name}
        </text>
        {score !== undefined && (
          <text
            x={position.x}
            y={position.y - size - 5}
            textAnchor="middle"
            fill={color}
            fontSize={11}
          >
            Score: {score}
          </text>
        )}
      </motion.g>

      {/* Planet icon/emoji */}
      <text
        x={position.x}
        y={position.y + 8}
        textAnchor="middle"
        fontSize={size * 0.6}
        pointerEvents="none"
      >
        {id === 'budget' && '💰'}
        {id === 'credit' && '💳'}
        {id === 'goals' && '🎯'}
      </text>
    </motion.g>
  );
}

export default Planet;
