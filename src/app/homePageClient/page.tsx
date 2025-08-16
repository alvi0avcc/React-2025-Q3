'use client';

import { useState } from 'react';
import { TopControls } from '@/top-controls';
import { Results } from '@/results';
import type { Spacecraft, SpacecraftsTotalInfo } from '../../types/types';
import type { ApiError } from '../../api/api';
import { SelectedItemsPopUp } from '@/selectedItemsPopUp';
import { Provider } from 'react-redux';
import { store } from '@src/store';

type State = {
  searchResults: Spacecraft[];
  searchError: ApiError | null;
  isLoading: boolean;
};

type HomePageClientProps = {
  initialData?: {
    spacecraft: Spacecraft[];
    info?: SpacecraftsTotalInfo;
  };
};

const HomePage = ({ initialData }: HomePageClientProps) => {
  const [state, setState] = useState<State>({
    searchResults: initialData?.spacecraft || [],
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
    <Provider store={store}>
      <h2>Star Trek API. Functional-components</h2>

      <TopControls
        onSearchResults={handleSearchResults}
        spacecraftSelectedId={selectedId}
        initialData={initialData}
      />

      <Results
        spacecrafts={searchResults}
        error={searchError}
        isLoading={isLoading}
        onSpacecraftSelected={onSpacecraftSelected}
      />

      <SelectedItemsPopUp />
    </Provider>
  );
};

export default HomePage;
