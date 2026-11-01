import { createSlice, PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import { ActionLogEntry } from '../../types';
import { ActionLogMeta } from '../actionMetaMiddleware';

const MAX_HISTORY = 20;

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

type LoggedAction = UnknownAction & { payload?: unknown; meta?: { logMeta?: ActionLogMeta } };

// El id y la hora llegan en action.meta (los pone actionMetaMiddleware) -> reducer puro
const readLogMeta = (action: LoggedAction): ActionLogMeta =>
  action.meta?.logMeta ?? { logId: `act_${action.type}`, timestamp: '--:--:--' };

const pushEntry = (state: ActionLogState, entry: ActionLogEntry) => {
  state.history.unshift(entry);
  if (state.history.length > MAX_HISTORY) {
    state.history.pop();
  }
  state.lastActionId = entry.id;
};

const describeAction = (type: string) => {
  let diff = 'MUTATION';
  let category: ActionLogEntry['category'] = 'system';

  if (type.startsWith('stats/')) {
    category = 'stats';
    if (type.includes('increment')) diff = 'STAT +1';
    else if (type.includes('decrement')) diff = 'STAT -1';
    else if (type.includes('takeDamage')) diff = 'DMG_REC';
    else if (type.includes('healHero')) diff = 'HEALED';
    else if (type.includes('spendMana')) diff = 'MP_USED';
    else if (type.includes('applyBuildPreset')) diff = 'PRESET';
    else if (type.includes('resetStats')) diff = 'RESET';
  } else if (type.startsWith('inventory/')) {
    category = 'inventory';
    if (type.includes('toggleEquipItem')) diff = 'TOGGLE_EQUIP';
    else if (type.includes('clearEquipment')) diff = 'UNEQUIP_ALL';
  } else if (type.startsWith('combat/')) {
    category = 'combat';
    diff = type.includes('resetBoss') ? 'BOSS_RESET' : 'BOSS_HIT';
  }

  return { diff, category };
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
        category?: ActionLogEntry['category'];
      }>
    ) => {
      const { type, payloadStr, diff, category = 'system' } = action.payload;
      const { logId, timestamp } = readLogMeta(action as LoggedAction);
      pushEntry(state, { id: logId, type, payloadStr, diff, timestamp, category });
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
    // Captura automáticamente cada acción despachada por los otros slices
    builder.addMatcher(
      (action: UnknownAction) =>
        typeof action.type === 'string' &&
        !action.type.startsWith('actionLog/') &&
        !action.type.startsWith('@@redux'),
      (state, action: LoggedAction) => {
        const { diff, category } = describeAction(action.type);
        const { logId, timestamp } = readLogMeta(action);

        const payloadStr =
          action.payload !== undefined
            ? typeof action.payload === 'object'
              ? JSON.stringify(action.payload)
              : String(action.payload)
            : '{}';

        pushEntry(state, { id: logId, type: action.type, payloadStr, diff, timestamp, category });
      }
    );
  },
});

export const { recordAction, clearActionLog, resetActionLog } = actionLogSlice.actions;

export default actionLogSlice.reducer;
