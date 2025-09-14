import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Octahedron, Cone } from '@react-three/drei';
import { Mesh } from 'three';
import { useAnimationManager } from '../../hooks/useAnimationManager';

// Componente de cubo animado
export function AnimatedBox({
    position = [0, 0, 0],
    color = '#ff6b6b',
    size = 1,
    animationId = 'box-animation'
}: {
    position?: [number, number, number];
    color?: string;
    size?: number;
    animationId?: string;
}) {
    const meshRef = useRef<Mesh>(null);
    const { registerObject, unregisterObject } = useAnimationManager();

    // Registrar el objeto para animaciones
    React.useEffect(() => {
        registerObject(animationId, meshRef);
        return () => unregisterObject(animationId);
    }, [animationId, registerObject, unregisterObject]);

    return (
        <Box ref={meshRef} args={[size, size, size]} position={position}>
            <meshStandardMaterial color={color} />
        </Box>
    );
}

// Componente de esfera animada
export function AnimatedSphere({
    position = [0, 0, 0],
    color = '#4ecdc4',
    radius = 0.8,
    animationId = 'sphere-animation'
}: {
    position?: [number, number, number];
    color?: string;
    radius?: number;
    animationId?: string;
}) {
    const meshRef = useRef<Mesh>(null);
    const { registerObject, unregisterObject } = useAnimationManager();

    React.useEffect(() => {
        registerObject(animationId, meshRef);
        return () => unregisterObject(animationId);
    }, [animationId, registerObject, unregisterObject]);

    return (
        <Sphere ref={meshRef} args={[radius, 32, 32]} position={position}>
            <meshStandardMaterial color={color} />
        </Sphere>
    );
}

// Componente de toro animado
export function AnimatedTorus({
    position = [0, 0, 0],
    color = '#45b7d1',
    radius = 1,
    tube = 0.4,
    animationId = 'torus-animation'
}: {
    position?: [number, number, number];
    color?: string;
    radius?: number;
    tube?: number;
    animationId?: string;
}) {
    const meshRef = useRef<Mesh>(null);
    const { registerObject, unregisterObject } = useAnimationManager();

    React.useEffect(() => {
        registerObject(animationId, meshRef);
        return () => unregisterObject(animationId);
    }, [animationId, registerObject, unregisterObject]);

    return (
        <Torus ref={meshRef} args={[radius, tube, 16, 32]} position={position}>
            <meshStandardMaterial color={color} />
        </Torus>
    );
}

// Componente de octaedro animado
export function AnimatedOctahedron({
    position = [0, 0, 0],
    color = '#f39c12',
    radius = 1,
    animationId = 'octahedron-animation'
}: {
    position?: [number, number, number];
    color?: string;
    radius?: number;
    animationId?: string;
}) {
    const meshRef = useRef<Mesh>(null);
    const { registerObject, unregisterObject } = useAnimationManager();

    React.useEffect(() => {
        registerObject(animationId, meshRef);
        return () => unregisterObject(animationId);
    }, [animationId, registerObject, unregisterObject]);

    return (
        <Octahedron ref={meshRef} args={[radius]} position={position}>
            <meshStandardMaterial color={color} />
        </Octahedron>
    );
}

// Componente de cono animado
export function AnimatedCone({
    position = [0, 0, 0],
    color = '#e74c3c',
    radius = 1,
    height = 2,
    animationId = 'cone-animation'
}: {
    position?: [number, number, number];
    color?: string;
    radius?: number;
    height?: number;
    animationId?: string;
}) {
    const meshRef = useRef<Mesh>(null);
    const { registerObject, unregisterObject } = useAnimationManager();

    React.useEffect(() => {
        registerObject(animationId, meshRef);
        return () => unregisterObject(animationId);
    }, [animationId, registerObject, unregisterObject]);

    return (
        <Cone ref={meshRef} args={[radius, height, 8]} position={position}>
            <meshStandardMaterial color={color} />
        </Cone>
    );
}

// Componente de grupo de objetos flotantes
export function FloatingObjects() {
    return (
        <group>
            <AnimatedBox
                position={[-3, 1, -2]}
                color="#ff6b6b"
                size={0.8}
                animationId="floating-box-1"
            />
            <AnimatedSphere
                position={[3, -1, -1]}
                color="#4ecdc4"
                radius={0.6}
                animationId="floating-sphere-1"
            />
            <AnimatedTorus
                position={[-2, -2, 1]}
                color="#45b7d1"
                radius={0.8}
                tube={0.3}
                animationId="floating-torus-1"
            />
            <AnimatedOctahedron
                position={[2, 2, -1]}
                color="#f39c12"
                radius={0.7}
                animationId="floating-octahedron-1"
            />
            <AnimatedCone
                position={[0, -1, 2]}
                color="#e74c3c"
                radius={0.5}
                height={1.5}
                animationId="floating-cone-1"
            />
        </group>
    );
}

// Componente de iluminación de escena
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
