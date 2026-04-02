import { configureStore } from '@reduxjs/toolkit';
import viewModeReducer from './features/viewModeSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      viewMode: viewModeReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];