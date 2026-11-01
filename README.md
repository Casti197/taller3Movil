# HeroForge RPG — Arquitectura de Estado Visual con Redux Toolkit en React Native

Mini-juego móvil hecho con **React Native (Expo) + TypeScript + Redux Toolkit** para el taller de Desarrollo Móvil. Cada acción despachada en una zona de la pantalla provoca reacciones visuales inmediatas en **4 componentes independientes** que no se pasan props entre sí: todos leen del mismo Store.

---

## 🔁 Flujo unidireccional de Redux

```
 ┌──────────────┐  dispatch(action)  ┌──────────────┐   reducers (Immer)  ┌──────────────┐
 │ UI Component │ ─────────────────▶ │  Middleware  │ ──────────────────▶ │    Store     │
 │ (toque, +/-) │                    │ (meta/log)   │                     │ stats, inv., │
 └──────────────┘                    └──────────────┘                     │ combat, log  │
        ▲                                                                 └──────┬───────┘
        │ re-render                       useAppSelector(selector)               │
        └──────────────────────── Selectores derivados ◀─────────────────────────┘
                              (stats totales, peso, poder, clase)
```

Ejemplo: tocar **Armadura Maldita** despacha `inventory/toggleEquipItem` con payload `"item_armor"`. El reducer agrega el id a `equippedIds` y, sin que ninguna zona hable con otra:

- **Zona A** recalcula el peso (40 / 26 Kg → barra roja), la clase cambia a *Tanque Pesado* y el poder baja un 30 %.
- **Zona B** muestra el bono de la armadura junto a la Fuerza.
- **Zona C** marca la tarjeta como equipada y muestra **¡SOBRECARGADO! (-50% Velocidad)**.
- **Zona D** registra `[inventory/toggleEquipItem] -> "Armadura Maldita"` en el ticker y ajusta el daño contra el Boss.

---

## 🎮 Las 4 zonas (pestaña Console)

| Zona | Componente | Qué hace | Store |
|---|---|---|---|
| A | `<HeroAvatarHUD />` | Avatar con aura, emoji de clase, expresión según HP y arma en mano. Barras de HP, Maná y Peso (verde → amarillo → rojo). Badge de clase automática. | Solo lee selectores |
| B | `<StatsControlPanel />` | 15 puntos de habilidad, `[-]`/`[+]` para STR, AGI e INT, presets Guerrero/Mago/Pícaro y Poción de Reseteo. | Despacha a `statsSlice` |
| C | `<ArmoryGrid />` | Cuadrícula de 7 ítems con bono y peso; tocar equipa/desequipa. Alerta de sobrecarga. | Despacha a `inventorySlice` |
| D | `<ReduxLiveInspector />` | Combate contra el Boss (cuesta maná, el Boss contraataca), botón Curar y ticker con las últimas 5 acciones `[type] -> payload`. | Despacha a `combatSlice`/`statsSlice`, lee `actionLogSlice` |

Clases del héroe (según la estadística dominante): ⚪ Aldeano · 🔴 Guerrero Berserker (STR ≥ 15) · 🔵 Archimago Arcano (INT ≥ 15) · 🟢 Asesino Sombrío (AGI ≥ 15) · 🟠 Tanque Pesado (carga ≥ 30 Kg y STR dominante).

La pestaña **Dispatch** permite elegir un action creator, editar su payload en JSON y despacharlo a mano.

---

## 🛠️ Arquitectura

```
src/
├── store/
│   ├── index.ts                 # configureStore, RootState, AppDispatch, hooks tipados
│   ├── actionMetaMiddleware.ts  # Sella cada acción con id y hora (mantiene puros los reducers)
│   ├── selectors.ts             # Estado derivado con createSelector
│   └── slices/
│       ├── statsSlice.ts        # Atributos, HP, maná gastado, presets
│       ├── inventorySlice.ts    # Catálogo y equippedIds
│       ├── combatSlice.ts       # HP del Boss y feedback del combate
│       └── actionLogSlice.ts    # Historial alimentado con extraReducers + addMatcher
├── components/                  # UI: las 4 zonas + Header y BottomNavBar
├── screens/                     # HeroConsoleScreen (4 zonas) y DispatchStudioScreen
├── types/index.ts
└── constants/theme.ts
```

### Regla de oro: nada calculado se guarda en el State

Estos valores se calculan en `src/store/selectors.ts` cruzando `statsSlice` e `inventorySlice`:

- `selectTotalStats`: atributos base + bonos de los ítems equipados.
- `selectTotalWeight`, `selectMaxWeightCapacity` (`10 + STR total × 2`) y `selectIsOverencumbered`.
- `selectCombatPower`: `STR×3 + AGI×2 + INT×3`, con −30 % si hay sobrecarga.
- `selectHeroVisualClass`: clase, emoji, ícono y color de aura.
- `selectHpStatus` (sano / herido / derrotado), `selectMana` (máximo = `20 + INT × 4`), `selectAttackDamage`, `selectCanAttack`.
- `selectRecentActions`: últimas 5 acciones con el nombre del ítem en lugar de su id.

Si el poder o la sobrecarga se guardaran en el slice, habría que actualizarlos a mano en cada reducer que toque stats o equipo, y tarde o temprano la UI mostraría valores contradictorios.

---

## 🚀 Cómo ejecutarlo

```bash
npm install
npx expo start
```

Escanea el QR con **Expo Go**, o presiona `a` (emulador Android) o `w` (navegador).

Verificar tipos: `npx tsc --noEmit`
