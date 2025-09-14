// Componentes principales
export { BackgroundCanvas, BackgroundCanvasWrapper } from './BackgroundCanvas';
export { AnimationControlPanel, useAnimationControlPanel } from './AnimationControlPanel';
export { AnimationDemo } from './AnimationDemo';

// Componentes primitivos animados
export {
    AnimatedBox,
    AnimatedSphere,
    AnimatedTorus,
    AnimatedOctahedron,
    AnimatedCone,
    FloatingObjects,
    SceneLighting,
} from './primitives/AnimatedPrimitives';

// Hooks
export { useAnimationManager, AnimationProvider } from '../hooks/useAnimationManager';
export { useAdvancedAnimationManager } from '../hooks/useAdvancedAnimationManager';

// Configuración
export { useRouteSceneConfig, routeSceneConfigs } from '../config/routeScenes';

// Tipos
export type {
    AnimationType,
    AnimationState,
    AnimationConfig,
    RotationAnimation,
    PositionAnimation,
    ScaleAnimation,
    ColorAnimation,
    FloatAnimation,
    PulseAnimation,
    OrbitAnimation,
    RouteSceneConfig,
    ObjectRefs,
    AnimationCompleteCallback,
    AnimationUpdateCallback,
} from '../types/animations';
