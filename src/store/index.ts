import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import statsReducer, { resetStats } from './slices/statsSlice';
import inventoryReducer, { resetInventory } from './slices/inventorySlice';
import combatReducer, { resetBoss } from './slices/combatSlice';
import actionLogReducer, { resetActionLog } from './slices/actionLogSlice';

const rootReducer = combineReducers({
  stats: statsReducer,
  inventory: inventoryReducer,
  combat: combatReducer,
  actionLog: actionLogReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed Custom Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Global Store Reset Helper
export const resetHeroForgeStore = () => (dispatch: AppDispatch) => {
  dispatch(resetStats());
  dispatch(resetInventory());
  dispatch(resetBoss());
  dispatch(resetActionLog());
};
