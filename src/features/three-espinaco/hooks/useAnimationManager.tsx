import React, { createContext, useContext, useRef, useEffect, useCallback, useState } from 'react';
import {
  AnimationType,
  AnimationState,
  ObjectRefs,
  AnimationCompleteCallback,
  AnimationUpdateCallback
} from '../types/animations';

// Contexto para el gestor de animaciones
interface AnimationContextType {
  registerObject: (id: string, ref: React.RefObject<any>) => void;
  unregisterObject: (id: string) => void;
  addAnimation: (animation: AnimationType) => void;
  removeAnimation: (animationId: string) => void;
  pauseAnimation: (animationId: string) => void;
  resumeAnimation: (animationId: string) => void;
  clearAllAnimations: () => void;
  getAnimationState: (animationId: string) => AnimationState | undefined;
  getAllAnimations: () => AnimationState[];
  setCallbacks: (callbacks: {
    onComplete?: AnimationCompleteCallback;
    onUpdate?: AnimationUpdateCallback;
  }) => void;
  updateAnimations: () => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

// Hook para usar el contexto de animaciones
export function useAnimationManager() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationManager must be used within an AnimationProvider');
  }
  return context;
}

// Provider del contexto de animaciones
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const activeAnimations = useRef<Map<string, AnimationState>>(new Map());
  const objectRefs = useRef<ObjectRefs>({});
  const animationCallbacks = useRef<{
    onComplete?: AnimationCompleteCallback;
    onUpdate?: AnimationUpdateCallback;
  }>({});
  const [animationsList, setAnimationsList] = useState<AnimationState[]>([]);

  // Función de easing
  const ease = (t: number, easing: string = 'linear'): number => {
    switch (easing) {
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return 1 - (1 - t) * (1 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      default:
        return t;
    }
  };

  // Registrar referencias de objetos
  const registerObject = useCallback((id: string, ref: React.RefObject<any>) => {
    objectRefs.current[id] = ref;
  }, []);

  // Desregistrar objetos
  const unregisterObject = useCallback((id: string) => {
    delete objectRefs.current[id];
  }, []);

  // Añadir animación
  const addAnimation = useCallback((animation: AnimationType) => {
    const animationState: AnimationState = {
      id: animation.id,
      isActive: true,
      progress: 0,
      startTime: Date.now() + (animation.delay || 0),
      config: animation,
    };

    activeAnimations.current.set(animation.id, animationState);
    updateAnimationsList();
  }, []);

  // Eliminar animación
  const removeAnimation = useCallback((animationId: string) => {
    activeAnimations.current.delete(animationId);
    updateAnimationsList();
  }, []);

  // Pausar animación
  const pauseAnimation = useCallback((animationId: string) => {
    const animation = activeAnimations.current.get(animationId);
    if (animation) {
      animation.isActive = false;
      updateAnimationsList();
    }
  }, []);

  // Reanudar animación
  const resumeAnimation = useCallback((animationId: string) => {
    const animation = activeAnimations.current.get(animationId);
    if (animation) {
      animation.isActive = true;
      updateAnimationsList();
    }
  }, []);

  // Limpiar todas las animaciones
  const clearAllAnimations = useCallback(() => {
    activeAnimations.current.clear();
    updateAnimationsList();
  }, []);

  // Obtener estado de una animación
  const getAnimationState = useCallback((animationId: string) => {
    return activeAnimations.current.get(animationId);
  }, []);

  // Obtener todas las animaciones
  const getAllAnimations = useCallback(() => {
    return Array.from(activeAnimations.current.values());
  }, []);

  // Actualizar lista de animaciones para el estado
  const updateAnimationsList = useCallback(() => {
    setAnimationsList(Array.from(activeAnimations.current.values()));
  }, []);

  // Configurar callbacks
  const setCallbacks = useCallback((callbacks: {
    onComplete?: AnimationCompleteCallback;
    onUpdate?: AnimationUpdateCallback;
  }) => {
    animationCallbacks.current = callbacks;
  }, []);

  // Aplicar animación a un objeto
  const applyAnimation = useCallback((
    object: any,
    animation: AnimationType,
    progress: number
  ) => {
    if (!object) return;

    const easedProgress = ease(progress, animation.easing);

    switch (animation.type) {
      case 'rotation':
        const rotAnim = animation as any;
        if (rotAnim.speed) {
          // Rotación continua
          const rotationSpeed = rotAnim.speed * 0.01;
          if (rotAnim.axis === 'x' || rotAnim.axis === 'xyz') {
            object.rotation.x += rotationSpeed;
          }
          if (rotAnim.axis === 'y' || rotAnim.axis === 'xyz') {
            object.rotation.y += rotationSpeed;
          }
          if (rotAnim.axis === 'z' || rotAnim.axis === 'xyz') {
            object.rotation.z += rotationSpeed;
          }
        } else {
          // Rotación de punto A a punto B
          const from = rotAnim.from || 0;
          const to = rotAnim.to || Math.PI * 2;
          const value = from + (to - from) * easedProgress;

          if (rotAnim.axis === 'x') object.rotation.x = value;
          if (rotAnim.axis === 'y') object.rotation.y = value;
          if (rotAnim.axis === 'z') object.rotation.z = value;
        }
        break;

      case 'position':
        const posAnim = animation as any;
        const posValue = posAnim.from + (posAnim.to - posAnim.from) * easedProgress;
        if (posAnim.axis === 'x') object.position.x = posValue;
        if (posAnim.axis === 'y') object.position.y = posValue;
        if (posAnim.axis === 'z') object.position.z = posValue;
        break;

      case 'scale':
        const scaleAnim = animation as any;
        const scaleValue = scaleAnim.from + (scaleAnim.to - scaleAnim.from) * easedProgress;
        if (scaleAnim.axis === 'uniform') {
          object.scale.setScalar(scaleValue);
        } else {
          if (scaleAnim.axis === 'x') object.scale.x = scaleValue;
          if (scaleAnim.axis === 'y') object.scale.y = scaleValue;
          if (scaleAnim.axis === 'z') object.scale.z = scaleValue;
        }
        break;

      case 'float':
        const floatAnim = animation as any;
        const floatValue = Math.sin(Date.now() * 0.001 * floatAnim.frequency) * floatAnim.amplitude;
        if (floatAnim.axis === 'x') object.position.x += floatValue * 0.01;
        if (floatAnim.axis === 'y') object.position.y += floatValue * 0.01;
        if (floatAnim.axis === 'z') object.position.z += floatValue * 0.01;
        break;

      case 'pulse':
        const pulseAnim = animation as any;
        const pulseValue = pulseAnim.minScale +
          (pulseAnim.maxScale - pulseAnim.minScale) *
          (Math.sin(Date.now() * 0.001 * pulseAnim.frequency) * 0.5 + 0.5);
        object.scale.setScalar(pulseValue);
        break;

      case 'orbit':
        const orbitAnim = animation as any;
        const time = Date.now() * 0.001 * orbitAnim.speed;
        const center = orbitAnim.center || [0, 0, 0];

        if (orbitAnim.axis === 'y') {
          object.position.x = center[0] + Math.cos(time) * orbitAnim.radius;
          object.position.z = center[2] + Math.sin(time) * orbitAnim.radius;
        } else if (orbitAnim.axis === 'x') {
          object.position.y = center[1] + Math.cos(time) * orbitAnim.radius;
          object.position.z = center[2] + Math.sin(time) * orbitAnim.radius;
        } else if (orbitAnim.axis === 'z') {
          object.position.x = center[0] + Math.cos(time) * orbitAnim.radius;
          object.position.y = center[1] + Math.sin(time) * orbitAnim.radius;
        }
        break;
    }
  }, []);

  // Función para actualizar animaciones (llamada desde useFrame)
  const updateAnimations = useCallback(() => {
    const currentTime = Date.now();

    activeAnimations.current.forEach((animationState, animationId) => {
      if (!animationState.isActive) return;

      const elapsed = currentTime - animationState.startTime;
      const progress = Math.min(elapsed / animationState.config.duration, 1);

      // Aplicar animación a todos los objetos registrados
      Object.values(objectRefs.current).forEach(ref => {
        if (ref.current) {
          applyAnimation(ref.current, animationState.config, progress);
        }
      });

      // Callback de actualización
      if (animationCallbacks.current.onUpdate) {
        animationCallbacks.current.onUpdate(animationId, progress);
      }

      // Verificar si la animación ha terminado
      if (progress >= 1) {
        if (animationState.config.loop) {
          // Reiniciar animación
          animationState.startTime = currentTime;
          animationState.progress = 0;
        } else if (animationState.config.repeat && animationState.config.repeat > 0) {
          // Repetir animación
          animationState.config.repeat--;
          animationState.startTime = currentTime;
          animationState.progress = 0;
        } else {
          // Completar animación
          animationState.isActive = false;
          if (animationCallbacks.current.onComplete) {
            animationCallbacks.current.onComplete(animationId);
          }
        }
      }

      animationState.progress = progress;
    });

    // Actualizar lista de animaciones periódicamente
    updateAnimationsList();
  }, [applyAnimation, updateAnimationsList]);

  const contextValue: AnimationContextType = {
    registerObject,
    unregisterObject,
    addAnimation,
    removeAnimation,
    pauseAnimation,
    resumeAnimation,
    clearAllAnimations,
    getAnimationState,
    getAllAnimations,
    setCallbacks,
    updateAnimations,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
}