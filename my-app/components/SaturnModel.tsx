'use client';

import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import { useGLTF, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Model(props: JSX.IntrinsicElements['group']) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/saturn.glb');
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

    // Normalize scale to fit within a unit sphere (made larger to show rings better)
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3.8 / maxDim; // Increased from 2 to 3.8 (90% larger)
    clonedScene.scale.setScalar(scale);

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const meshChild = child as THREE.Mesh;
        (meshChild.material as THREE.MeshStandardMaterial).metalness = 0;
        (meshChild.material as THREE.MeshStandardMaterial).roughness = 1;
      }
    });

    // Tilt Saturn to show the rings better (20 degrees on X axis)
    clonedScene.rotation.x = Math.PI * 0.11; // ~20 degrees

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

const SaturnModel = React.memo(function SaturnModel() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
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
useGLTF.preload('/saturn.glb');

export default SaturnModel;