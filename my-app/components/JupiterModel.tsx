'use client';

import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import { useGLTF, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Model(props: JSX.IntrinsicElements['group']) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/realistic_jupiter.glb');
  const [isReady, setIsReady] = React.useState(false);

  // Memoize processed scene to avoid recalculating
  const processedScene = useMemo(() => {
    const clonedScene = scene.clone();

    // Center the model and normalize scale
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center the model
    clonedScene.position.x = -center.x;
    clonedScene.position.y = -center.y;
    clonedScene.position.z = -center.z;

    // Normalize scale to fit within a unit sphere
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    clonedScene.scale.setScalar(scale);

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const meshChild = child as THREE.Mesh;
        (meshChild.material as THREE.MeshStandardMaterial).metalness = 0;
        (meshChild.material as THREE.MeshStandardMaterial).roughness = 1;
      }
    });

    return clonedScene;
  }, [scene]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Reduced rotation speed for better performance
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  if (!isReady) return null;

  return (
    <group ref={groupRef} {...props}>
      <primitive object={processedScene} />
    </group>
  );
}

const JupiterModel = React.memo(function JupiterModel() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 50 }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance'
      }}
    >
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
});

// Preload the model
useGLTF.preload('/realistic_jupiter.glb');

export default JupiterModel;
