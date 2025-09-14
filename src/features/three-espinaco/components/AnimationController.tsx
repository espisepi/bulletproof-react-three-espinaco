import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnimationManager } from '../hooks/useAnimationManager';
import { useRouteSceneConfig } from '../config/routeScenes';

// Componente que maneja las animaciones dentro del Canvas
export function AnimationController() {
    const pathname = usePathname();
    const {
        addAnimation,
        clearAllAnimations,
        setCallbacks,
    } = useAnimationManager();

    // Obtener configuración de escena para la ruta actual
    const sceneConfig = useRouteSceneConfig(pathname);

    // Efecto para manejar cambios de ruta
    useEffect(() => {
        // Limpiar animaciones anteriores
        clearAllAnimations();

        // Añadir nuevas animaciones basadas en la configuración de la ruta
        sceneConfig.animations.forEach(animation => {
            addAnimation(animation);
        });

        // Configurar callbacks
        setCallbacks({
            onComplete: (animationId) => {
                console.log(`Animación completada: ${animationId}`);
            },
            onUpdate: (animationId, progress) => {
                // Aquí puedes añadir lógica adicional si necesitas
                // responder a cambios en el progreso de las animaciones
            },
        });

        // Cleanup al desmontar
        return () => {
            clearAllAnimations();
        };
    }, [pathname, sceneConfig, addAnimation, clearAllAnimations, setCallbacks]);

    // Este componente no renderiza nada, solo maneja la lógica de animaciones
    return null;
}
