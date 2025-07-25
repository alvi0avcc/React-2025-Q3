import { useState } from 'react';
import styles from './top-controls.module.css';
import { SearchInputField } from './search-input-field/search-input-field';
import { SearchButton } from './search-button/search-button';
import type { Spacecraft } from '@/types/types';
import { localStorageGet, type ApiError } from '@/api/api';

type Props = {
  onSearchResults: (
    spacecrafts: Spacecraft[],
    error: ApiError | null,
    isLoading: boolean
  ) => void;
};

export const TopControls = ({ onSearchResults }: Props) => {
  const [searchQuery, setSearchQuery] = useState(localStorageGet());

  const [triggerSearch, setTriggerSearch] = useState(false);

  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchRequest = () => {
    setTriggerSearch(prev => !prev);
  };

  return (
    <div className={styles.topControls}>
      <SearchInputField
        initialValue={searchQuery}
        onInputChange={handleSearchInputChange}
        onSearchRequest={handleSearchRequest}
      />

      <SearchButton
        searchQuery={searchQuery}
        onSearch={onSearchResults}
        triggerSearch={triggerSearch}
      />
    </div>
  );
};
