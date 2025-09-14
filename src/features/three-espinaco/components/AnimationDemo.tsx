'use client';

import React from 'react';
import { useAnimationManager } from '../hooks/useAnimationManager';

// Componente de ejemplo para demostrar el uso del sistema de animaciones
export function AnimationDemo() {
    const animationManager = useAnimationManager();

    // Ejemplo 1: Añadir animación de rotación rápida
    const addFastRotation = () => {
        animationManager.addAnimation({
            id: `fast-rotation-${Date.now()}`,
            name: 'Rotación Rápida',
            type: 'rotation',
            axis: 'y',
            speed: 2,
            duration: 5000,
            loop: true,
        });
    };

    // Ejemplo 2: Añadir animación de pulso
    const addPulseEffect = () => {
        animationManager.addAnimation({
            id: `pulse-effect-${Date.now()}`,
            name: 'Efecto de Pulso',
            type: 'pulse',
            minScale: 0.3,
            maxScale: 1.7,
            frequency: 3,
            duration: 2000,
            loop: true,
        });
    };

    // Ejemplo 3: Añadir animación de órbita
    const addOrbitAnimation = () => {
        animationManager.addAnimation({
            id: `orbit-animation-${Date.now()}`,
            name: 'Órbita Circular',
            type: 'orbit',
            radius: 4,
            speed: 0.8,
            axis: 'y',
            center: [0, 0, 0],
            duration: 6000,
            loop: true,
        });
    };

    // Ejemplo 4: Añadir animación de flotación
    const addFloatAnimation = () => {
        animationManager.addAnimation({
            id: `float-animation-${Date.now()}`,
            name: 'Flotación Suave',
            type: 'float',
            axis: 'y',
            amplitude: 1,
            frequency: 0.5,
            duration: 4000,
            loop: true,
        });
    };

    // Ejemplo 5: Crear múltiples animaciones
    const createMultipleAnimations = () => {
        // Rotación
        animationManager.addAnimation({
            id: `multi-rotation-${Date.now()}`,
            name: 'Rotación Múltiple',
            type: 'rotation',
            axis: 'x',
            speed: 0.5,
            duration: 8000,
            loop: true,
        });

        // Pulso
        animationManager.addAnimation({
            id: `multi-pulse-${Date.now()}`,
            name: 'Pulso Múltiple',
            type: 'pulse',
            minScale: 0.8,
            maxScale: 1.2,
            frequency: 2,
            duration: 3000,
            loop: true,
        });

        // Flotación
        animationManager.addAnimation({
            id: `multi-float-${Date.now()}`,
            name: 'Flotación Múltiple',
            type: 'float',
            axis: 'z',
            amplitude: 0.5,
            frequency: 1,
            duration: 5000,
            loop: true,
        });
    };

    // Ejemplo 6: Guardar preset personalizado
    const saveCustomPreset = () => {
        const presetAnimations = [
            {
                id: 'preset-rotation',
                name: 'Rotación Preset',
                type: 'rotation' as const,
                axis: 'xyz' as const,
                speed: 1,
                duration: 10000,
                loop: true,
            },
            {
                id: 'preset-pulse',
                name: 'Pulso Preset',
                type: 'pulse' as const,
                minScale: 0.5,
                maxScale: 1.5,
                frequency: 2.5,
                duration: 2500,
                loop: true,
            },
        ];

        localStorage.setItem('animation-preset-mi-preset-personalizado', JSON.stringify(presetAnimations));
        alert('Preset guardado: "mi-preset-personalizado"');
    };

    // Ejemplo 7: Cargar preset
    const loadPreset = () => {
        const saved = localStorage.getItem('animation-preset-mi-preset-personalizado');
        if (saved) {
            try {
                const animations = JSON.parse(saved);
                animationManager.clearAllAnimations();
                animations.forEach((animation: any) => {
                    animationManager.addAnimation(animation);
                });
                alert('Preset cargado: "mi-preset-personalizado"');
            } catch (error) {
                alert('Error al cargar el preset');
            }
        } else {
            alert('Preset no encontrado');
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-sm">
            <h3 className="text-lg font-semibold mb-4">🎬 Demo de Animaciones</h3>

            <div className="space-y-2">
                <button
                    onClick={addFastRotation}
                    className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors"
                >
                    🔄 Rotación Rápida
                </button>

                <button
                    onClick={addPulseEffect}
                    className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm transition-colors"
                >
                    💓 Efecto de Pulso
                </button>

                <button
                    onClick={addOrbitAnimation}
                    className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm transition-colors"
                >
                    🌍 Órbita Circular
                </button>

                <button
                    onClick={addFloatAnimation}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-sm transition-colors"
                >
                    🎈 Flotación Suave
                </button>

                <button
                    onClick={createMultipleAnimations}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded text-sm transition-colors"
                >
                    👥 Crear Múltiples
                </button>

                <button
                    onClick={saveCustomPreset}
                    className="w-full bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded text-sm transition-colors"
                >
                    💾 Guardar Preset
                </button>

                <button
                    onClick={loadPreset}
                    className="w-full bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded text-sm transition-colors"
                >
                    📂 Cargar Preset
                </button>

                <div className="pt-2 border-t border-gray-700">
                    <button
                        onClick={() => {
                            const allAnimations = animationManager.getAllAnimations();
                            allAnimations.forEach(anim => animationManager.pauseAnimation(anim.id));
                        }}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs transition-colors"
                    >
                        ⏸️ Pausar Todo
                    </button>

                    <button
                        onClick={() => {
                            const allAnimations = animationManager.getAllAnimations();
                            allAnimations.forEach(anim => animationManager.resumeAnimation(anim.id));
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors mt-1"
                    >
                        ▶️ Reanudar Todo
                    </button>

                    <button
                        onClick={() => animationManager.clearAllAnimations()}
                        className="w-full bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors mt-1"
                    >
                        🗑️ Limpiar Todo
                    </button>
                </div>
            </div>

            <div className="mt-4 text-xs text-gray-400">
                <p>💡 Usa el panel de control superior derecho para gestionar las animaciones en detalle.</p>
            </div>
        </div>
    );
}