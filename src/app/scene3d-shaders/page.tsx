/* eslint-disable react/no-unknown-property */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable tailwindcss/no-contradicting-classname */
'use client';

import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Suspense, useRef, useState, useMemo } from 'react';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { Mesh, ShaderMaterial, Color, Vector3 } from 'three';
import * as THREE from 'three';

// Extend Three.js with custom shader material
extend({ ShaderMaterial });

// Custom Shader Material Props
interface CustomShaderProps {
    position?: [number, number, number];
    scale?: number;
    speed?: number;
    color?: string;
}

// 1. WAVE ANIMATION SHADER - Vertex Shader Animation
function WaveAnimatedPlane({ position = [0, 0, 0], scale = 1, speed = 1 }: CustomShaderProps) {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);

    const vertexShader = `
    uniform float uTime;
    uniform float uSpeed;
    uniform float uAmplitude;
    uniform float uFrequency;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Create wave animation in vertex shader
      float elevation = sin(modelPosition.x * uFrequency + uTime * uSpeed) * uAmplitude;
      elevation += sin(modelPosition.z * uFrequency * 0.5 + uTime * uSpeed * 1.5) * uAmplitude * 0.5;
      
      modelPosition.y += elevation;
      vElevation = elevation;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
    }
  `;

    const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      // Create animated color based on elevation and time
      vec3 color1 = vec3(0.2, 0.6, 1.0);
      vec3 color2 = vec3(1.0, 0.3, 0.6);
      vec3 color3 = vec3(0.3, 1.0, 0.4);
      
      // Mix colors based on elevation
      vec3 mixedColor = mix(color1, color2, vElevation * 0.5 + 0.5);
      mixedColor = mix(mixedColor, color3, sin(uTime * 2.0) * 0.5 + 0.5);
      
      // Add animated pattern
      float pattern = sin(vUv.x * 20.0 + uTime * 3.0) * sin(vUv.y * 20.0 + uTime * 2.0);
      pattern = pattern * 0.1 + 0.9;
      
      gl_FragColor = vec4(mixedColor * pattern, 1.0);
    }
  `;

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uAmplitude: { value: 0.5 },
        uFrequency: { value: 2.0 },
        uColor: { value: new Color(0.2, 0.6, 1.0) }
    }), [speed]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <planeGeometry args={[4, 4, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                wireframe={false}
            />
        </mesh>
    );
}

// 2. PULSING SPHERE SHADER - Fragment Shader Animation
function PulsingSphere({ position = [0, 0, 0], scale = 1, speed = 1 }: CustomShaderProps) {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);

    const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Create pulsing effect
      float pulse = sin(uTime * uSpeed * 3.0) * 0.5 + 0.5;
      
      // Create color gradient based on normal
      vec3 color1 = uColor1;
      vec3 color2 = uColor2;
      vec3 color3 = uColor3;
      
      // Mix colors based on normal direction
      vec3 mixedColor = mix(color1, color2, vNormal.y * 0.5 + 0.5);
      mixedColor = mix(mixedColor, color3, pulse);
      
      // Add rim lighting effect
      float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
      rim = pow(rim, 2.0);
      
      // Add animated noise
      float noise = sin(vPosition.x * 10.0 + uTime * uSpeed) * sin(vPosition.y * 10.0 + uTime * uSpeed * 1.5);
      noise = noise * 0.1 + 0.9;
      
      vec3 finalColor = mixedColor + rim * vec3(1.0, 0.5, 0.2);
      finalColor *= noise;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uColor1: { value: new Color(1.0, 0.2, 0.4) },
        uColor2: { value: new Color(0.2, 0.8, 1.0) },
        uColor3: { value: new Color(0.8, 0.2, 1.0) }
    }), [speed]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <sphereGeometry args={[1, 32, 32]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

// 3. MORPHING CUBE SHADER - Complex Vertex Animation
function MorphingCube({ position = [0, 0, 0], scale = 1, speed = 1 }: CustomShaderProps) {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);

    const vertexShader = `
    uniform float uTime;
    uniform float uSpeed;
    uniform float uMorphFactor;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vMorph;
    
    void main() {
      vUv = uv;
      vNormal = normal;
      
      vec3 newPosition = position;
      
      // Create morphing effect
      float morph = sin(uTime * uSpeed) * uMorphFactor;
      
      // Spherical morphing
      float radius = length(position);
      vec3 spherePos = normalize(position) * radius;
      
      // Mix between original and morphed position
      newPosition = mix(position, spherePos, morph);
      
      // Add wave distortion
      newPosition.x += sin(newPosition.y * 3.0 + uTime * uSpeed * 2.0) * 0.1;
      newPosition.y += sin(newPosition.z * 3.0 + uTime * uSpeed * 1.5) * 0.1;
      newPosition.z += sin(newPosition.x * 3.0 + uTime * uSpeed * 2.5) * 0.1;
      
      vMorph = morph;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uBaseColor;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vMorph;
    
    void main() {
      // Create animated color based on morph factor
      vec3 color1 = uBaseColor;
      vec3 color2 = vec3(1.0, 0.5, 0.2);
      vec3 color3 = vec3(0.2, 1.0, 0.5);
      
      vec3 mixedColor = mix(color1, color2, vMorph);
      mixedColor = mix(mixedColor, color3, sin(uTime * uSpeed * 4.0) * 0.5 + 0.5);
      
      // Add animated stripes
      float stripes = sin(vUv.x * 20.0 + uTime * uSpeed * 3.0);
      stripes = step(0.5, stripes);
      
      // Add normal-based lighting
      float lighting = dot(vNormal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
      
      vec3 finalColor = mixedColor * lighting;
      finalColor = mix(finalColor, finalColor * 2.0, stripes * 0.3);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uMorphFactor: { value: 0.3 },
        uBaseColor: { value: new Color(0.4, 0.2, 0.8) }
    }), [speed]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <boxGeometry args={[1.5, 1.5, 1.5, 16, 16, 16]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

// 4. ENERGY FIELD SHADER - Advanced Fragment Effects
function EnergyField({ position = [0, 0, 0], scale = 1, speed = 1 }: CustomShaderProps) {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);

    const vertexShader = `
    uniform float uTime;
    uniform float uSpeed;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vTime;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vTime = uTime * uSpeed;
      
      // Subtle vertex animation
      vec3 newPosition = position;
      newPosition.y += sin(position.x * 2.0 + uTime * uSpeed) * 0.05;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vTime;
    
    // Noise function
    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 st = vUv;
      
      // Create animated energy field
      float energy1 = sin(st.x * 10.0 + vTime * 2.0) * sin(st.y * 10.0 + vTime * 1.5);
      float energy2 = sin(st.x * 15.0 + vTime * 3.0) * sin(st.y * 15.0 + vTime * 2.5);
      
      // Add noise for organic feel
      float noiseValue = noise(st * 20.0 + vTime * 0.5);
      
      // Combine energies
      float combinedEnergy = energy1 * 0.6 + energy2 * 0.4 + noiseValue * 0.2;
      
      // Create color based on energy
      vec3 color1 = uColor1;
      vec3 color2 = uColor2;
      vec3 finalColor = mix(color1, color2, combinedEnergy * 0.5 + 0.5);
      
      // Add pulsing effect
      float pulse = sin(vTime * 4.0) * 0.3 + 0.7;
      finalColor *= pulse;
      
      // Add glow effect
      float glow = pow(combinedEnergy, 2.0);
      finalColor += glow * vec3(0.5, 1.0, 1.5);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uColor1: { value: new Color(0.0, 0.5, 1.0) },
        uColor2: { value: new Color(1.0, 0.0, 0.5) }
    }), [speed]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <planeGeometry args={[3, 3, 32, 32]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// 5. FIRE PARTICLE SYSTEM - Realistic Fire Simulation
function FireParticleSystem({
    position = [0, 0, 0],
    scale = 1,
    speed = 1,
    fireIntensity = 1.2,
    windStrength = 0.3
}: CustomShaderProps & { fireIntensity?: number; windStrength?: number }) {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);
    const particleCount = 1000;

    // Generate particle positions and attributes
    const particlePositions = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const lifetimes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Random position at base of fire
            positions[i3] = (Math.random() - 0.5) * 2.0; // x
            positions[i3 + 1] = 0.0; // y (start at bottom)
            positions[i3 + 2] = (Math.random() - 0.5) * 2.0; // z

            // Random velocity (upward with some randomness)
            velocities[i3] = (Math.random() - 0.5) * 0.5; // x
            velocities[i3 + 1] = Math.random() * 2.0 + 1.0; // y (upward)
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.5; // z

            // Random size
            sizes[i] = Math.random() * 0.3 + 0.1;

            // Random lifetime offset
            lifetimes[i] = Math.random() * 10.0;
        }

        return { positions, velocities, sizes, lifetimes };
    }, []);

    const vertexShader = `
    uniform float uTime;
    uniform float uSpeed;
    uniform float uWindStrength;
    uniform float uFireIntensity;
    
    attribute float aSize;
    attribute float aLifetime;
    attribute vec3 aVelocity;
    
    varying float vLife;
    varying float vSize;
    varying vec3 vColor;
    
    // Noise function for realistic fire movement
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }
    
    void main() {
      // Calculate particle lifetime
      float life = mod(uTime * uSpeed + aLifetime, 10.0) / 10.0;
      vLife = life;
      vSize = aSize;
      
      // Calculate position based on velocity and time
      vec3 pos = position;
      
      // Apply velocity
      pos += aVelocity * life * 2.0;
      
      // Add wind effect
      float windEffect = sin(uTime * uSpeed * 0.5 + position.x * 2.0) * uWindStrength;
      pos.x += windEffect * life;
      
      // Add turbulence for realistic fire movement
      float turbulence = noise(vec3(pos.x * 0.5, pos.y * 0.3, uTime * uSpeed * 0.2));
      pos.x += (turbulence - 0.5) * 0.5 * life;
      pos.z += (turbulence - 0.5) * 0.3 * life;
      
      // Fade out particles as they age
      float alpha = 1.0 - life;
      alpha = pow(alpha, 2.0);
      
      // Calculate fire colors based on height and life
      vec3 baseColor = vec3(1.0, 0.3, 0.1); // Orange-red base
      vec3 midColor = vec3(1.0, 0.6, 0.2);  // Orange-yellow
      vec3 topColor = vec3(1.0, 1.0, 0.8);  // White-yellow
      
      // Mix colors based on height
      float heightFactor = pos.y / 3.0;
      heightFactor = clamp(heightFactor, 0.0, 1.0);
      
      vec3 color1 = mix(baseColor, midColor, heightFactor);
      vec3 color2 = mix(midColor, topColor, heightFactor);
      vColor = mix(color1, color2, life);
      
      // Apply fire intensity
      vColor *= uFireIntensity;
      
      // Set particle size
      gl_PointSize = aSize * (1.0 - life) * 50.0;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float uTime;
    uniform float uSpeed;
    
    varying float vLife;
    varying float vSize;
    varying vec3 vColor;
    
    void main() {
      // Create circular particle shape
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      // Soft edge for particles
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      
      // Fade based on life
      alpha *= (1.0 - vLife);
      
      // Add inner glow
      float innerGlow = 1.0 - smoothstep(0.0, 0.2, dist);
      innerGlow *= 0.5;
      
      // Create fire-like gradient
      vec3 finalColor = vColor;
      finalColor += innerGlow * vec3(1.0, 1.0, 0.5);
      
      // Add flickering effect
      float flicker = sin(uTime * uSpeed * 20.0 + vLife * 10.0) * 0.1 + 0.9;
      finalColor *= flicker;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uWindStrength: { value: windStrength },
        uFireIntensity: { value: fireIntensity }
    }), [speed, windStrength, fireIntensity]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <points ref={meshRef} position={position} scale={scale}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={particlePositions.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    count={particleCount}
                    array={particlePositions.sizes}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-aLifetime"
                    count={particleCount}
                    array={particlePositions.lifetimes}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-aVelocity"
                    count={particleCount}
                    array={particlePositions.velocities}
                    itemSize={3}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

// Main Scene Component
function ShaderScene() {
    const [activeShader, setActiveShader] = useState<'wave' | 'sphere' | 'cube' | 'energy' | 'fire'>('wave');
    const [fireIntensity, setFireIntensity] = useState(1.2);
    const [windStrength, setWindStrength] = useState(0.3);

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff6b6b" />
            <pointLight position={[5, -5, 5]} intensity={0.5} color="#4ecdc4" />

            {/* Shader Objects */}
            {activeShader === 'wave' && <WaveAnimatedPlane position={[0, 0, 0]} speed={2} />}
            {activeShader === 'sphere' && <PulsingSphere position={[0, 0, 0]} speed={1.5} />}
            {activeShader === 'cube' && <MorphingCube position={[0, 0, 0]} speed={1} />}
            {activeShader === 'energy' && <EnergyField position={[0, 0, 0]} speed={2.5} />}
            {activeShader === 'fire' && <FireParticleSystem position={[0, -1, 0]} speed={1} fireIntensity={fireIntensity} windStrength={windStrength} />}

            {/* Ground plane */}
            <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
            </mesh>

            {/* Fire base (when fire is active) */}
            {activeShader === 'fire' && (
                <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[1.5, 16]} />
                    <meshStandardMaterial color="#2a1a0a" emissive="#4a2a1a" emissiveIntensity={0.3} />
                </mesh>
            )}

            {/* Interactive Controls */}
            <Html position={[0, -1, 0]}>
                <div className="bg-black/70 text-white p-4 rounded-lg max-w-md">
                    <h3 className="text-lg font-semibold mb-3">Custom Shaders</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                            onClick={() => setActiveShader('wave')}
                            className={`px-3 py-2 rounded text-sm ${activeShader === 'wave' ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        >
                            Wave Plane
                        </button>
                        <button
                            onClick={() => setActiveShader('sphere')}
                            className={`px-3 py-2 rounded text-sm ${activeShader === 'sphere' ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        >
                            Pulsing Sphere
                        </button>
                        <button
                            onClick={() => setActiveShader('cube')}
                            className={`px-3 py-2 rounded text-sm ${activeShader === 'cube' ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        >
                            Morphing Cube
                        </button>
                        <button
                            onClick={() => setActiveShader('energy')}
                            className={`px-3 py-2 rounded text-sm ${activeShader === 'energy' ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        >
                            Energy Field
                        </button>
                        <button
                            onClick={() => setActiveShader('fire')}
                            className={`px-3 py-2 rounded text-sm col-span-2 ${activeShader === 'fire' ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        >
                            🔥 Fire Particles
                        </button>
                    </div>

                    {/* Fire Controls */}
                    {activeShader === 'fire' && (
                        <div className="space-y-3 border-t border-gray-600 pt-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Fire Intensity</label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2.0"
                                    step="0.1"
                                    value={fireIntensity}
                                    onChange={(e) => setFireIntensity(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <span className="text-xs text-gray-400">{fireIntensity.toFixed(1)}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Wind Strength</label>
                                <input
                                    type="range"
                                    min="0.0"
                                    max="1.0"
                                    step="0.1"
                                    value={windStrength}
                                    onChange={(e) => setWindStrength(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <span className="text-xs text-gray-400">{windStrength.toFixed(1)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </Html>
        </>
    );
}

// Loading Component
function Loading() {
    return (
        <Html center>
            <div className="text-white text-xl bg-black/50 px-4 py-2 rounded-lg">
                Cargando shaders personalizados...
            </div>
        </Html>
    );
}

export default function ShaderScenePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Custom Shaders
                    </h1>
                    <p className="text-gray-300 text-xl">
                        Animaciones avanzadas con Vertex y Fragment Shaders
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            🌊 Wave Plane
                        </h2>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Animación en vertex shader</li>
                            <li>• Ondas sinusoidales</li>
                            <li>• Colores dinámicos</li>
                            <li>• Patrones animados</li>
                        </ul>
                    </div>

                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            🔮 Pulsing Sphere
                        </h2>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Efectos de fragment shader</li>
                            <li>• Iluminación rim</li>
                            <li>• Gradientes dinámicos</li>
                            <li>• Ruido animado</li>
                        </ul>
                    </div>

                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            📦 Morphing Cube
                        </h2>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Morfing geométrico</li>
                            <li>• Distorsión de vértices</li>
                            <li>• Rayas animadas</li>
                            <li>• Iluminación normal</li>
                        </ul>
                    </div>

                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            ⚡ Energy Field
                        </h2>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Campo de energía</li>
                            <li>• Función de ruido</li>
                            <li>• Efectos de brillo</li>
                            <li>• Transparencia</li>
                        </ul>
                    </div>

                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            🔥 Fire Particles
                        </h2>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Sistema de partículas</li>
                            <li>• Simulación de fuego</li>
                            <li>• Efectos de viento</li>
                            <li>• Controles interactivos</li>
                        </ul>
                    </div>
                </div>

                <div className="relative h-[700px] w-full bg-gray-900/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-600/30 shadow-2xl">
                    <Canvas
                        camera={{ position: [0, 2, 8], fov: 75 }}
                        style={{ width: '100%', height: '100%' }}
                        gl={{ antialias: true, alpha: true }}
                    >
                        <Suspense fallback={<Loading />}>
                            <Environment preset="night" />
                            <ShaderScene />
                            <OrbitControls
                                enableZoom={true}
                                enablePan={true}
                                enableRotate={true}
                                autoRotate={false}
                                minDistance={3}
                                maxDistance={15}
                                enableDamping={true}
                                dampingFactor={0.05}
                            />
                        </Suspense>
                    </Canvas>
                </div>

                <div className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
                    <h2 className="text-2xl font-semibold text-white mb-6">
                        🎨 Conceptos de Shaders
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
                            <h3 className="text-lg font-medium text-blue-400 mb-2">
                                Vertex Shader
                            </h3>
                            <p className="text-gray-300 text-sm mb-2">
                                Procesa cada vértice de la geometría. Se usa para:
                            </p>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• Transformar posiciones de vértices</li>
                                <li>• Crear animaciones geométricas</li>
                                <li>• Modificar la forma de objetos</li>
                                <li>• Calcular normales y coordenadas UV</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
                            <h3 className="text-lg font-medium text-purple-400 mb-2">
                                Fragment Shader
                            </h3>
                            <p className="text-gray-300 text-sm mb-2">
                                Procesa cada píxel de la superficie. Se usa para:
                            </p>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• Determinar el color de cada píxel</li>
                                <li>• Crear efectos visuales</li>
                                <li>• Aplicar texturas y materiales</li>
                                <li>• Simular iluminación y sombras</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
