import { Component } from 'react';
import styles from './search-button.module.css';

import type { Spacecraft } from '@/types/types';
import { spacecraftsGet } from '@/api/api';

interface Props {
  searchQuery: string;
  onSearch: (
    spacecrafts: Spacecraft[],
    error: Error | null,
    isLoading: boolean
  ) => void;
}

export class SearchButton extends Component<Props> {
  componentDidMount(): void {
    this.handleClick();
  }

  performSearch = () => {
    this.handleClick();
  };

  handleClick = async () => {
    const { searchQuery, onSearch } = this.props;

    onSearch([], null, true);

    try {
      onSearch(await spacecraftsGet(searchQuery), null, false);
    } catch (error) {
      console.error('API Error: ', error);
      onSearch(
        [],
        error instanceof Error ? error : new Error(String(error)),
        false
      );
    }
  };

  render() {
    return (
      <button className={styles.searchButton} onClick={this.handleClick}>
        Search
      </button>
    );
  }
}
