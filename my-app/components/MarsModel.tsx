'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { useGLTF, OrbitControls, Bounds, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Model(props: any) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/mars.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const meshChild = child as THREE.Mesh;
        (meshChild.material as THREE.MeshStandardMaterial).metalness = 0;
        (meshChild.material as THREE.MeshStandardMaterial).roughness = 1;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.03;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} />
    </group>
  );
}

export default function MarsModel() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.5}>
          <Model />
        </Bounds>
      </Suspense>

      <OrbitControls makeDefault enableZoom={false} enablePan={false} target={[0, 0, 0]} />
    </Canvas>
  );
}
