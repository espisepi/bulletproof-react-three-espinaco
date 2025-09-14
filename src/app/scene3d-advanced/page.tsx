/* eslint-disable react/no-unknown-property */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable tailwindcss/no-contradicting-classname */
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import {
  OrbitControls,
  Environment,
  Box,
  Sphere,
  Text,
  Html,
} from '@react-three/drei';
import { Mesh, Group } from 'three';

// Animated Box Component
function AnimatedBox({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
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
function FloatingSphere({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.8, 32, 32]} position={position}>
      <meshStandardMaterial color={color} />
    </Sphere>
  );
}

// Interactive Text Component
function InteractiveText() {
  const [clicked, setClicked] = useState(false);

  return (
    <Text
      position={[0, 3, 0]}
      fontSize={0.5}
      color={clicked ? '#ff6b6b' : '#4ecdc4'}
      anchorX="center"
      anchorY="middle"
      onClick={() => setClicked(!clicked)}
    >
      {clicked ? '¡Haz clic en los objetos!' : 'Escena 3D Interactiva'}
    </Text>
  );
}

// Main Scene Component
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />

      {/* Interactive Text */}
      <InteractiveText />

      {/* 3D Objects */}
      <AnimatedBox position={[-3, 0, 0]} color="#ff6b6b" />
      <AnimatedBox position={[0, 0, 0]} color="#4ecdc4" />
      <AnimatedBox position={[3, 0, 0]} color="#45b7d1" />

      <FloatingSphere position={[-1.5, -2, 0]} color="#96ceb4" />
      <FloatingSphere position={[1.5, -2, 0]} color="#feca57" />

      {/* Ground plane */}
      <Box args={[10, 0.1, 10]} position={[0, -3, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
    </>
  );
}

// Loading Component
function Loading() {
  return (
    <Html center>
      <div className="text-white text-xl">Cargando escena 3D...</div>
    </Html>
  );
}

export default function AdvancedScene3DPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Escena 3D Avanzada
          </h1>
          <p className="text-gray-300 text-lg">
            Interactúa con los objetos 3D usando Three.js y React Three Fiber
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">
              🎮 Controles
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>
                • <strong>Rotar:</strong> Click izquierdo + arrastrar
              </li>
              <li>
                • <strong>Zoom:</strong> Scroll del mouse
              </li>
              <li>
                • <strong>Pan:</strong> Click derecho + arrastrar
              </li>
              <li>
                • <strong>Hover:</strong> Pasa el mouse sobre los cubos
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">
              ✨ Características
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Animaciones suaves con useFrame</li>
              <li>• Interactividad con hover effects</li>
              <li>• Iluminación múltiple</li>
              <li>• Texto 3D interactivo</li>
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">
              🛠️ Tecnologías
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Three.js</li>
              <li>• React Three Fiber</li>
              <li>• React Three Drei</li>
              <li>• Next.js 14</li>
            </ul>
          </div>
        </div>

        <div className="relative h-[600px] w-full bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
          <Canvas
            camera={{ position: [0, 2, 8], fov: 75 }}
            style={{ width: '100%', height: '100%' }}
            shadows
          >
            <Suspense fallback={<Loading />}>
              <Environment preset="sunset" />
              <Scene />
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={false}
                minDistance={3}
                maxDistance={20}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🎯 Objetos en la Escena
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded p-4 border border-red-500/30">
              <h3 className="text-lg font-medium text-red-400 mb-2">
                Cubo Rojo
              </h3>
              <p className="text-gray-300 text-sm">
                Cubo animado con efecto hover
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded p-4 border border-teal-500/30">
              <h3 className="text-lg font-medium text-teal-400 mb-2">
                Cubo Teal
              </h3>
              <p className="text-gray-300 text-sm">
                Cubo central con rotación continua
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded p-4 border border-blue-500/30">
              <h3 className="text-lg font-medium text-blue-400 mb-2">
                Cubo Azul
              </h3>
              <p className="text-gray-300 text-sm">Cubo con animación suave</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded p-4 border border-green-500/30">
              <h3 className="text-lg font-medium text-green-400 mb-2">
                Esfera Verde
              </h3>
              <p className="text-gray-300 text-sm">
                Esfera flotante con movimiento sinusoidal
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded p-4 border border-yellow-500/30">
              <h3 className="text-lg font-medium text-yellow-400 mb-2">
                Esfera Amarilla
              </h3>
              <p className="text-gray-300 text-sm">
                Esfera con animación de flotación
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
