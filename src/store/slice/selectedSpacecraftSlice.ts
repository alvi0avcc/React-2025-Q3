import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Spacecraft } from '@src/types/types';

export interface SelectedSpacecraftState {
  selectedItems: Spacecraft[];
  selectedIds: string[];
}

const initialState: SelectedSpacecraftState = {
  selectedItems: [],
  selectedIds: [],
};

export const selectedSpacecraftSlice = createSlice({
  name: 'selectedSpacecraft',
  initialState,
  reducers: {
    toggleSpacecraft: (state, action: PayloadAction<Spacecraft>) => {
      const spacecraft = action.payload;
      const index = state.selectedIds.indexOf(spacecraft.uid);

      if (index !== -1) {
        state.selectedItems.splice(index, 1);
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedItems.push(spacecraft);
        state.selectedIds.push(spacecraft.uid);
      }
    },
    clearSelected: state => {
      state.selectedItems = [];
      state.selectedIds = [];
    },
  },
});

export const { toggleSpacecraft, clearSelected } =
  selectedSpacecraftSlice.actions;
export default selectedSpacecraftSlice.reducer;
