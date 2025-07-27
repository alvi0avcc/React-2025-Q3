import { useEffect } from 'react';
import styles from './search-button.module.css';

import type {
  PaginationOptions,
  Spacecraft,
  SpacecraftsTotalInfo,
} from '@/types/types';

import { buildSearchParams, spacecraftsGet } from '@/api/api';

interface Props {
  searchQuery: string;
  pagination: PaginationOptions;
  onSearch: (
    spacecrafts: Spacecraft[],
    info: SpacecraftsTotalInfo | undefined,
    error: Error | null,
    isLoading: boolean
  ) => void;
  triggerSearch?: boolean;
}

export const SearchButton = ({
  searchQuery,
  pagination,
  onSearch,
  triggerSearch = false,
}: Props) => {
  const search = async () => {
    onSearch([], undefined, null, true);
    try {
      const results = await spacecraftsGet(
        buildSearchParams(searchQuery, pagination)
      );
      onSearch(results.spacecraft, results.info, null, false);
    } catch (error) {
      console.error('API Error:', error);
      onSearch(
        [],
        undefined,
        error instanceof Error ? error : new Error(String(error)),
        false
      );
    }
  };

  useEffect(() => {
    void search();
  }, []);

  useEffect(() => {
    void search();
  }, [triggerSearch]);

  return (
    <button className={styles.searchButton} onClick={search}>
      Search
    </button>
  );
};
