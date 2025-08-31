import { useState, useCallback } from 'react';
import styles from './searchBar.module.css';

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
}

export const SearchBar = ({ onSearchChange }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      onSearchChange(value);
    },
    [onSearchChange]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search countries..."
        className={styles.searchInput}
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};
