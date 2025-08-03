import { describe, it, expect, beforeEach } from 'vitest';
import {
  toggleSpacecraft,
  clearSelected,
  type SelectedSpacecraftState,
  selectedSpacecraftSlice,
} from '@/store/slice/selectedSpacecraftSlice';
import type { Spacecraft } from '@/types/types';

describe('selectedSpacecraftSlice', () => {
  const mockSpacecraft: Spacecraft = {
    uid: '1',
    name: 'Enterprise',
    spacecraftClass: {
      name: 'Constitution',
      uid: '',
    },
    status: 'Active',
    registry: 'NCC-1701',
    species: 'Human',
  };

  const mockInitialState: SelectedSpacecraftState = {
    selectedItems: [],
    selectedIds: [],
  };

  let state: SelectedSpacecraftState;

  beforeEach(() => {
    state = { ...mockInitialState };
  });

  describe('toggleSpacecraft', () => {
    it('should add spacecraft when not selected', () => {
      const result = selectedSpacecraftSlice.reducer(
        state,
        toggleSpacecraft(mockSpacecraft)
      );

      expect(result.selectedItems).toHaveLength(1);
      expect(result.selectedItems[0]).toEqual(mockSpacecraft);
      expect(result.selectedIds).toEqual([mockSpacecraft.uid]);
    });

    it('should remove spacecraft when already selected', () => {
      state = selectedSpacecraftSlice.reducer(
        state,
        toggleSpacecraft(mockSpacecraft)
      );

      const result = selectedSpacecraftSlice.reducer(
        state,
        toggleSpacecraft(mockSpacecraft)
      );

      expect(result.selectedItems).toHaveLength(0);
      expect(result.selectedIds).toHaveLength(0);
    });

    it('should maintain order of selected items', () => {
      const secondSpacecraft: Spacecraft = {
        ...mockSpacecraft,
        uid: '2',
        name: 'Voyager',
      };

      state = selectedSpacecraftSlice.reducer(
        state,
        toggleSpacecraft(mockSpacecraft)
      );

      state = selectedSpacecraftSlice.reducer(
        state,
        toggleSpacecraft(secondSpacecraft)
      );

      expect(state.selectedItems).toHaveLength(2);
      expect(state.selectedIds).toEqual(['1', '2']);

      state = selectedSpacecraftSlice.reducer(
        state,
        toggleSpacecraft(mockSpacecraft)
      );

      expect(state.selectedItems).toHaveLength(1);
      expect(state.selectedItems[0]).toEqual(secondSpacecraft);
      expect(state.selectedIds).toEqual(['2']);
    });
  });

  describe('clearSelected', () => {
    it('should clear all selected spacecraft', () => {
      state = selectedSpacecraftSlice.reducer(
        state,
        toggleSpacecraft(mockSpacecraft)
      );

      const secondSpacecraft: Spacecraft = {
        ...mockSpacecraft,
        uid: '2',
        name: 'Voyager',
      };

      state = selectedSpacecraftSlice.reducer(
        state,
        toggleSpacecraft(secondSpacecraft)
      );

      const result = selectedSpacecraftSlice.reducer(state, clearSelected());

      expect(result.selectedItems).toHaveLength(0);
      expect(result.selectedIds).toHaveLength(0);
    });

    it('should work when no items are selected', () => {
      const result = selectedSpacecraftSlice.reducer(state, clearSelected());

      expect(result.selectedItems).toHaveLength(0);
      expect(result.selectedIds).toHaveLength(0);
    });
  });

  describe('action creators', () => {
    it('should create toggleSpacecraft action with payload', () => {
      const action = toggleSpacecraft(mockSpacecraft);
      expect(action.type).toBe('selectedSpacecraft/toggleSpacecraft');
      expect(action.payload).toEqual(mockSpacecraft);
    });

    it('should create clearSelected action without payload', () => {
      const action = clearSelected();
      expect(action.type).toBe('selectedSpacecraft/clearSelected');
      expect(action.payload).toBeUndefined();
    });
  });
});
