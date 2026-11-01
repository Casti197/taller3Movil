import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatsState, StatKey, BuildPreset } from '../../types';

const BASE_STAT = 5;
const SKILL_POINTS = 15;
const MIN_STAT = 1;

const initialState: StatsState = {
  availablePoints: SKILL_POINTS,
  str: BASE_STAT,
  agi: BASE_STAT,
  int: BASE_STAT,
  currentHp: 100,
  maxHp: 100,
  mpSpent: 0,
};

// Cada preset reparte el total del pool (3 × 5 base + 15 puntos = 30) en un solo dispatch
const PRESETS: Record<BuildPreset, Record<StatKey, number>> = {
  WARRIOR: { str: 18, agi: 7, int: 5 },
  MAGE: { str: 5, agi: 7, int: 18 },
  ROGUE: { str: 7, agi: 18, int: 5 },
};

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat: (state, action: PayloadAction<StatKey>) => {
      const stat = action.payload;
      if (state.availablePoints > 0) {
        state[stat] += 1;
        state.availablePoints -= 1;
      }
    },
    decrementStat: (state, action: PayloadAction<StatKey>) => {
      const stat = action.payload;
      // Ningún atributo base puede bajar de 1
      if (state[stat] > MIN_STAT) {
        state[stat] -= 1;
        state.availablePoints += 1;
      }
    },
    takeDamage: (state, action: PayloadAction<number>) => {
      const damage = Math.max(0, action.payload);
      state.currentHp = Math.max(0, state.currentHp - damage);
    },
    healHero: (state, action: PayloadAction<number | undefined>) => {
      const healAmount = action.payload ?? state.maxHp;
      state.currentHp = Math.min(state.maxHp, state.currentHp + healAmount);
      state.mpSpent = 0;
    },
    spendMana: (state, action: PayloadAction<number>) => {
      state.mpSpent += Math.max(0, action.payload);
    },
    applyBuildPreset: (state, action: PayloadAction<BuildPreset>) => {
      const build = PRESETS[action.payload];
      state.str = build.str;
      state.agi = build.agi;
      state.int = build.int;
      state.availablePoints = 0;
    },
    resetStats: (state) => {
      state.str = BASE_STAT;
      state.agi = BASE_STAT;
      state.int = BASE_STAT;
      state.availablePoints = SKILL_POINTS;
      state.currentHp = state.maxHp;
      state.mpSpent = 0;
    },
  },
});

export const {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  spendMana,
  applyBuildPreset,
  resetStats,
} = statsSlice.actions;

export default statsSlice.reducer;
