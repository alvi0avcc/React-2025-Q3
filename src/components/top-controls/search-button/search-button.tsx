import { Component } from 'react';
import styles from './search-button.module.css';

import type { Spacecraft } from '@/utils/types';
import { isValidSpacecrafts } from '@/utils/valid';
import { baseUrl } from '@/utils/const';

interface Props {
  searchQuery: string;
  onSearch: (
    spacecrafts: Spacecraft[],
    errorAPI: string,
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

    const url = baseUrl;

    const params = new URLSearchParams();

    console.log('searchQuery = ', searchQuery);

    const searchQueryTrimmed = searchQuery.trim();

    params.append('name', searchQueryTrimmed);
    localStorage.setItem('searchQuery', searchQueryTrimmed);

    onSearch([], '', true);

    try {
      const response: Response = await fetch(`${url}?${params.toString()}`, {
        method: 'POST',
      });

      const data: unknown = await response.json();

      if (
        data !== null &&
        typeof data === 'object' &&
        'spacecrafts' in data &&
        Array.isArray(data.spacecrafts)
      ) {
        const resultsSpacecraft: Spacecraft[] = isValidSpacecrafts(
          data.spacecrafts
        )
          ? data.spacecrafts
          : [];

        onSearch(resultsSpacecraft, '', false);
      } else {
        onSearch([], 'Error loading data!', false);
      }
    } catch (error) {
      console.error('API Error: ', error);
      onSearch([], 'Error loading data!', false);
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
