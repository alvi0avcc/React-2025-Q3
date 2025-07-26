import { useState } from 'react';
import { TopControls } from '@/components/top-controls/top-controls';
import { Results } from '@/components/results/results';
import type { Spacecraft, SpacecraftsTotalInfo } from '@/types/types';
import type { ApiError } from '@/api/api';

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

  const handleSearchResults = (
    spacecrafts: Spacecraft[],
    info: SpacecraftsTotalInfo | undefined,
    error: ApiError | null,
    isLoading: boolean
  ) => {
    setState({
      searchResults: spacecrafts,
      searchError: error,
      isLoading,
    });
  };

  const { searchResults, searchError, isLoading } = state;

  return (
    <>
      <h2>Star Trek API. Functional-components</h2>

      <TopControls onSearchResults={handleSearchResults} />

      <Results
        spacecrafts={searchResults}
        error={searchError}
        isLoading={isLoading}
      />
    </>
  );
};

export default HomePage;
