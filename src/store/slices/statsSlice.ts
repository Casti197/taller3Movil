import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatsState, StatKey, BuildPreset } from '../../types';

const initialState: StatsState = {
  availablePoints: 15,
  str: 5,
  agi: 5,
  int: 5,
  currentHp: 100,
  maxHp: 100,
  currentMp: 85,
  maxMp: 100,
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
      if (state[stat] > 5) {
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
    },
    applyBuildPreset: (state, action: PayloadAction<BuildPreset>) => {
      // Base stats = 5 each. 10 points are invested into the archetype's specialty
      state.str = 5;
      state.agi = 5;
      state.int = 5;
      state.availablePoints = 5; // 15 total minus 10 allocated

      switch (action.payload) {
        case 'WARRIOR':
          state.str = 15;
          break;
        case 'MAGE':
          state.int = 15;
          break;
        case 'ROGUE':
          state.agi = 15;
          break;
      }
    },
    resetStats: (state) => {
      state.str = 5;
      state.agi = 5;
      state.int = 5;
      state.availablePoints = 15;
      state.currentHp = 100;
      state.currentMp = 85;
    },
  },
});

export const {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
} = statsSlice.actions;

export default statsSlice.reducer;
