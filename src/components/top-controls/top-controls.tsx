import { Component } from 'react';
import styles from './top-controls.module.css';
import { SearchInputField } from './search-input-field/search-input-field';
import { SearchButton } from './search-button/search-button';
import React from 'react';
import type { Spacecraft } from '@/types/types';

type Props = {
  onSearchResults: (
    spacecrafts: Spacecraft[],
    error: Error | null,
    isLoading: boolean
  ) => void;
};

type State = {
  searchQuery: string;
};

export class TopControls extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchQuery: localStorage.getItem('searchQuery') || '',
    };
  }

  private searchButtonRef = React.createRef<SearchButton>();

  handleSearchInputChange = (query: string) => {
    this.setState({ searchQuery: query });
  };

  handleSearchRequest = () => {
    if (this.searchButtonRef.current) {
      this.searchButtonRef.current.performSearch();
    }
  };

  render() {
    return (
      <div className={styles.topControls}>
        <SearchInputField
          initialValue={this.state.searchQuery}
          onInputChange={this.handleSearchInputChange}
          onSearchRequest={this.handleSearchRequest}
        />

        <SearchButton
          ref={this.searchButtonRef}
          searchQuery={this.state.searchQuery}
          onSearch={this.props.onSearchResults}
        />
      </div>
    );
  }
}
