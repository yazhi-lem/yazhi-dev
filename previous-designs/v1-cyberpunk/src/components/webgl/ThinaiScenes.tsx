"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

// Kurinji (Mountains)
export function KurinjiScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.x = -Math.PI / 2.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#9D7BC7" />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#B89DD9" />
      <mesh ref={meshRef} position={[0, -2, -5]}>
        <planeGeometry args={[30, 30, 32, 32]} />
        <meshStandardMaterial 
          color="#2A2038" 
          wireframe 
          emissive="#4A3058"
          emissiveIntensity={0.5} 
        />
      </mesh>
      <fog attach="fog" args={['#1A1228', 5, 20]} />
    </>
  );
}

// Mullai (Forest)
export function MullaiScene() {
  const count = 1000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = Math.random() * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      pointsRef.current.position.y -= 0.02;
      if (pointsRef.current.position.y < -10) {
        pointsRef.current.position.y = 10;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} color="#6B9F2F" />
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#8BC34A" size={0.1} sizeAttenuation={true} depthWrite={false} />
      </Points>
      <fog attach="fog" args={['#050A05', 2, 15]} />
    </>
  );
}

// Marutham (Agriculture/Plains)
export function MaruthamScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const positionAttribute = meshRef.current.geometry.attributes.position;
      const time = clock.getElapsedTime();
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        positionAttribute.setZ(i, Math.sin(x * 2 + time) * 0.2 + Math.cos(y * 2 + time) * 0.2);
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={1} color="#C17B3D" />
      <mesh ref={meshRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2, -5]}>
        <planeGeometry args={[20, 20, 64, 64]} />
        <meshStandardMaterial color="#2C1810" roughness={0.1} metalness={0.8} />
      </mesh>
    </>
  );
}

// Neytal (Coastal)
export function NeytalScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 2.5;
      const positionAttribute = meshRef.current.geometry.attributes.position;
      const time = clock.getElapsedTime() * 0.5;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        positionAttribute.setZ(i, Math.sin(x + time) * 0.5 + Math.sin(y + time) * 0.5);
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#0A1628" />
      <directionalLight position={[0, 10, 5]} intensity={2} color="#4A9ECC" />
      <mesh ref={meshRef} position={[0, -2, -8]}>
        <planeGeometry args={[30, 30, 64, 64]} />
        <meshStandardMaterial color="#132337" wireframe={true} emissive="#0A1628" />
      </mesh>
      <fog attach="fog" args={['#050A10', 5, 15]} />
    </>
  );
}

// Palai (Desert)
export function PalaiScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.1;
      meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} color="#CC6B4A" />
      <directionalLight position={[10, 5, 0]} intensity={2} color="#D98B6B" />
      <mesh ref={meshRef} position={[0, 0, -5]}>
        <torusKnotGeometry args={[3, 0.5, 100, 16]} />
        <meshStandardMaterial color="#3D2626" wireframe />
      </mesh>
      <fog attach="fog" args={['#1A0505', 2, 10]} />
    </>
  );
}
