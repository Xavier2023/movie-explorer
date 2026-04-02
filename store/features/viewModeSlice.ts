import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ViewMode = 'grid' | 'list';

interface ViewModeState {
  mode: ViewMode;
}

const initialState: ViewModeState = {
  mode: 'grid',
};

const viewModeSlice = createSlice({
  name: 'viewMode',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setViewMode } = viewModeSlice.actions;
export default viewModeSlice.reducer;