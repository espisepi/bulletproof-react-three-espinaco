/* eslint-disable react/no-unknown-property */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable tailwindcss/no-contradicting-classname */
'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Text, Html } from '@react-three/drei';
import { Mesh } from 'three';

// Base animated component props
interface AnimatedProps {
  position?: [number, number, number];
  color?: string;
  scale?: number;
  speed?: number;
}

// Rotating Box Component
export function RotatingBox({
  position = [0, 0, 0],
  color = '#ff6b6b',
  scale = 1,
  speed = 0.01,
}: AnimatedProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed;
      meshRef.current.scale.setScalar(hovered ? scale * 1.2 : scale);
    }
  });

  return (
    <Box
      ref={meshRef}
      args={[1, 1, 1]}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial color={color} />
    </Box>
  );
}

// Floating Sphere Component
export function FloatingSphere({
  position = [0, 0, 0],
  color = '#4ecdc4',
  scale = 1,
  speed = 0.01,
}: AnimatedProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
      meshRef.current.rotation.x += speed * 0.5;
      meshRef.current.rotation.y += speed;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.8, 32, 32]} position={position}>
      <meshStandardMaterial color={color} />
    </Sphere>
  );
}

// Rotating Torus Component
export function RotatingTorus({
  position = [0, 0, 0],
  color = '#45b7d1',
  scale = 1,
  speed = 0.01,
}: AnimatedProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.5;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Torus ref={meshRef} args={[1, 0.4, 16, 32]} position={position}>
      <meshStandardMaterial color={color} />
    </Torus>
  );
}

// Interactive Text Component
export function InteractiveText({
  text = '3D Scene',
  position = [0, 3, 0],
  color = '#4ecdc4',
}: {
  text?: string;
  position?: [number, number, number];
  color?: string;
}) {
  const [clicked, setClicked] = useState(false);

  return (
    <Text
      position={position}
      fontSize={0.5}
      color={clicked ? '#ff6b6b' : color}
      anchorX="center"
      anchorY="middle"
      onClick={() => setClicked(!clicked)}
    >
      {clicked ? '¡Interactivo!' : text}
    </Text>
  );
}

// Ground Plane Component
export function GroundPlane({
  size = [10, 0.1, 10],
  position = [0, -3, 0],
  color = '#2c3e50',
}: {
  size?: [number, number, number];
  position?: [number, number, number];
  color?: string;
}) {
  return (
    <Box args={size} position={position}>
      <meshStandardMaterial color={color} />
    </Box>
  );
}

// Loading Component
export function Loading3D({
  message = 'Cargando escena 3D...',
}: {
  message?: string;
}) {
  return (
    <Html center>
      <div className="text-white text-xl bg-black/50 px-4 py-2 rounded-lg">
        {message}
      </div>
    </Html>
  );
}

// Scene Lighting Component
export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />
    </>
  );
}
