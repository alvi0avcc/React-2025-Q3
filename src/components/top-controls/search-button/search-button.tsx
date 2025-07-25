import { useEffect } from 'react';
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
  triggerSearch?: boolean;
}

export const SearchButton = ({
  searchQuery,
  onSearch,
  triggerSearch = false,
}: Props) => {
  const search = async () => {
    onSearch([], null, true);
    try {
      const results = await spacecraftsGet(searchQuery);
      onSearch(results, null, false);
    } catch (error) {
      console.error('API Error: ', error);
      onSearch(
        [],
        error instanceof Error ? error : new Error(String(error)),
        false
      );
    }
  };

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    if (triggerSearch) {
      search();
    }
  }, [triggerSearch]);

  return (
    <button className={styles.searchButton} onClick={search}>
      Search
    </button>
  );
};
