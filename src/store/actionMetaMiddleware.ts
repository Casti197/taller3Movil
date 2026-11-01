import { Middleware, isAction } from '@reduxjs/toolkit';

export interface ActionLogMeta {
  logId: string;
  timestamp: string;
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

// Los reducers deben ser puros (sin Date.now ni Math.random).
// Este middleware sella cada acción con un id y hora ANTES de que llegue a los reducers,
// así actionLogSlice solo copia datos que ya vienen en la acción.
export const actionMetaMiddleware: Middleware = () => (next) => (action) => {
  if (!isAction(action)) return next(action);

  const now = new Date();
  const logMeta: ActionLogMeta = {
    logId: `act_${now.getTime()}_${Math.random().toString(36).substring(2, 5)}`,
    timestamp: formatTime(now),
  };
  const existingMeta = (action as { meta?: object }).meta;

  return next({ ...action, meta: { ...existingMeta, logMeta } });
};
