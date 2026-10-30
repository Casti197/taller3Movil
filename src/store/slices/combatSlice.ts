import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CombatState } from '../../types';

const initialState: CombatState = {
  bossHp: 2450,
  bossMaxHp: 2500,
  lastDamageDealt: 0,
  lastCombatFeedback: '',
};

export const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    dealBossDamage: (state, action: PayloadAction<{ damage: number; combatPower: number }>) => {
      const { damage, combatPower } = action.payload;
      state.lastDamageDealt = damage;
      state.bossHp = Math.max(0, state.bossHp - damage);
      state.lastCombatFeedback = `¡Ataque ejecutado! -${damage} DMG infligidos (${combatPower} CP)`;
    },
    resetBoss: (state) => {
      state.bossHp = 2500;
      state.lastDamageDealt = 0;
      state.lastCombatFeedback = 'El Boss ha renacido con vitalidad completa.';
    },
  },
});

export const { dealBossDamage, resetBoss } = combatSlice.actions;

export default combatSlice.reducer;
