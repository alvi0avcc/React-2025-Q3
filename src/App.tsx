import { Component } from 'react';
import './App.css';
import { Wrapper } from './components/wrapper/wrapper';
import { TopControls } from './components/top-controls/top-controls';
import { Results } from './components/results/results';
import type { Spacecraft } from './types/types';
import type { ApiError } from './api/api';

import { ErrorBoundary } from '@/components/error-boundary/error-boundary';
import { ErrorButton } from '@/components/error-button/error-button';

type State = {
  searchResults: Spacecraft[];
  searchError: ApiError | null;
  isLoading: boolean;
};

class App extends Component {
  state: State = {
    searchResults: [],
    searchError: null,
    isLoading: false,
  };

  handleSearchResults = (
    spacecrafts: Spacecraft[],
    error: ApiError | null,
    isLoading: boolean
  ) => {
    this.setState({
      searchResults: spacecrafts,
      searchError: error,
      isLoading,
    });
  };

  render() {
    const { searchResults, searchError, isLoading } = this.state;

    return (
      <ErrorBoundary>
        <Wrapper>
          <h2>Star Trek API. Class-components</h2>

          <TopControls onSearchResults={this.handleSearchResults} />

          <Results
            spacecrafts={searchResults}
            error={searchError}
            isLoading={isLoading}
          />
          <ErrorButton />
        </Wrapper>
      </ErrorBoundary>
    );
  }
}

export default App;
