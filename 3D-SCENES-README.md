# 🎮 Escenas 3D con Three.js

Este proyecto ahora incluye páginas con escenas 3D interactivas utilizando Three.js, React Three Fiber y React Three Drei, siguiendo los patrones del proyecto [react-three-next](https://github.com/pmndrs/react-three-next).

## 🚀 Características Implementadas

### Escenas Disponibles

1. **Escena 3D Básica** (`/scene3d`)
   - Cubos, esferas y toros animados
   - Iluminación básica
   - Controles de cámara estándar
   - Interfaz simple y limpia

2. **Escena 3D Avanzada** (`/scene3d-advanced`)
   - Múltiples objetos 3D interactivos
   - Efectos hover y animaciones suaves
   - Texto 3D interactivo
   - Iluminación múltiple
   - Diseño moderno con gradientes

3. **Escena 3D Super Avanzada** (`/scene3d-super-advanced`)
   - Sistema de partículas dinámico
   - Anillos animados complejos
   - Controles interactivos en tiempo real
   - Iluminación avanzada con múltiples fuentes
   - Optimizaciones de rendimiento

4. **Custom Shaders** (`/scene3d-shaders`)
   - Animaciones en Vertex Shader (ondas, morfing)
   - Efectos en Fragment Shader (pulsing, energía)
   - Shaders personalizados con GLSL
   - Interfaz para cambiar entre diferentes shaders
   - Demostración de técnicas avanzadas de WebGL

## 🛠️ Tecnologías Utilizadas

- **Three.js**: Biblioteca principal para gráficos 3D
- **React Three Fiber**: Renderer de React para Three.js
- **React Three Drei**: Utilidades y helpers para R3F
- **React Three A11y**: Herramientas de accesibilidad
- **Next.js 14**: Framework de React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos y diseño

## 📦 Dependencias Instaladas

```bash
npm install three @react-three/fiber @react-three/drei @react-three/a11y @types/three --legacy-peer-deps
```

## 🎯 Componentes 3D Reutilizables

### Componentes Disponibles (`/src/components/3d/`)

- `RotatingBox`: Cubo con rotación y efectos hover
- `FloatingSphere`: Esfera con movimiento sinusoidal
- `RotatingTorus`: Toro con animación independiente
- `InteractiveText`: Texto 3D interactivo
- `GroundPlane`: Plano base para las escenas
- `Loading3D`: Componente de carga para 3D
- `SceneLighting`: Configuración de iluminación

### Ejemplo de Uso

```tsx
import { RotatingBox, FloatingSphere, SceneLighting } from '@/components/3d';

function MyScene() {
  return (
    <>
      <SceneLighting />
      <RotatingBox position={[0, 0, 0]} color="#ff6b6b" />
      <FloatingSphere position={[2, 0, 0]} color="#4ecdc4" />
    </>
  );
}
```

## 🎮 Controles de Cámara

- **Rotar**: Click izquierdo + arrastrar
- **Zoom**: Scroll del mouse
- **Pan**: Click derecho + arrastrar
- **Hover**: Pasa el mouse sobre los objetos para efectos

## 🚀 Cómo Ejecutar

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador:
   ```
   http://localhost:3000
   ```

4. Navegar a las escenas 3D desde la página principal

## 🎨 Personalización

### Crear Nueva Escena 3D

1. Crear archivo en `/src/app/mi-escena/page.tsx`
2. Usar el patrón Canvas + Suspense
3. Importar componentes 3D reutilizables
4. Configurar controles de cámara

```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { RotatingBox } from '@/components/3d';

export default function MiEscena() {
  return (
    <div className="h-screen">
      <Canvas>
        <Suspense fallback={null}>
          <RotatingBox position={[0, 0, 0]} />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

## 🔧 Configuración Avanzada

### Optimizaciones de Rendimiento

- Uso de `useFrame` para animaciones eficientes
- `Suspense` para lazy loading de componentes 3D
- Configuración de `gl` con antialiasing
- Damping en controles de cámara

### Iluminación

- `ambientLight`: Iluminación ambiental
- `directionalLight`: Luz direccional principal
- `pointLight`: Luces puntuales
- `spotLight`: Luces focales

## 📚 Recursos Adicionales

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [React Three Drei](https://github.com/pmndrs/drei)
- [react-three-next Repository](https://github.com/pmndrs/react-three-next)

## 🎯 Próximos Pasos

- [ ] Añadir modelos 3D externos (GLTF)
- [ ] Implementar shaders personalizados
- [ ] Añadir física con Cannon.js
- [ ] Crear sistema de partículas más avanzado
- [ ] Implementar post-processing effects
- [ ] Añadir audio espacial

---

¡Disfruta explorando las escenas 3D! 🎮✨
