/* eslint-disable react/no-unknown-property */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable tailwindcss/no-contradicting-classname */
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import {
  OrbitControls,
  Environment,
  Box,
  Sphere,
  Torus,
} from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

// Rotating Box Component
function RotatingBox() {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Box ref={meshRef} args={[1, 1, 1]} position={[-2, 0, 0]}>
      <meshStandardMaterial color="hotpink" />
    </Box>
  );
}

// Rotating Sphere Component
function RotatingSphere() {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={[2, 0, 0]}>
      <meshStandardMaterial color="orange" />
    </Sphere>
  );
}

// Rotating Torus Component
function RotatingTorus() {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Torus ref={meshRef} args={[1, 0.4, 16, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color="lightblue" />
    </Torus>
  );
}

// Main Scene Component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      <RotatingBox />
      <RotatingSphere />
      <RotatingTorus />
    </>
  );
}

export default function Scene3DPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Escena 3D con Three.js
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Controles</h2>
          <ul className="text-gray-300 space-y-2">
            <li>
              • <strong>Rotar:</strong> Click y arrastrar para rotar la cámara
            </li>
            <li>
              • <strong>Zoom:</strong> Scroll del mouse para hacer zoom
            </li>
            <li>
              • <strong>Pan:</strong> Click derecho y arrastrar para mover la
              vista
            </li>
          </ul>
        </div>

        <div className="relative h-96 w-full bg-gray-800 rounded-lg overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <Environment preset="warehouse" />
              <Scene />
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={false}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Características de la Escena
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded p-4">
              <h3 className="text-lg font-medium text-pink-400 mb-2">
                Cubo Rosa
              </h3>
              <p className="text-gray-300 text-sm">
                Cubo que rota en ambos ejes X e Y con material estándar rosa.
              </p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <h3 className="text-lg font-medium text-orange-400 mb-2">
                Esfera Naranja
              </h3>
              <p className="text-gray-300 text-sm">
                Esfera con rotación suave en ambos ejes y material naranja.
              </p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <h3 className="text-lg font-medium text-blue-400 mb-2">
                Toro Azul
              </h3>
              <p className="text-gray-300 text-sm">
                Forma toroidal con rotación independiente y material azul claro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
