import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimationManager } from '../hooks/useAnimationManager';

// Componente interno que maneja el loop de animaciones dentro del Canvas
export function AnimationFrameHandler() {
    const { updateAnimations } = useAnimationManager();

    useFrame(() => {
        // Llamar a la función de actualización de animaciones
        updateAnimations();
    });

    return null;
}
