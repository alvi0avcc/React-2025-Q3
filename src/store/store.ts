import { configureStore } from '@reduxjs/toolkit';
import selectedSpacecraftReducer from './slice/selectedSpacecraftSlice';

export const store = configureStore({
  reducer: {
    selectedSpacecraft: selectedSpacecraftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
