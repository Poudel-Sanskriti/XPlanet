'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface Planet3DProps {
  type: 'earth' | 'mars' | 'jupiter' | 'saturn';
  position: [number, number, number];
  scale?: number;
}

function PlanetMesh({ type, scale = 1 }: { type: Planet3DProps['type']; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotate the planet slowly
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });

  // Planet colors and characteristics
  const planetConfig = {
    earth: {
      color: '#4a90e2',
      emissive: '#1a4d7a',
      detail: true,
    },
    mars: {
      color: '#cd5c5c',
      emissive: '#8b3a3a',
      detail: false,
    },
    jupiter: {
      color: '#daa520',
      emissive: '#b8860b',
      detail: true,
    },
    saturn: {
      color: '#f4a460',
      emissive: '#cd853f',
      detail: true,
    },
  };

  const config = planetConfig[type];

  return (
    <Sphere ref={meshRef} args={[scale, 64, 64]}>
      <meshStandardMaterial
        color={config.color}
        emissive={config.emissive}
        emissiveIntensity={0.2}
        roughness={0.7}
        metalness={0.3}
      />
    </Sphere>
  );
}

export function Planet3D({ type, position, scale = 2 }: Planet3DProps) {
  return (
    <group position={position}>
      <PlanetMesh type={type} scale={scale} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}

// Container component for rendering planets in Canvas
export function PlanetScene({ type, className }: { type: Planet3DProps['type']; className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Planet3D type={type} position={[0, 0, 0]} scale={2} />
      </Canvas>
    </div>
  );
}
