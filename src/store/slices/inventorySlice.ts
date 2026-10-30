import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryState, InventoryItem } from '../../types';

const initialCatalog: InventoryItem[] = [
  {
    id: 'item_sword',
    name: 'Espada de Fuego',
    icon: 'local-fire-department',
    category: 'weapons',
    bonusStr: 8,
    bonusAgi: 0,
    bonusInt: 0,
    weight: 12,
    rarity: 'Raro',
    slot: 'Mano P.',
  },
  {
    id: 'item_shield',
    name: 'Escudo de Titanio',
    icon: 'shield',
    category: 'shields',
    bonusStr: 10,
    bonusAgi: 0,
    bonusInt: 0,
    weight: 22,
    rarity: 'Legendario',
    slot: 'Mano S.',
  },
  {
    id: 'item_staff',
    name: 'Báculo Arcano',
    icon: 'auto-fix-high',
    category: 'weapons',
    bonusStr: 0,
    bonusAgi: 0,
    bonusInt: 12,
    weight: 4,
    rarity: 'Raro',
    slot: 'Mano P.',
  },
  {
    id: 'item_boots',
    name: 'Botas Élficas',
    icon: 'directions-walk',
    category: 'armor',
    bonusStr: 0,
    bonusAgi: 9,
    bonusInt: 0,
    weight: 2,
    rarity: 'Raro',
    slot: 'Botas',
  },
  {
    id: 'item_armor',
    name: 'Armadura Maldita',
    icon: 'shield',
    category: 'armor',
    bonusStr: 15,
    bonusAgi: 0,
    bonusInt: 0,
    weight: 35,
    rarity: 'Legendario',
    slot: 'Pecho',
  },
  {
    id: 'item_daggers',
    name: 'Dagas Gemelas',
    icon: 'flash-on',
    category: 'weapons',
    bonusStr: 0,
    bonusAgi: 7,
    bonusInt: 0,
    weight: 3,
    rarity: 'Común',
    slot: 'Mano P.',
  },
  {
    id: 'item_relic',
    name: 'Ojo del Vacío Arcano',
    icon: 'visibility',
    category: 'relics',
    bonusStr: 0,
    bonusAgi: 0,
    bonusInt: 14,
    weight: 2,
    rarity: 'Común',
    slot: 'Reliquia',
  },
];

const initialState: InventoryState = {
  catalog: initialCatalog,
  equippedIds: [],
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    toggleEquipItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.equippedIds.indexOf(itemId);
      if (index >= 0) {
        state.equippedIds.splice(index, 1);
      } else {
        state.equippedIds.push(itemId);
      }
    },
    clearEquipment: (state) => {
      state.equippedIds = [];
    },
    generateLoot: (state) => {
      const randomSuffix = Math.floor(Math.random() * 900 + 100);
      const isHeavy = Math.random() > 0.5;
      const newItem: InventoryItem = {
        id: `loot_${Date.now()}`,
        name: `Reliquia Ancestral #${randomSuffix}`,
        icon: 'auto-awesome',
        category: 'relics',
        bonusStr: isHeavy ? 6 : 0,
        bonusAgi: !isHeavy ? 5 : 0,
        bonusInt: 8,
        weight: isHeavy ? 14 : 3,
        rarity: isHeavy ? 'Legendario' : 'Raro',
        slot: 'Reliquia',
      };
      state.catalog.unshift(newItem);
    },
    resetInventory: (state) => {
      state.catalog = initialCatalog;
      state.equippedIds = [];
    },
  },
});

export const {
  toggleEquipItem,
  clearEquipment,
  generateLoot,
  resetInventory,
} = inventorySlice.actions;

export default inventorySlice.reducer;
