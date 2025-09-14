import { useMemo } from 'react';
import { RouteSceneConfig } from '../types/animations';

// Configuraciones de escena para diferentes rutas
export const routeSceneConfigs: Record<string, RouteSceneConfig> = {
    '/': {
        route: '/',
        animations: [
            {
                id: 'home-rotation',
                name: 'Rotación Principal',
                type: 'rotation',
                axis: 'y',
                speed: 0.5,
                duration: 10000,
                loop: true,
            },
            {
                id: 'home-float',
                name: 'Flotación Suave',
                type: 'float',
                axis: 'y',
                amplitude: 0.5,
                frequency: 1,
                duration: 3000,
                loop: true,
            },
        ],
        cameraPosition: [0, 2, 5],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#0f172a',
    },

    '/app': {
        route: '/app',
        animations: [
            {
                id: 'app-pulse',
                name: 'Pulso de Energía',
                type: 'pulse',
                minScale: 0.8,
                maxScale: 1.2,
                frequency: 2,
                duration: 2000,
                loop: true,
            },
            {
                id: 'app-orbit',
                name: 'Órbita Circular',
                type: 'orbit',
                radius: 3,
                speed: 0.5,
                axis: 'y',
                center: [0, 0, 0],
                duration: 8000,
                loop: true,
            },
        ],
        cameraPosition: [5, 3, 5],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#1e293b',
    },

    '/app/discussions': {
        route: '/app/discussions',
        animations: [
            {
                id: 'discussions-rotation',
                name: 'Rotación Rápida',
                type: 'rotation',
                axis: 'xyz',
                speed: 1.2,
                duration: 5000,
                loop: true,
            },
            {
                id: 'discussions-scale',
                name: 'Escalado Dinámico',
                type: 'scale',
                axis: 'uniform',
                from: 0.5,
                to: 1.5,
                duration: 3000,
                easing: 'easeInOut',
                loop: true,
            },
        ],
        cameraPosition: [0, 0, 8],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#312e81',
    },

    '/app/profile': {
        route: '/app/profile',
        animations: [
            {
                id: 'profile-float',
                name: 'Flotación Elegante',
                type: 'float',
                axis: 'y',
                amplitude: 1,
                frequency: 0.8,
                duration: 4000,
                loop: true,
            },
            {
                id: 'profile-rotation',
                name: 'Rotación Lenta',
                type: 'rotation',
                axis: 'y',
                speed: 0.3,
                duration: 12000,
                loop: true,
            },
        ],
        cameraPosition: [3, 2, 4],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#7c2d12',
    },

    '/app/users': {
        route: '/app/users',
        animations: [
            {
                id: 'users-orbit',
                name: 'Órbita Compleja',
                type: 'orbit',
                radius: 4,
                speed: 0.8,
                axis: 'y',
                center: [0, 0, 0],
                duration: 6000,
                loop: true,
            },
            {
                id: 'users-pulse',
                name: 'Pulso Rápido',
                type: 'pulse',
                minScale: 0.6,
                maxScale: 1.4,
                frequency: 3,
                duration: 1500,
                loop: true,
            },
        ],
        cameraPosition: [0, 5, 6],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#166534',
    },

    '/auth/login': {
        route: '/auth/login',
        animations: [
            {
                id: 'login-rotation',
                name: 'Rotación Suave',
                type: 'rotation',
                axis: 'x',
                speed: 0.4,
                duration: 8000,
                loop: true,
            },
            {
                id: 'login-float',
                name: 'Flotación Vertical',
                type: 'float',
                axis: 'y',
                amplitude: 0.3,
                frequency: 1.5,
                duration: 2500,
                loop: true,
            },
        ],
        cameraPosition: [0, 1, 6],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#be185d',
    },

    '/auth/register': {
        route: '/auth/register',
        animations: [
            {
                id: 'register-scale',
                name: 'Escalado Continuo',
                type: 'scale',
                axis: 'uniform',
                from: 0.8,
                to: 1.2,
                duration: 2000,
                easing: 'easeInOut',
                loop: true,
            },
            {
                id: 'register-orbit',
                name: 'Órbita Pequeña',
                type: 'orbit',
                radius: 2,
                speed: 1,
                axis: 'z',
                center: [0, 0, 0],
                duration: 4000,
                loop: true,
            },
        ],
        cameraPosition: [2, 2, 5],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#7c3aed',
    },

    '/scene3d': {
        route: '/scene3d',
        animations: [
            {
                id: 'scene3d-rotation',
                name: 'Rotación Completa',
                type: 'rotation',
                axis: 'xyz',
                speed: 0.8,
                duration: 6000,
                loop: true,
            },
            {
                id: 'scene3d-pulse',
                name: 'Pulso Intenso',
                type: 'pulse',
                minScale: 0.7,
                maxScale: 1.3,
                frequency: 2.5,
                duration: 1800,
                loop: true,
            },
        ],
        cameraPosition: [0, 0, 7],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#0c4a6e',
    },

    '/scene3d-advanced': {
        route: '/scene3d-advanced',
        animations: [
            {
                id: 'advanced-orbit',
                name: 'Órbita Avanzada',
                type: 'orbit',
                radius: 5,
                speed: 0.6,
                axis: 'y',
                center: [0, 0, 0],
                duration: 10000,
                loop: true,
            },
            {
                id: 'advanced-float',
                name: 'Flotación Avanzada',
                type: 'float',
                axis: 'y',
                amplitude: 0.8,
                frequency: 0.7,
                duration: 3500,
                loop: true,
            },
        ],
        cameraPosition: [4, 4, 6],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#374151',
    },

    '/scene3d-shaders': {
        route: '/scene3d-shaders',
        animations: [
            {
                id: 'shaders-rotation',
                name: 'Rotación de Shaders',
                type: 'rotation',
                axis: 'y',
                speed: 1.5,
                duration: 4000,
                loop: true,
            },
            {
                id: 'shaders-scale',
                name: 'Escalado de Shaders',
                type: 'scale',
                axis: 'uniform',
                from: 0.3,
                to: 1.7,
                duration: 2500,
                easing: 'easeInOut',
                loop: true,
            },
        ],
        cameraPosition: [0, 2, 8],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#581c87',
    },

    '/scene3d-super-advanced': {
        route: '/scene3d-super-advanced',
        animations: [
            {
                id: 'super-advanced-orbit',
                name: 'Órbita Super Avanzada',
                type: 'orbit',
                radius: 6,
                speed: 0.4,
                axis: 'y',
                center: [0, 0, 0],
                duration: 15000,
                loop: true,
            },
            {
                id: 'super-advanced-pulse',
                name: 'Pulso Super Avanzado',
                type: 'pulse',
                minScale: 0.5,
                maxScale: 1.5,
                frequency: 1.8,
                duration: 2200,
                loop: true,
            },
            {
                id: 'super-advanced-float',
                name: 'Flotación Super Avanzada',
                type: 'float',
                axis: 'y',
                amplitude: 1.2,
                frequency: 0.5,
                duration: 5000,
                loop: true,
            },
        ],
        cameraPosition: [6, 6, 8],
        cameraTarget: [0, 0, 0],
        backgroundColor: '#1f2937',
    },
};

// Hook para obtener la configuración de escena basada en la ruta actual
export function useRouteSceneConfig(currentPath: string): RouteSceneConfig {
    return useMemo(() => {
        // Buscar configuración exacta primero
        if (routeSceneConfigs[currentPath]) {
            return routeSceneConfigs[currentPath];
        }

        // Buscar configuración por coincidencia parcial
        const matchingRoute = Object.keys(routeSceneConfigs).find(route =>
            currentPath.startsWith(route) && route !== '/'
        );

        if (matchingRoute) {
            return routeSceneConfigs[matchingRoute];
        }

        // Configuración por defecto
        return routeSceneConfigs['/'];
    }, [currentPath]);
}
