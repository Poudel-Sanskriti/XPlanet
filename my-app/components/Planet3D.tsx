'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
      meshRef.current.rotation.y += delta * 0.2; // Visible rotation
    }
  });

  // Planet colors and characteristics with gradients
  const planetConfig = {
    earth: {
      baseColor: '#2b5c8f',
      highlightColor: '#6ba3d4',
      darkColor: '#1a3a5a',
    },
    mars: {
      baseColor: '#c1440e',
      highlightColor: '#e57543',
      darkColor: '#8b2f0a',
    },
    jupiter: {
      baseColor: '#c88b3a',
      highlightColor: '#f4c76d',
      darkColor: '#9a6a2a',
    },
    saturn: {
      baseColor: '#d4a76a',
      highlightColor: '#f5d6a8',
      darkColor: '#b38b54',
    },
  };

  const config = planetConfig[type];

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[scale, 64, 64]} />
      <meshStandardMaterial
        color={config.baseColor}
        emissive={config.darkColor}
        emissiveIntensity={0.15}
        roughness={0.8}
        metalness={0.2}
        flatShading={false}
      />
      {/* Add a subtle outer glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[scale, 32, 32]} />
        <meshBasicMaterial
          color={config.highlightColor}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  );
}

export function Planet3D({ type, position, scale = 2 }: Planet3DProps) {
  return (
    <>
      {/* Key light from upper left */}
      <directionalLight position={[5, 5, 5]} intensity={1.8} />
      {/* Fill light from right */}
      <directionalLight position={[-3, 2, 3]} intensity={0.6} />
      {/* Back light for rim lighting */}
      <directionalLight position={[0, -2, -5]} intensity={0.4} />
      {/* Ambient for base visibility */}
      <ambientLight intensity={0.25} />
      <group position={position}>
        <PlanetMesh type={type} scale={scale} />
      </group>
    </>
  );
}

// Container component for rendering planets in Canvas
export function PlanetScene({ type, className }: { type: Planet3DProps['type']; className?: string }) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [4, 3, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        shadows
      >
        <Planet3D type={type} position={[0, 0, 0]} scale={2.2} />
      </Canvas>
    </div>
  );
}
