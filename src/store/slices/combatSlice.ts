import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CombatState } from '../../types';

const BOSS_MAX_HP = 2500;

const initialState: CombatState = {
  bossHp: BOSS_MAX_HP,
  bossMaxHp: BOSS_MAX_HP,
  lastDamageDealt: 0,
  lastCombatFeedback: '',
};

export const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    dealBossDamage: (state, action: PayloadAction<{ damage: number; combatPower: number }>) => {
      const { damage, combatPower } = action.payload;
      if (state.bossHp <= 0) return;
      state.lastDamageDealt = damage;
      state.bossHp = Math.max(0, state.bossHp - damage);
      state.lastCombatFeedback =
        state.bossHp === 0
          ? `¡Boss derrotado! Golpe final de -${damage} DMG (${combatPower} CP)`
          : `¡Ataque ejecutado! -${damage} DMG infligidos (${combatPower} CP)`;
    },
    resetBoss: (state) => {
      state.bossHp = BOSS_MAX_HP;
      state.lastDamageDealt = 0;
      state.lastCombatFeedback = 'El Boss ha renacido con vitalidad completa.';
    },
  },
});

export const { dealBossDamage, resetBoss } = combatSlice.actions;

export default combatSlice.reducer;
