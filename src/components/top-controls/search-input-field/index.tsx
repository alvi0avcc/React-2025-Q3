import React, { useState } from 'react';
import styles from './search-input-field.module.css';

type Props = {
  initialValue?: string;
  onInputChange: (query: string) => void;
  onSearchRequest: () => void;
};

export const SearchInputField = ({
  initialValue = '',
  onInputChange,
  onSearchRequest,
}: Props) => {
  const [searchValue, SetSearchValue] = useState(initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    SetSearchValue(e.target.value);
    onInputChange(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchRequest();
    }
  };

  return (
    <input
      className={styles.searchInputField}
      value={searchValue}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      placeholder="Enter the ship name..."
    />
  );
};
