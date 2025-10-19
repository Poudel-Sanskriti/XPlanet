'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { useGLTF, OrbitControls, Bounds, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Model(props: any) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/mars.glb');
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    // Wait for next frame to ensure geometry is loaded
    requestAnimationFrame(() => {
      // Center the model and normalize scale
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Center the model
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;

      // Normalize scale to fit within a unit sphere
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim; // Scale to diameter of 2
      scene.scale.setScalar(scale);

      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const meshChild = child as THREE.Mesh;
          (meshChild.material as THREE.MeshStandardMaterial).metalness = 0;
          (meshChild.material as THREE.MeshStandardMaterial).roughness = 1;
        }
      });

      setIsReady(true);
    });
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.03;
    }
  });

  if (!isReady) return null;

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} />
    </group>
  );
}

export default function MarsModel() {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Model />
      </Suspense>

      <OrbitControls makeDefault enableZoom={false} enablePan={false} target={[0, 0, 0]} />
    </Canvas>
  );
}
