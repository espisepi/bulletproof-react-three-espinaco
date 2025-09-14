/* eslint-disable react/no-unknown-property */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable tailwindcss/no-contradicting-classname */
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { Mesh, Group } from 'three';
import {
  RotatingBox,
  FloatingSphere,
  RotatingTorus,
  InteractiveText,
  GroundPlane,
  Loading3D,
  SceneLighting,
} from '@/components/3d';

// Particle System Component
function ParticleField() {
  const groupRef = useRef<Group>(null);
  const particles = useRef<Mesh[]>([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }

    particles.current.forEach((particle, i) => {
      if (particle) {
        particle.position.y = Math.sin(state.clock.elapsedTime + i) * 2;
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 50 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) particles.current[i] = el;
          }}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20,
          ]}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial
            color={`hsl(${Math.random() * 360}, 70%, 60%)`}
            emissive={`hsl(${Math.random() * 360}, 70%, 20%)`}
          />
        </mesh>
      ))}
    </group>
  );
}

// Animated Ring Component
function AnimatedRing() {
  const ringRef = useRef<Group>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.02;
      ringRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group ref={ringRef} position={[0, 2, 0]}>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 12) * Math.PI * 2) * 3,
            0,
            Math.sin((i / 12) * Math.PI * 2) * 3,
          ]}
        >
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color={`hsl(${i * 30}, 80%, 60%)`}
            emissive={`hsl(${i * 30}, 80%, 20%)`}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main Scene Component
function AdvancedScene() {
  const [showParticles, setShowParticles] = useState(true);

  return (
    <>
      <SceneLighting />

      {/* Interactive Text */}
      <InteractiveText
        text="Escena 3D Avanzada"
        position={[0, 4, 0]}
        color="#00ff88"
      />

      {/* Main Objects */}
      <RotatingBox position={[-4, 0, 0]} color="#ff6b6b" speed={0.02} />
      <RotatingBox position={[0, 0, 0]} color="#4ecdc4" speed={0.015} />
      <RotatingBox position={[4, 0, 0]} color="#45b7d1" speed={0.01} />

      <FloatingSphere position={[-2, -1, 0]} color="#96ceb4" />
      <FloatingSphere position={[2, -1, 0]} color="#feca57" />

      <RotatingTorus position={[0, 1, 0]} color="#ff9ff3" />

      {/* Advanced Components */}
      <AnimatedRing />

      {showParticles && <ParticleField />}

      {/* Ground */}
      <GroundPlane size={[20, 0.1, 20]} color="#1a1a2e" />

      {/* Interactive Controls */}
      <Html position={[0, -2, 0]}>
        <div className="bg-black/70 text-white p-4 rounded-lg">
          <button
            onClick={() => setShowParticles(!showParticles)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mr-2"
          >
            {showParticles ? 'Ocultar' : 'Mostrar'} Partículas
          </button>
        </div>
      </Html>
    </>
  );
}

export default function SuperAdvancedScene3DPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Escena 3D Super Avanzada
          </h1>
          <p className="text-gray-300 text-xl">
            Demostración completa de capacidades Three.js con React Three Fiber
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎮 Controles
            </h2>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>
                • <strong>Rotar:</strong> Click + arrastrar
              </li>
              <li>
                • <strong>Zoom:</strong> Scroll
              </li>
              <li>
                • <strong>Pan:</strong> Click derecho + arrastrar
              </li>
              <li>
                • <strong>Hover:</strong> Pasa sobre objetos
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              ✨ Características
            </h2>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Sistema de partículas</li>
              <li>• Anillos animados</li>
              <li>• Iluminación múltiple</li>
              <li>• Interactividad avanzada</li>
            </ul>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              🛠️ Tecnologías
            </h2>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Three.js</li>
              <li>• React Three Fiber</li>
              <li>• React Three Drei</li>
              <li>• WebGL Shaders</li>
            </ul>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎯 Rendimiento
            </h2>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• 60 FPS objetivo</li>
              <li>• Optimización automática</li>
              <li>• Lazy loading</li>
              <li>• Memory management</li>
            </ul>
          </div>
        </div>

        <div className="relative h-[700px] w-full bg-gray-900/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-600/30 shadow-2xl">
          <Canvas
            camera={{ position: [0, 3, 10], fov: 75 }}
            style={{ width: '100%', height: '100%' }}
            shadows
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense
              fallback={<Loading3D message="Cargando escena 3D avanzada..." />}
            >
              <Environment preset="night" />
              <AdvancedScene />
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={false}
                minDistance={5}
                maxDistance={25}
                enableDamping={true}
                dampingFactor={0.05}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
          <h2 className="text-2xl font-semibold text-white mb-6">
            🎨 Componentes de la Escena
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg p-4 border border-red-500/30">
              <h3 className="text-lg font-medium text-red-400 mb-2">
                Cubos Animados
              </h3>
              <p className="text-gray-300 text-sm">
                Tres cubos con diferentes velocidades de rotación y efectos
                hover
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg p-4 border border-teal-500/30">
              <h3 className="text-lg font-medium text-teal-400 mb-2">
                Esferas Flotantes
              </h3>
              <p className="text-gray-300 text-sm">
                Esferas con movimiento sinusoidal y rotación suave
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-lg font-medium text-purple-400 mb-2">
                Toro Interactivo
              </h3>
              <p className="text-gray-300 text-sm">
                Forma toroidal con animación independiente en ambos ejes
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
              <h3 className="text-lg font-medium text-yellow-400 mb-2">
                Sistema de Partículas
              </h3>
              <p className="text-gray-300 text-sm">
                50 partículas con movimiento orgánico y colores aleatorios
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg p-4 border border-blue-500/30">
              <h3 className="text-lg font-medium text-blue-400 mb-2">
                Anillo Animado
              </h3>
              <p className="text-gray-300 text-sm">
                Anillo de 12 cubos con movimiento circular y vertical
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
              <h3 className="text-lg font-medium text-green-400 mb-2">
                Iluminación Avanzada
              </h3>
              <p className="text-gray-300 text-sm">
                Múltiples fuentes de luz para crear profundidad y atmósfera
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
