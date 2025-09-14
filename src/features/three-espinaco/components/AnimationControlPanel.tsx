'use client';

import React, { useState } from 'react';
import { AnimationType } from '../types/animations';
import { useAnimationManager } from '../hooks/useAnimationManager';

interface AnimationControlPanelProps {
    className?: string;
    isVisible?: boolean;
    onToggle?: () => void;
}

export function AnimationControlPanel({
    className = '',
    isVisible = false,
    onToggle
}: AnimationControlPanelProps) {
    const [newAnimationName, setNewAnimationName] = useState('');
    const [presetName, setPresetName] = useState('');

    const animationManager = useAnimationManager();
    const allAnimations = animationManager.getAllAnimations();

    // Crear nueva animación
    const createNewAnimation = () => {
        if (!newAnimationName) return;

        const newAnimation: AnimationType = {
            id: `custom-${Date.now()}`,
            name: newAnimationName,
            type: 'rotation',
            axis: 'y',
            speed: 0.5,
            duration: 3000,
            loop: true,
        };

        animationManager.addAnimation(newAnimation);
        setNewAnimationName('');
    };

    // Guardar preset en localStorage
    const savePreset = () => {
        if (presetName && allAnimations.length > 0) {
            const animations = allAnimations.map(anim => anim.config);
            localStorage.setItem(`animation-preset-${presetName}`, JSON.stringify(animations));
            setPresetName('');
            alert(`Preset "${presetName}" guardado`);
        }
    };

    // Cargar preset desde localStorage
    const loadPreset = () => {
        if (presetName) {
            const saved = localStorage.getItem(`animation-preset-${presetName}`);
            if (saved) {
                try {
                    const animations: AnimationType[] = JSON.parse(saved);
                    animationManager.clearAllAnimations();
                    animations.forEach(animation => {
                        animationManager.addAnimation(animation);
                    });
                    alert(`Preset "${presetName}" cargado`);
                } catch (error) {
                    alert('Error al cargar el preset');
                }
            } else {
                alert('Preset no encontrado');
            }
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={onToggle}
                className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
                🎬 Control Animaciones
            </button>
        );
    }

    return (
        <div className={`fixed top-4 right-4 z-50 bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-md ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">🎬 Control de Animaciones</h3>
                <button
                    onClick={onToggle}
                    className="text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>

            {/* Controles globales */}
            <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Controles Globales</h4>
                <div className="flex gap-2 mb-2">
                    <button
                        onClick={() => {
                            allAnimations.forEach(anim => animationManager.pauseAnimation(anim.id));
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                    >
                        ⏸️ Pausar Todo
                    </button>
                    <button
                        onClick={() => {
                            allAnimations.forEach(anim => animationManager.resumeAnimation(anim.id));
                        }}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                        ▶️ Reanudar Todo
                    </button>
                    <button
                        onClick={() => animationManager.clearAllAnimations()}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                        🗑️ Limpiar Todo
                    </button>
                </div>
            </div>

            {/* Lista de animaciones */}
            <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Animaciones Activas ({allAnimations.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                    {allAnimations.map((anim) => (
                        <div
                            key={anim.id}
                            className="p-2 rounded text-xs bg-gray-700 hover:bg-gray-600"
                        >
                            <div className="flex justify-between items-center">
                                <span>{anim.config.name}</span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => animationManager.pauseAnimation(anim.id)}
                                        className="text-yellow-400 hover:text-yellow-300"
                                    >
                                        ⏸️
                                    </button>
                                    <button
                                        onClick={() => animationManager.removeAnimation(anim.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="text-gray-400">
                                {anim.config.type} • {anim.isActive ? 'Activa' : 'Pausada'} • {Math.round(anim.progress * 100)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Crear nueva animación */}
            <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Crear Nueva Animación</h4>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Nombre de animación"
                        value={newAnimationName}
                        onChange={(e) => setNewAnimationName(e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-700 rounded text-sm"
                    />
                    <button
                        onClick={createNewAnimation}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                        ➕ Crear
                    </button>
                </div>
            </div>

            {/* Presets */}
            <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Presets</h4>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Nombre del preset"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-700 rounded text-sm"
                    />
                    <button
                        onClick={savePreset}
                        className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                    >
                        💾 Guardar
                    </button>
                    <button
                        onClick={loadPreset}
                        className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm"
                    >
                        📂 Cargar
                    </button>
                </div>
            </div>

            <div className="text-xs text-gray-400">
                <p>💡 Las animaciones se ejecutan automáticamente según la ruta actual.</p>
            </div>
        </div>
    );
}

// Hook para usar el panel de control
export function useAnimationControlPanel() {
    const [isVisible, setIsVisible] = useState(false);

    const togglePanel = () => setIsVisible(!isVisible);

    return {
        isVisible,
        togglePanel,
        AnimationControlPanel: (props: Omit<AnimationControlPanelProps, 'isVisible' | 'onToggle'>) => (
            <AnimationControlPanel
                {...props}
                isVisible={isVisible}
                onToggle={togglePanel}
            />
        ),
    };
}