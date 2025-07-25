import { useState } from 'react';
import './App.css';
import { Wrapper } from './components/wrapper/wrapper';
import { TopControls } from './components/top-controls/top-controls';
import { Results } from './components/results/results';
import type { Spacecraft } from './types/types';
import type { ApiError } from './api/api';

import { ErrorBoundary } from '@/components/error-boundary/error-boundary';

type State = {
  searchResults: Spacecraft[];
  searchError: ApiError | null;
  isLoading: boolean;
};

const App = () => {
  const [state, setState] = useState<State>({
    searchResults: [],
    searchError: null,
    isLoading: false,
  });

  const handleSearchResults = (
    spacecrafts: Spacecraft[],
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
    <ErrorBoundary>
      <Wrapper>
        <h2>Star Trek API. Functional-components</h2>

        <TopControls onSearchResults={handleSearchResults} />

        <Results
          spacecrafts={searchResults}
          error={searchError}
          isLoading={isLoading}
        />
      </Wrapper>
    </ErrorBoundary>
  );
};

export default App;
