# HeroForge RPG — Arquitectura de Estado Visual con Redux Toolkit en React Native

Proyecto móvil desarrollado en **React Native con Expo y TypeScript**, basado en el diseño importado del proyecto Stitch **"Diseño Claro para IA"** (Taller Práctico de Desarrollo Móvil).

---

## 🎮 Demostración Visual del "Efecto Dominó" en Redux

La aplicación demuestra de forma gráfica el flujo unidireccional de datos en Redux:
$$\text{UI Component} \longrightarrow \text{dispatch(action)} \longrightarrow \text{Reducer (Immer)} \longrightarrow \text{Store Update} \longrightarrow \text{Memoized Selectors} \longrightarrow \text{Re-render}$$

Al interactuar con un control (como equipar un arma pesada o seleccionar un preset de build), **al menos 4 zonas independientes se sincronizan de inmediato sin pasar props (0 Prop Drilling)**:

1. **Zona A: Avatar & HUD Superior (`<HeroAvatarHUD />`)**
   - Aura dinámica que cambia de color según la clase dominante:
     - 🔴 Berserker Implacable (STR ≥ 15)
     - 🔵 Archimago Arcano (INT ≥ 15)
     - 🟢 Asesino Sombrío (AGI ≥ 15)
     - ⚪ Novato / Aldeano (Valores base)
   - Barras reactivas de Vida (HP), Maná (MP) y Carga de Mochila (Kg).
   - Detección inmediata de **Sobrecarga de Peso** con penalización visual de `-30% Poder de Combate` y `-50% Velocidad`.

2. **Zona B: Panel de Entrenamiento de Atributos (`<StatsControlPanel />`)**
   - Contador de 15 puntos de habilidad disponibles.
   - Controles `[-]` y `[+]` para **Fuerza (STR)**, **Agilidad (AGI)** e **Inteligencia (INT)** con micro-barras y chips de bono de armas.
   - Presets rápidos de acción única (`Guerrero`, `Mago`, `Pícaro`) y botón de **Poción de Reseteo**.

3. **Zona C: Armería & Mochila (`<ArmoryGrid />`)**
   - Cuadrícula de ítems (Espada de Fuego, Escudo de Titanio, Báculo Arcano, Botas Élficas, Armadura Maldita, Dagas Gemelas, Reliquias).
   - Tarjetas con estado activo brillante y botón de equipar/desequipar.

4. **Zona D: Arena de Combate & Inspector en Vivo (`<ReduxLiveInspector />`)**
   - Batalla interactiva contra el Jefe de Incursión (*Malakor el Inmutable*).
   - Ticker de telemetría de Redux que registra en tiempo real las últimas acciones despachadas con su type, payload y diff.

---

## 📱 Pantallas y Vistas Adicionales de la App

La aplicación cuenta con una barra de navegación inferior con 5 vistas completas:

- **Console (`hero-console`):** Panel principal del juego interactivo con las 4 zonas conectadas.
- **State Tree (`state-tree-inspector`):** Inspector del heap de memoria de Redux con nodos colapsables/expandibles (`stats`, `inventory`, `actionLog`), matriz de selectores memoizados en vivo y **Time Travel Debugger** con reproducción paso a paso.
- **Dispatch (`action-dispatcher`):** Playground interactivo para construir acciones y payloads JSON, con escenarios de prueba en 1 toque y monitor de middleware.
- **Inventory (`inventory-slice`):** Armería extendida con medidor de encumbramiento por zonas (Ágil, Carga Media, Límite Máximo), rig de equipamiento activo, filtros de categoría y generador de loot aleatorio.
- **Academy (`redux-academy`):** Academia técnica con diagrama de flujo interactivo de 6 nodos, guion táctico para el video de 5 a 7 minutos, comparador de código (Antipatrón vs Selector Puro), simulador de rúbrica de 100 PTS y checklist de grabación.

---

## 🛠️ Arquitectura Técnica de Redux Toolkit

Estructura de archivos en `src/`:

```
src/
├── constants/
│   └── theme.ts              # Tokens de color Cyber-Arcane, espaciados y bordes
├── types/
│   └── index.ts              # Interfaces estrictas en TypeScript
├── store/
│   ├── index.ts              # configureStore, RootState, AppDispatch y hooks tipados
│   ├── selectors.ts          # Selectores puros y memoizados (createSelector)
│   └── slices/
│       ├── statsSlice.ts     # Atributos, vitals, daño y presets de build
│       ├── inventorySlice.ts # Catálogo, equipamiento y generación de botín
│       ├── combatSlice.ts    # Estado del Boss y simulación de daño
│       └── actionLogSlice.ts # Registro automático de auditoría con extraReducers/addMatcher
├── components/
│   ├── Header.tsx            # Cabecera con estado RTK y botón de reseteo
│   ├── BottomNavBar.tsx      # Barra de navegación con 5 pestañas y telemetría
│   ├── hero/
│   │   └── HeroAvatarHUD.tsx # Zona A (HUD y avatar dinámico)
│   ├── stats/
│   │   └── StatsControlPanel.tsx # Zona B (Steppers de stats y presets)
│   ├── inventory/
│   │   └── ArmoryGrid.tsx    # Zona C (Cuadrícula de armería)
│   └── arena/
│       └── ReduxLiveInspector.tsx # Zona D (Boss arena y stream de acciones)
└── screens/
    ├── HeroConsoleScreen.tsx
    ├── StateTreeScreen.tsx
    ├── DispatchStudioScreen.tsx
    ├── InventoryScreen.tsx
    └── ArchitectureAcademyScreen.tsx
```

### Regla de Oro: Estado Derivado (Zero Redundancy)

Los siguientes valores **NO se almacenan en los slices**; se calculan dinámicamente mediante **selectores memoizados** en `src/store/selectors.ts`:

- `selectTotalStats`: Suma de atributos base + bonos de ítems equipados.
- `selectTotalWeight` y `selectIsOverloaded`: Suma del peso de los ítems equipados comparado contra la capacidad máxima calculada (`10 + (totalStr * 2)`).
- `selectCombatPower`: Fórmula `(totalStr * 3) + (totalAgi * 2) + (totalInt * 3)` con penalización del 30% si está sobrecargado.
- `selectHeroComputedStatus`: Consolida la clase visual del héroe, el icono y el color de aura.

---

## 🚀 Cómo Ejecutar el Proyecto

1. **Instalar dependencias (si es necesario):**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo Expo:**
   ```bash
   npx expo start
   ```

3. **Abrir en tu dispositivo móvil o emulador:**
   - Presiona `a` para abrir en emulador de Android.
   - Presiona `w` para abrir en el navegador web.
   - Escanea el código QR con la app **Expo Go** en tu teléfono físico (iOS o Android).

4. **Verificación de tipado y diagnóstico:**
   ```bash
   npx tsc --noEmit
   npx expo-doctor
   ```

---

## 📹 Guion Sugerido para el Video Explicativo (5 a 7 min)

| Tiempo | Momento | Enfoque |
|---|---|---|
| **0:00 - 1:30** | **Momento 1: El Problema Arquitectónico** | Explica las limitaciones de `useState` y prop-drilling en apps con vistas independientes. Presenta el ciclo unidireccional de Redux. |
| **1:30 - 3:30** | **Momento 2: Demostración en Vivo** | Muestra el "Efecto Dominó" equipando un ítem pesado: cambia la clase, aura, barra de peso, poder de combate y se registra en el log. |
| **3:30 - 5:30** | **Momento 3: Recorrido por el Código** | Abre `configureStore`, muestra cómo Immer gestiona la inmutabilidad en los slices y resalta los selectores derivados en `selectors.ts`. |
| **5:30 - 6:30** | **Momento 4: Cierre Crítico** | Responde con criterio: `useState` para estado local efímero de UI vs `Redux Toolkit` para estado de dominio compartido y auditoría. |
