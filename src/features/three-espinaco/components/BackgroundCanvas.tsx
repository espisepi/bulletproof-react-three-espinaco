'use client';

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { usePathname } from 'next/navigation';
import { AnimationProvider } from '../hooks/useAnimationManager';
import { useRouteSceneConfig } from '../config/routeScenes';
import { FloatingObjects, SceneLighting } from '../components/primitives/AnimatedPrimitives';
import { useAnimationControlPanel } from './AnimationControlPanel';
import { AnimationDemo } from './AnimationDemo';
import { AnimationController } from './AnimationController';
import { AnimationFrameHandler } from './AnimationFrameHandler';

interface BackgroundCanvasProps {
    className?: string;
    style?: React.CSSProperties;
}

export function BackgroundCanvas({ className = '', style }: BackgroundCanvasProps) {
    const pathname = usePathname();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { AnimationControlPanel } = useAnimationControlPanel();

    // Obtener configuración de escena para la ruta actual
    const sceneConfig = useRouteSceneConfig(pathname);

    // Configurar posición de cámara basada en la configuración de la ruta
    const cameraConfig = {
        position: sceneConfig.cameraPosition || [0, 2, 5],
        fov: 75,
    };

    return (
        <div
            className={`fixed inset-0 -z-10 ${className}`}
            style={{
                backgroundColor: sceneConfig.backgroundColor || '#0f172a',
                ...style,
            }}
        >
            <Canvas
                ref={canvasRef}
                camera={cameraConfig}
                style={{ width: '100%', height: '100%' }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance'
                }}
                dpr={[1, 2]} // Soporte para pantallas de alta densidad
            >
                {/* Controlador de animaciones */}
                <AnimationController />

                {/* Frame handler para animaciones */}
                <AnimationFrameHandler />

                {/* Iluminación de la escena */}
                <SceneLighting />

                {/* Ambiente */}
                <Environment preset="warehouse" />

                {/* Objetos flotantes animados */}
                <FloatingObjects />

                {/* Controles de órbita (opcional, para desarrollo) */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    autoRotate={false}
                    target={sceneConfig.cameraTarget || [0, 0, 0]}
                />
            </Canvas>

            {/* Overlay sutil para mejorar la legibilidad del contenido */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)`
                }}
            />

            {/* Panel de control de animaciones */}
            <AnimationControlPanel />

            {/* Demo de animaciones */}
            <AnimationDemo />
        </div>
    );
}

// Componente wrapper para el contenido principal
interface BackgroundCanvasWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export function BackgroundCanvasWrapper({ children, className = '' }: BackgroundCanvasWrapperProps) {
    return (
        <AnimationProvider>
            <div className={`relative min-h-screen ${className}`}>
                <BackgroundCanvas />
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </AnimationProvider>
    );
}