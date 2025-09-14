import { useState, useCallback, useRef } from 'react';
import { AnimationType, AnimationState } from '../types/animations';
import { useAnimationManager } from './useAnimationManager';

// Interfaz para la gestión de animaciones
export interface AnimationManager {
    // Gestión básica
    addAnimation: (animation: AnimationType) => void;
    removeAnimation: (id: string) => void;
    pauseAnimation: (id: string) => void;
    resumeAnimation: (id: string) => void;
    clearAllAnimations: () => void;

    // Gestión avanzada
    updateAnimation: (id: string, updates: Partial<AnimationType>) => void;
    duplicateAnimation: (id: string, newId: string) => void;
    getAnimationState: (id: string) => AnimationState | undefined;
    getAllAnimations: () => AnimationState[];

    // Control de tiempo
    setGlobalSpeed: (speed: number) => void;
    pauseAllAnimations: () => void;
    resumeAllAnimations: () => void;

    // Presets y grupos
    loadAnimationPreset: (presetName: string) => void;
    saveAnimationPreset: (presetName: string, animations: AnimationType[]) => void;
    createAnimationGroup: (groupName: string, animationIds: string[]) => void;
    controlAnimationGroup: (groupName: string, action: 'play' | 'pause' | 'stop') => void;
}

// Hook personalizado para gestión avanzada de animaciones
export function useAdvancedAnimationManager(): AnimationManager {
    const {
        addAnimation: baseAddAnimation,
        removeAnimation: baseRemoveAnimation,
        pauseAnimation: basePauseAnimation,
        resumeAnimation: baseResumeAnimation,
        clearAllAnimations: baseClearAllAnimations,
        getAnimationState: baseGetAnimationState,
    } = useAnimationManager();

    const [globalSpeed, setGlobalSpeedState] = useState(1);
    const [animationGroups, setAnimationGroups] = useState<Record<string, string[]>>({});
    const [animationPresets, setAnimationPresets] = useState<Record<string, AnimationType[]>>({});
    const animationRefs = useRef<Map<string, AnimationType>>(new Map());

    // Actualizar animación existente
    const updateAnimation = useCallback((id: string, updates: Partial<AnimationType>) => {
        const currentAnimation = animationRefs.current.get(id);
        if (currentAnimation) {
            const updatedAnimation = { ...currentAnimation, ...updates } as AnimationType;
            animationRefs.current.set(id, updatedAnimation);

            // Recrear la animación con los nuevos parámetros
            baseRemoveAnimation(id);
            baseAddAnimation(updatedAnimation);
        }
    }, [baseAddAnimation, baseRemoveAnimation]);

    // Duplicar animación
    const duplicateAnimation = useCallback((id: string, newId: string) => {
        const originalAnimation = animationRefs.current.get(id);
        if (originalAnimation) {
            const duplicatedAnimation = { ...originalAnimation, id: newId };
            animationRefs.current.set(newId, duplicatedAnimation);
            baseAddAnimation(duplicatedAnimation);
        }
    }, [baseAddAnimation]);

    // Obtener todas las animaciones
    const getAllAnimations = useCallback(() => {
        const animations: AnimationState[] = [];
        animationRefs.current.forEach((animation, id) => {
            const state = baseGetAnimationState(id);
            if (state) {
                animations.push(state);
            }
        });
        return animations;
    }, [baseGetAnimationState]);

    // Control de velocidad global
    const setGlobalSpeed = useCallback((speed: number) => {
        setGlobalSpeedState(speed);
        // Aquí podrías implementar lógica para afectar todas las animaciones
        // Por ejemplo, modificando la duración o velocidad de cada animación
    }, []);

    // Pausar todas las animaciones
    const pauseAllAnimations = useCallback(() => {
        animationRefs.current.forEach((_, id) => {
            basePauseAnimation(id);
        });
    }, [basePauseAnimation]);

    // Reanudar todas las animaciones
    const resumeAllAnimations = useCallback(() => {
        animationRefs.current.forEach((_, id) => {
            baseResumeAnimation(id);
        });
    }, [baseResumeAnimation]);

    // Cargar preset de animaciones
    const loadAnimationPreset = useCallback((presetName: string) => {
        const preset = animationPresets[presetName];
        if (preset) {
            baseClearAllAnimations();
            animationRefs.current.clear();

            preset.forEach(animation => {
                animationRefs.current.set(animation.id, animation);
                baseAddAnimation(animation);
            });
        }
    }, [animationPresets, baseClearAllAnimations, baseAddAnimation]);

    // Guardar preset de animaciones
    const saveAnimationPreset = useCallback((presetName: string, animations: AnimationType[]) => {
        setAnimationPresets(prev => ({
            ...prev,
            [presetName]: animations
        }));
    }, []);

    // Crear grupo de animaciones
    const createAnimationGroup = useCallback((groupName: string, animationIds: string[]) => {
        setAnimationGroups(prev => ({
            ...prev,
            [groupName]: animationIds
        }));
    }, []);

    // Controlar grupo de animaciones
    const controlAnimationGroup = useCallback((groupName: string, action: 'play' | 'pause' | 'stop') => {
        const group = animationGroups[groupName];
        if (group) {
            group.forEach(id => {
                switch (action) {
                    case 'play':
                        baseResumeAnimation(id);
                        break;
                    case 'pause':
                        basePauseAnimation(id);
                        break;
                    case 'stop':
                        baseRemoveAnimation(id);
                        animationRefs.current.delete(id);
                        break;
                }
            });
        }
    }, [animationGroups, baseResumeAnimation, basePauseAnimation, baseRemoveAnimation]);

    // Wrapper para addAnimation que mantiene referencias
    const addAnimation = useCallback((animation: AnimationType) => {
        animationRefs.current.set(animation.id, animation);
        baseAddAnimation(animation);
    }, [baseAddAnimation]);

    // Wrapper para removeAnimation que limpia referencias
    const removeAnimation = useCallback((id: string) => {
        animationRefs.current.delete(id);
        baseRemoveAnimation(id);
    }, [baseRemoveAnimation]);

    return {
        addAnimation,
        removeAnimation,
        pauseAnimation: basePauseAnimation,
        resumeAnimation: baseResumeAnimation,
        clearAllAnimations: () => {
            animationRefs.current.clear();
            baseClearAllAnimations();
        },
        updateAnimation,
        duplicateAnimation,
        getAnimationState: baseGetAnimationState,
        getAllAnimations,
        setGlobalSpeed,
        pauseAllAnimations,
        resumeAllAnimations,
        loadAnimationPreset,
        saveAnimationPreset,
        createAnimationGroup,
        controlAnimationGroup,
    };
}
