import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import {
  ActionLogView,
  DerivedHeroStatus,
  HeroVisualClass,
  HpStatus,
  ManaStatus,
} from '../types';

// Reglas del juego (constantes, no estado)
export const ATTACK_MP_COST = 10;
export const BOSS_COUNTER_DAMAGE = 15;
const HEAVY_LOAD_KG = 30;

// Base Input Selectors
export const selectStats = (state: RootState) => state.stats;
export const selectInventory = (state: RootState) => state.inventory;
export const selectCombat = (state: RootState) => state.combat;
export const selectActionLog = (state: RootState) => state.actionLog;

// Equipped items list selector
export const selectEquippedItems = createSelector([selectInventory], (inventory) =>
  inventory.catalog.filter((item) => inventory.equippedIds.includes(item.id))
);

// Arma que el héroe lleva en la mano (primer ítem equipado de tipo arma)
export const selectEquippedWeapon = createSelector(
  [selectEquippedItems],
  (equippedItems) => equippedItems.find((item) => item.category === 'weapons') ?? null
);

// Atributos base (statsSlice) + bonos de los ítems equipados (inventorySlice)
export const selectTotalStats = createSelector(
  [selectStats, selectEquippedItems],
  (stats, equippedItems) => {
    let bonusStr = 0;
    let bonusAgi = 0;
    let bonusInt = 0;

    for (const item of equippedItems) {
      bonusStr += item.bonusStr;
      bonusAgi += item.bonusAgi;
      bonusInt += item.bonusInt;
    }

    return {
      bonusStr,
      bonusAgi,
      bonusInt,
      totalStr: stats.str + bonusStr,
      totalAgi: stats.agi + bonusAgi,
      totalInt: stats.int + bonusInt,
    };
  }
);

export const selectTotalWeight = createSelector([selectEquippedItems], (equippedItems) =>
  equippedItems.reduce((acc, item) => acc + item.weight, 0)
);

// Capacidad de carga: 10 + (Fuerza Total * 2)
export const selectMaxWeightCapacity = createSelector(
  [selectTotalStats],
  (totals) => 10 + totals.totalStr * 2
);

export const selectIsOverencumbered = createSelector(
  [selectTotalWeight, selectMaxWeightCapacity],
  (totalWeight, maxWeightCapacity) => totalWeight > maxWeightCapacity
);

// Poder de combate (-30% si está sobrecargado)
export const selectRawPower = createSelector(
  [selectTotalStats],
  (totals) => totals.totalStr * 3 + totals.totalAgi * 2 + totals.totalInt * 3
);

export const selectCombatPower = createSelector(
  [selectRawPower, selectIsOverencumbered],
  (rawPower, isOverloaded) => (isOverloaded ? Math.round(rawPower * 0.7) : rawPower)
);

// Clase visual según la estadística dominante (y la carga para el Tanque)
export const selectHeroVisualClass = createSelector(
  [selectTotalStats, selectTotalWeight],
  ({ totalStr, totalAgi, totalInt }, totalWeight): HeroVisualClass => {
    const strDominant = totalStr >= totalAgi && totalStr >= totalInt;
    const intDominant = totalInt >= totalStr && totalInt >= totalAgi;
    const agiDominant = totalAgi >= totalStr && totalAgi >= totalInt;

    if (totalWeight >= HEAVY_LOAD_KG && strDominant) {
      return { heroClass: 'Tanque Pesado', heroIcon: 'security', heroEmoji: '🛡️', auraColor: '#f59e0b' };
    }
    if (totalStr >= 15 && strDominant) {
      return { heroClass: 'Guerrero Berserker', heroIcon: 'fitness-center', heroEmoji: '🪓', auraColor: '#ef4444' };
    }
    if (totalInt >= 15 && intDominant) {
      return { heroClass: 'Archimago Arcano', heroIcon: 'auto-fix-high', heroEmoji: '🧙', auraColor: '#38bdf8' };
    }
    if (totalAgi >= 15 && agiDominant) {
      return { heroClass: 'Asesino Sombrío', heroIcon: 'flash-on', heroEmoji: '🥷', auraColor: '#10b981' };
    }
    return { heroClass: 'Aldeano', heroIcon: 'person', heroEmoji: '🧑‍🌾', auraColor: '#94a3b8' };
  }
);

// Estado vital del avatar: sano / herido / derrotado
export const selectHpStatus = createSelector([selectStats], (stats): HpStatus => {
  if (stats.currentHp <= 0) return 'DERROTADO';
  if (stats.currentHp < stats.maxHp * 0.6) return 'HERIDO';
  return 'SANO';
});

// Maná máximo derivado de la Inteligencia total
export const selectMana = createSelector(
  [selectTotalStats, selectStats],
  (totals, stats): ManaStatus => {
    const maxMp = 20 + totals.totalInt * 4;
    return { maxMp, currentMp: Math.max(0, maxMp - stats.mpSpent) };
  }
);

// Daño que el héroe inflige al Boss con su poder actual
export const selectAttackDamage = createSelector([selectCombatPower], (combatPower) =>
  Math.max(35, Math.round(combatPower * 1.5))
);

export const selectCanAttack = createSelector(
  [selectHpStatus, selectCombat, selectMana],
  (hpStatus, combat, mana) =>
    hpStatus !== 'DERROTADO' && combat.bossHp > 0 && mana.currentMp >= ATTACK_MP_COST
);

// Últimas 5 acciones con un payload legible (cruza actionLog + inventory para mostrar nombres)
export const selectRecentActions = createSelector(
  [selectActionLog, selectInventory],
  (actionLog, inventory): ActionLogView[] =>
    actionLog.history.slice(0, 5).map((entry) => {
      let displayPayload = entry.payloadStr;
      if (entry.type === 'inventory/toggleEquipItem') {
        const item = inventory.catalog.find((i) => i.id === entry.payloadStr);
        displayPayload = `"${item ? item.name : entry.payloadStr}"`;
      } else if (
        entry.payloadStr !== '{}' &&
        !entry.payloadStr.startsWith('{') &&
        Number.isNaN(Number(entry.payloadStr))
      ) {
        displayPayload = `"${entry.payloadStr}"`;
      }
      return { ...entry, displayPayload };
    })
);

// Resumen agregado (compuesto de los selectores anteriores) para las vistas que lo necesitan todo
export const selectHeroComputedStatus = createSelector(
  [
    selectTotalStats,
    selectTotalWeight,
    selectMaxWeightCapacity,
    selectIsOverencumbered,
    selectRawPower,
    selectCombatPower,
    selectHeroVisualClass,
    selectHpStatus,
  ],
  (
    totals,
    totalWeight,
    maxWeightCapacity,
    isOverloaded,
    rawPower,
    combatPower,
    visualClass,
    hpStatus
  ): DerivedHeroStatus => ({
    ...totals,
    totalWeight,
    maxWeightCapacity,
    isOverloaded,
    ...visualClass,
    rawPower,
    combatPower,
    isDefeated: hpStatus === 'DERROTADO',
    encumbranceRatio: maxWeightCapacity > 0 ? totalWeight / maxWeightCapacity : 0,
  })
);
