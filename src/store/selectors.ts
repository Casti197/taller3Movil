import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { DerivedHeroStatus } from '../types';

// Base Input Selectors
export const selectStats = (state: RootState) => state.stats;
export const selectInventory = (state: RootState) => state.inventory;
export const selectCombat = (state: RootState) => state.combat;
export const selectActionLog = (state: RootState) => state.actionLog;

// Equipped items list selector
export const selectEquippedItems = createSelector(
  [selectInventory],
  (inventory) => {
    return inventory.catalog.filter((item) =>
      inventory.equippedIds.includes(item.id)
    );
  }
);

// Derived Stats & Encumbrance (Zero duplicate calculation in state)
export const selectHeroComputedStatus = createSelector(
  [selectStats, selectEquippedItems],
  (stats, equippedItems): DerivedHeroStatus => {
    const { str, agi, int, currentHp } = stats;

    // Sum equipped item bonuses
    let bonusStr = 0;
    let bonusAgi = 0;
    let bonusInt = 0;
    let totalWeight = 0;

    for (const item of equippedItems) {
      bonusStr += item.bonusStr;
      bonusAgi += item.bonusAgi;
      bonusInt += item.bonusInt;
      totalWeight += item.weight;
    }

    const totalStr = str + bonusStr;
    const totalAgi = agi + bonusAgi;
    const totalInt = int + bonusInt;

    // Weight capacity formula: 10 + (totalStr * 2)
    const maxWeightCapacity = 10 + totalStr * 2;
    const isOverloaded = totalWeight > maxWeightCapacity;
    const encumbranceRatio = maxWeightCapacity > 0 ? totalWeight / maxWeightCapacity : 0;

    // Dynamic Archetype and Aura logic
    let heroClass = 'Novato / Aldeano';
    let heroIcon = 'shield';
    let auraColor = '#94a3b8';

    if (totalStr >= 15 && totalStr >= totalAgi && totalStr >= totalInt) {
      heroClass = 'Berserker Implacable';
      heroIcon = 'fitness-center';
      auraColor = '#ef4444';
    } else if (totalInt >= 15 && totalInt >= totalStr && totalInt >= totalAgi) {
      heroClass = 'Archimago Arcano';
      heroIcon = 'auto-fix-high';
      auraColor = '#38bdf8';
    } else if (totalAgi >= 15 && totalAgi >= totalStr && totalAgi >= totalInt) {
      heroClass = 'Asesino Sombrío';
      heroIcon = 'flash-on';
      auraColor = '#10b981';
    }

    // Combat power calculation (-30% penalty if overencumbered)
    const rawPower = totalStr * 3 + totalAgi * 2 + totalInt * 3;
    const combatPower = isOverloaded ? Math.round(rawPower * 0.7) : rawPower;

    return {
      totalStr,
      totalAgi,
      totalInt,
      bonusStr,
      bonusAgi,
      bonusInt,
      totalWeight,
      maxWeightCapacity,
      isOverloaded,
      heroClass,
      heroIcon,
      auraColor,
      rawPower,
      combatPower,
      isDefeated: currentHp <= 0,
      encumbranceRatio,
    };
  }
);
