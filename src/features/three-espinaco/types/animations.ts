import { RefObject } from 'react';
import { Group, Mesh, Object3D } from 'three';

// Tipos base para animaciones
export interface AnimationConfig {
    id: string;
    name: string;
    duration: number;
    easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
    delay?: number;
    loop?: boolean;
    repeat?: number;
}

// Tipos específicos para diferentes tipos de animaciones
export interface RotationAnimation extends AnimationConfig {
    type: 'rotation';
    axis: 'x' | 'y' | 'z' | 'xyz';
    speed?: number;
    from?: number;
    to?: number;
}

export interface PositionAnimation extends AnimationConfig {
    type: 'position';
    axis: 'x' | 'y' | 'z';
    from: number;
    to: number;
}

export interface ScaleAnimation extends AnimationConfig {
    type: 'scale';
    axis: 'x' | 'y' | 'z' | 'uniform';
    from: number;
    to: number;
}

export interface ColorAnimation extends AnimationConfig {
    type: 'color';
    from: string;
    to: string;
}

export interface FloatAnimation extends AnimationConfig {
    type: 'float';
    amplitude: number;
    frequency: number;
    axis: 'x' | 'y' | 'z';
}

export interface PulseAnimation extends AnimationConfig {
    type: 'pulse';
    minScale: number;
    maxScale: number;
    frequency: number;
}

export interface OrbitAnimation extends AnimationConfig {
    type: 'orbit';
    radius: number;
    speed: number;
    axis: 'x' | 'y' | 'z';
    center?: [number, number, number];
}

// Unión de todos los tipos de animación
export type AnimationType =
    | RotationAnimation
    | PositionAnimation
    | ScaleAnimation
    | ColorAnimation
    | FloatAnimation
    | PulseAnimation
    | OrbitAnimation;

// Estado de una animación
export interface AnimationState {
    id: string;
    isActive: boolean;
    progress: number;
    startTime: number;
    config: AnimationType;
}

// Configuración de escena para diferentes rutas
export interface RouteSceneConfig {
    route: string;
    animations: AnimationType[];
    cameraPosition?: [number, number, number];
    cameraTarget?: [number, number, number];
    lighting?: {
        ambientIntensity?: number;
        directionalIntensity?: number;
        pointLightPositions?: [number, number, number][];
    };
    backgroundColor?: string;
}

// Referencias de objetos 3D
export interface ObjectRefs {
    [key: string]: RefObject<Group | Mesh | Object3D>;
}

// Callback para cuando una animación termina
export type AnimationCompleteCallback = (animationId: string) => void;

// Callback para cuando una animación se actualiza
export type AnimationUpdateCallback = (animationId: string, progress: number) => void;
