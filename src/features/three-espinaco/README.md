# Sistema de Canvas 3D con Animaciones por Ruta

Este sistema proporciona un canvas de fondo 3D que se mantiene durante la navegación de rutas, con animaciones específicas para cada ruta y un sistema completo de gestión de animaciones.

## 🚀 Características

- **Canvas persistente**: Se mantiene durante toda la navegación
- **Animaciones por ruta**: Cada ruta tiene su propia configuración de animaciones
- **Sistema de gestión avanzado**: Añadir, eliminar, modificar animaciones en tiempo real
- **Panel de control**: Interfaz para gestionar animaciones desde el navegador
- **Tipos de animación**: Rotación, posición, escala, flotación, pulso, órbita
- **Presets**: Guardar y cargar configuraciones de animaciones
- **Grupos de animaciones**: Controlar múltiples animaciones como grupo

## 📁 Estructura del Sistema

```
src/features/three-espinaco/
├── components/
│   ├── BackgroundCanvas.tsx          # Componente principal del canvas
│   ├── AnimationControlPanel.tsx     # Panel de control de animaciones
│   ├── primitives/
│   │   └── AnimatedPrimitives.tsx   # Objetos 3D animados
│   └── index.ts                     # Exportaciones principales
├── hooks/
│   ├── useAnimationManager.ts       # Hook básico de gestión
│   └── useAdvancedAnimationManager.ts # Hook avanzado con más funciones
├── config/
│   └── routeScenes.ts              # Configuraciones por ruta
├── types/
│   └── animations.ts               # Tipos TypeScript
└── scenes/                        # Escenas 3D existentes
```

## 🎬 Tipos de Animaciones

### 1. Rotación (`rotation`)
```typescript
{
  id: 'rotate-y',
  name: 'Rotación en Y',
  type: 'rotation',
  axis: 'y', // 'x', 'y', 'z', 'xyz'
  speed: 0.5, // Velocidad de rotación continua
  duration: 3000,
  loop: true
}
```

### 2. Posición (`position`)
```typescript
{
  id: 'move-x',
  name: 'Movimiento en X',
  type: 'position',
  axis: 'x',
  from: 0,
  to: 5,
  duration: 2000,
  easing: 'easeInOut'
}
```

### 3. Escala (`scale`)
```typescript
{
  id: 'scale-up',
  name: 'Escalado',
  type: 'scale',
  axis: 'uniform', // 'x', 'y', 'z', 'uniform'
  from: 0.5,
  to: 1.5,
  duration: 1500,
  loop: true
}
```

### 4. Flotación (`float`)
```typescript
{
  id: 'float-y',
  name: 'Flotación Vertical',
  type: 'float',
  axis: 'y',
  amplitude: 0.5,
  frequency: 1,
  duration: 3000,
  loop: true
}
```

### 5. Pulso (`pulse`)
```typescript
{
  id: 'pulse-effect',
  name: 'Efecto de Pulso',
  type: 'pulse',
  minScale: 0.8,
  maxScale: 1.2,
  frequency: 2,
  duration: 2000,
  loop: true
}
```

### 6. Órbita (`orbit`)
```typescript
{
  id: 'orbit-y',
  name: 'Órbita Circular',
  type: 'orbit',
  radius: 3,
  speed: 0.5,
  axis: 'y',
  center: [0, 0, 0],
  duration: 8000,
  loop: true
}
```

## 🛠️ Uso Básico

### 1. Integración en la Aplicación

El sistema ya está integrado en `src/app/provider.tsx`:

```typescript
import { BackgroundCanvasWrapper } from '@/features/three-espinaco/components/BackgroundCanvas';

// En el componente AppProvider
<BackgroundCanvasWrapper>
  {children}
</BackgroundCanvasWrapper>
```

### 2. Uso del Hook de Animaciones

```typescript
import { useAdvancedAnimationManager } from '@/features/three-espinaco/hooks/useAdvancedAnimationManager';

function MyComponent() {
  const animationManager = useAdvancedAnimationManager();

  // Añadir nueva animación
  const addCustomAnimation = () => {
    animationManager.addAnimation({
      id: 'custom-animation',
      name: 'Mi Animación',
      type: 'rotation',
      axis: 'y',
      speed: 1,
      duration: 5000,
      loop: true,
    });
  };

  // Controlar animaciones
  const pauseAll = () => animationManager.pauseAllAnimations();
  const resumeAll = () => animationManager.resumeAllAnimations();
  const clearAll = () => animationManager.clearAllAnimations();

  return (
    <div>
      <button onClick={addCustomAnimation}>Añadir Animación</button>
      <button onClick={pauseAll}>Pausar Todo</button>
      <button onClick={resumeAll}>Reanudar Todo</button>
      <button onClick={clearAll}>Limpiar Todo</button>
    </div>
  );
}
```

### 3. Crear Objetos Animados

```typescript
import { AnimatedBox, AnimatedSphere } from '@/features/three-espinaco/components';

function MyScene() {
  return (
    <group>
      <AnimatedBox 
        position={[0, 0, 0]} 
        color="#ff6b6b" 
        size={1}
        animationId="my-box"
      />
      <AnimatedSphere 
        position={[2, 0, 0]} 
        color="#4ecdc4" 
        radius={0.8}
        animationId="my-sphere"
      />
    </group>
  );
}
```

## ⚙️ Configuración de Rutas

Las configuraciones de rutas están en `src/features/three-espinaco/config/routeScenes.ts`:

```typescript
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
    ],
    cameraPosition: [0, 2, 5],
    cameraTarget: [0, 0, 0],
    backgroundColor: '#0f172a',
  },
  // ... más configuraciones
};
```

### Añadir Nueva Ruta

```typescript
'/mi-nueva-ruta': {
  route: '/mi-nueva-ruta',
  animations: [
    {
      id: 'nueva-animacion',
      name: 'Mi Nueva Animación',
      type: 'pulse',
      minScale: 0.5,
      maxScale: 1.5,
      frequency: 2,
      duration: 2000,
      loop: true,
    },
  ],
  cameraPosition: [3, 3, 6],
  cameraTarget: [0, 0, 0],
  backgroundColor: '#1f2937',
},
```

## 🎮 Panel de Control

El panel de control permite:

- **Ver animaciones activas**: Lista con estado y progreso
- **Control global**: Pausar/reanudar/limpiar todas las animaciones
- **Crear animaciones**: Añadir nuevas animaciones personalizadas
- **Duplicar animaciones**: Copiar animaciones existentes
- **Gestionar presets**: Guardar y cargar configuraciones
- **Control de velocidad**: Ajustar velocidad global
- **Información detallada**: Ver detalles de animaciones seleccionadas

### Acceder al Panel

El panel aparece como un botón flotante en la esquina superior derecha. Haz clic en "🎬 Control Animaciones" para abrirlo.

## 🔧 Personalización Avanzada

### 1. Crear Tipos de Animación Personalizados

```typescript
// En types/animations.ts
export interface CustomAnimation extends AnimationConfig {
  type: 'custom';
  customProperty: string;
  customValue: number;
}

// En hooks/useAnimationManager.ts
case 'custom':
  const customAnim = animation as CustomAnimation;
  // Implementar lógica personalizada
  break;
```

### 2. Añadir Nuevos Objetos 3D

```typescript
// En components/primitives/AnimatedPrimitives.tsx
export function AnimatedCustomObject({ 
  position = [0, 0, 0], 
  color = '#ffffff',
  animationId = 'custom-animation'
}: {
  position?: [number, number, number];
  color?: string;
  animationId?: string;
}) {
  const meshRef = useRef<Mesh>(null);
  const { registerObject, unregisterObject } = useAnimationManager();

  React.useEffect(() => {
    registerObject(animationId, meshRef);
    return () => unregisterObject(animationId);
  }, [animationId, registerObject, unregisterObject]);

  return (
    <mesh ref={meshRef} position={position}>
      {/* Tu geometría personalizada */}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
```

## 🎨 Efectos Visuales

### Cambio de Color de Fondo por Ruta

Cada ruta puede tener un color de fondo diferente que se aplica automáticamente:

```typescript
backgroundColor: '#0f172a', // Azul oscuro
backgroundColor: '#1e293b', // Gris azulado
backgroundColor: '#312e81', // Púrpura
backgroundColor: '#7c2d12', // Rojo oscuro
backgroundColor: '#166534', // Verde oscuro
```

### Posición de Cámara Dinámica

Las posiciones de cámara se ajustan automáticamente según la ruta:

```typescript
cameraPosition: [0, 2, 5],    // Vista frontal
cameraPosition: [5, 3, 5],    // Vista diagonal
cameraPosition: [0, 0, 8],    // Vista lejana
cameraPosition: [3, 2, 4],    // Vista cercana
```

## 🚀 Rendimiento

### Optimizaciones Implementadas

- **Canvas fijo**: No se recrea en cada cambio de ruta
- **Animaciones eficientes**: Usando `useFrame` de React Three Fiber
- **Gestión de memoria**: Limpieza automática de referencias
- **Lazy loading**: Componentes cargados bajo demanda
- **High DPI support**: Soporte para pantallas de alta densidad

### Recomendaciones

- No crear más de 20 animaciones simultáneas
- Usar `loop: true` para animaciones continuas
- Limpiar animaciones no utilizadas regularmente
- Monitorear el rendimiento en dispositivos móviles

## 🐛 Solución de Problemas

### Animaciones no funcionan
1. Verificar que el objeto esté registrado con `registerObject`
2. Comprobar que la animación tenga un `id` único
3. Asegurar que `duration` sea mayor que 0

### Panel de control no aparece
1. Verificar que `BackgroundCanvas` esté renderizado
2. Comprobar que no hay errores en la consola
3. Asegurar que el z-index sea correcto

### Rendimiento lento
1. Reducir el número de animaciones simultáneas
2. Usar animaciones más simples (rotación vs órbita)
3. Verificar que no hay memory leaks

## 📝 Ejemplos de Uso

### Ejemplo 1: Animación de Bienvenida

```typescript
const welcomeAnimation = {
  id: 'welcome-pulse',
  name: 'Pulso de Bienvenida',
  type: 'pulse',
  minScale: 0.5,
  maxScale: 2,
  frequency: 1,
  duration: 3000,
  loop: false, // Solo una vez
  easing: 'easeInOut',
};
```

### Ejemplo 2: Transición entre Rutas

```typescript
const transitionAnimation = {
  id: 'route-transition',
  name: 'Transición de Ruta',
  type: 'rotation',
  axis: 'xyz',
  speed: 2,
  duration: 1000,
  loop: false,
  easing: 'easeOut',
};
```

### Ejemplo 3: Efecto de Carga

```typescript
const loadingAnimation = {
  id: 'loading-spin',
  name: 'Spinner de Carga',
  type: 'rotation',
  axis: 'y',
  speed: 3,
  duration: 2000,
  loop: true,
};
```

## 🔮 Futuras Mejoras

- [ ] Animaciones de partículas
- [ ] Shaders personalizados
- [ ] Interactividad con mouse/touch
- [ ] Sonidos sincronizados con animaciones
- [ ] Exportar/importar configuraciones
- [ ] Editor visual de animaciones
- [ ] Soporte para VR/AR
- [ ] Animaciones basadas en física

---

¡El sistema está listo para usar! 🎉 Navega por las diferentes rutas para ver las animaciones en acción y usa el panel de control para experimentar con nuevas animaciones.
