import { createSlice, PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import { ActionLogEntry } from '../../types';

interface ActionLogState {
  history: ActionLogEntry[];
  lastActionId: string;
}

const initialState: ActionLogState = {
  history: [
    {
      id: 'init_1',
      type: '@@INIT/heroForgeStore',
      payloadStr: '{}',
      diff: 'STORE_READY',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      category: 'system',
    },
  ],
  lastActionId: 'init_1',
};

export const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  reducers: {
    recordAction: (
      state,
      action: PayloadAction<{
        type: string;
        payloadStr: string;
        diff: string;
        category?: 'stats' | 'inventory' | 'combat' | 'system';
      }>
    ) => {
      const { type, payloadStr, diff, category = 'system' } = action.payload;
      const entry: ActionLogEntry = {
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        type,
        payloadStr,
        diff,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        category,
      };
      state.history.unshift(entry);
      if (state.history.length > 20) {
        state.history.pop();
      }
      state.lastActionId = entry.id;
    },
    clearActionLog: (state) => {
      state.history = [];
    },
    resetActionLog: (state) => {
      state.history = initialState.history;
      state.lastActionId = 'init_1';
    },
  },
  extraReducers: (builder) => {
    // Automatically capture every action dispatched in other slices!
    builder.addMatcher(
      (action: UnknownAction) => {
        // Only capture actions that are not from actionLog slice itself or internal Redux init
        return (
          typeof action.type === 'string' &&
          !action.type.startsWith('actionLog/') &&
          !action.type.startsWith('@@redux')
        );
      },
      (state, action: UnknownAction & { payload?: unknown }) => {
        let diff = 'MUTATION';
        let category: 'stats' | 'inventory' | 'combat' | 'system' = 'system';

        if (action.type.startsWith('stats/')) {
          category = 'stats';
          if (action.type.includes('increment')) diff = 'STAT +1';
          else if (action.type.includes('decrement')) diff = 'STAT -1';
          else if (action.type.includes('takeDamage')) diff = 'DMG_REC';
          else if (action.type.includes('healHero')) diff = 'HEALED';
          else if (action.type.includes('applyBuildPreset')) diff = 'PRESET';
          else if (action.type.includes('resetStats')) diff = 'RESET';
        } else if (action.type.startsWith('inventory/')) {
          category = 'inventory';
          if (action.type.includes('toggleEquipItem')) diff = 'TOGGLE_EQUIP';
          else if (action.type.includes('clearEquipment')) diff = 'UNEQUIP_ALL';
          else if (action.type.includes('generateLoot')) diff = 'LOOT_SPAWN';
        } else if (action.type.startsWith('combat/')) {
          category = 'combat';
          diff = 'BOSS_HIT';
        }

        const payloadStr =
          action.payload !== undefined
            ? typeof action.payload === 'object'
              ? JSON.stringify(action.payload)
              : String(action.payload)
            : '{}';

        const entry: ActionLogEntry = {
          id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          type: action.type,
          payloadStr,
          diff,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          category,
        };

        state.history.unshift(entry);
        if (state.history.length > 20) {
          state.history.pop();
        }
        state.lastActionId = entry.id;
      }
    );
  },
});

export const { recordAction, clearActionLog, resetActionLog } = actionLogSlice.actions;

export default actionLogSlice.reducer;
