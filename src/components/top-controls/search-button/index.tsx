import styles from './search-button.module.css';
import { useTranslations } from 'next-intl';

interface Props {
  isFetching: boolean;
  onSearch: () => void;
}

export const SearchButton = ({ isFetching, onSearch }: Props) => {
  const t = useTranslations('SearchButton');
  return (
    <button
      className={styles.searchButton}
      disabled={isFetching}
      onClick={onSearch}
    >
      {isFetching ? t('searching') : t('search')}
    </button>
  );
};
