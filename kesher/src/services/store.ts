import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import userReducer from './slices/userSlice';
import healthReducer from './slices/healthSlice';
import buddyReducer from './slices/buddySlice';
import notificationsReducer from './slices/notificationsSlice';
import badgesReducer from './slices/badgesSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    user: userReducer,
    health: healthReducer,
    buddy: buddyReducer,
    notifications: notificationsReducer,
    badges: badgesReducer,
  },
  // Add middleware here if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 