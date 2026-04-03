import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./features/movieSlice";
import tvShowReducer from "./features/tvShowSlice";

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    tvShows: tvShowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
