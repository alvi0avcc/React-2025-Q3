import styles from './search-button.module.css';

interface Props {
  isFetching: boolean;
  onSearch: () => void;
}

export const SearchButton = ({ isFetching, onSearch }: Props) => {
  return (
    <button
      className={styles.searchButton}
      disabled={isFetching}
      onClick={onSearch}
    >
      {isFetching ? 'Searching...' : 'Search'}
    </button>
  );
};
