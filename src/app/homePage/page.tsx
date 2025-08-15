'use client';

import { useState } from 'react';
import { TopControls } from '@/top-controls';
import { Results } from '@/results';
import type { Spacecraft, SpacecraftsTotalInfo } from '../../types/types';
import type { ApiError } from '../../api/api';
import { SelectedItemsPopUp } from '@/selectedItemsPopUp';

type State = {
  searchResults: Spacecraft[];
  searchError: ApiError | null;
  isLoading: boolean;
};

const HomePage = () => {
  const [state, setState] = useState<State>({
    searchResults: [],
    searchError: null,
    isLoading: false,
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSearchResults = (
    spacecrafts: Spacecraft[],
    _info: SpacecraftsTotalInfo | undefined,
    error: ApiError | null,
    isLoading: boolean
  ) => {
    setState({
      searchResults: spacecrafts,
      searchError: error,
      isLoading,
    });
  };

  const onSpacecraftSelected = (id: number) => {
    setSelectedId(id);
  };

  const { searchResults, searchError, isLoading } = state;

  return (
    <>
      <h2>Star Trek API. Functional-components</h2>

      <TopControls
        onSearchResults={handleSearchResults}
        spacecraftSelectedId={selectedId}
      />

      <Results
        spacecrafts={searchResults}
        error={searchError}
        isLoading={isLoading}
        onSpacecraftSelected={onSpacecraftSelected}
      />

      <SelectedItemsPopUp />
    </>
  );
};

export default HomePage;
