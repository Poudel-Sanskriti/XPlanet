'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { useGLTF, OrbitControls, Bounds, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Model(props: any) {
  // FIX #1: We are telling TypeScript that this ref will hold a THREE.Group.
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/saturn.glb'); 

  useEffect(() => {
    scene.traverse((child) => {
      // FIX #2: We are checking if the child is a Mesh before accessing its material.
      // We also cast it as THREE.Mesh to let TypeScript know its type.
      if ((child as THREE.Mesh).isMesh) {
        const meshChild = child as THREE.Mesh;
        // Now TypeScript knows that meshChild.material is valid.
        (meshChild.material as THREE.MeshStandardMaterial).metalness = 0;
        (meshChild.material as THREE.MeshStandardMaterial).roughness = 1;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) {
      // FIX #3: TypeScript now knows groupRef.current can have a 'rotation' property.
      groupRef.current.rotation.y += 0.03; 
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} />
    </group>
  );
}

export default function SaturnModel() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <Environment preset="sunset" />
      
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={0.37}>
          <Model />
        </Bounds>
      </Suspense>
      
      <OrbitControls makeDefault enableZoom={false} enablePan={false} />
    </Canvas>
  );
}