import { useEffect, useState } from 'react';
import styles from './top-controls.module.css';
import { SearchInputField } from './search-input-field/search-input-field';
import { SearchButton } from './search-button/search-button';
import type {
  PaginationOptions,
  Spacecraft,
  SpacecraftsTotalInfo,
} from '@/types/types';
import { type ApiError } from '@/api/api';
import { Pagination } from './pagination/pagination';
import { defaultPagination } from '@/const/const';
import { useNavigate, useSearchParams } from 'react-router';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Props = {
  onSearchResults: (
    spacecrafts: Spacecraft[],
    info: SpacecraftsTotalInfo | undefined,
    error: ApiError | null,
    isLoading: boolean
  ) => void;
  spacecraftSelectedId?: number | null;
};

export const TopControls = ({
  onSearchResults,
  spacecraftSelectedId,
}: Props) => {
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useLocalStorage();

  const initPagination: PaginationOptions = {
    pageNumber: Number.parseInt(
      searchParams.get('page') || `${defaultPagination.pageNumber}`
    ),
    pageSize: Number.parseInt(
      searchParams.get('size') || `${defaultPagination.pageSize}`
    ),
  };

  const [pagination, setPagination] = useState(initPagination);

  const [triggerSearch, setTriggerSearch] = useState(false);

  const handleSearchRequest = () => {
    setPagination({
      pageNumber: defaultPagination.pageNumber,
      pageSize: pagination.pageSize,
    });
    setTriggerSearch(prev => !prev);
  };

  const handleSearchResults = (
    spacecrafts: Spacecraft[],
    info: SpacecraftsTotalInfo | undefined,
    error: ApiError | null,
    isLoading: boolean
  ) => {
    onSearchResults(spacecrafts, info, error, isLoading);

    if (!error && info) {
      setTotalPages(info.totalPages);
    }
  };

  const onPaginationChange = (newPagination: PaginationOptions) => {
    setPagination(newPagination);
    setTriggerSearch(prev => !prev);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', `${pagination.pageNumber}`);
    if (spacecraftSelectedId && spacecraftSelectedId > 0) {
      params.set('id', `${spacecraftSelectedId}`);
      void navigate(`/details?${params.toString()}`, { replace: true });
    } else {
      void navigate(`/?${params.toString()}`, { replace: true });
    }
  }, [pagination, setSearchParams, spacecraftSelectedId]);

  return (
    <div className={styles.topControls}>
      <section className={styles.search}>
        <SearchInputField
          initialValue={searchQuery}
          onInputChange={setSearchQuery}
          onSearchRequest={handleSearchRequest}
        />

        <SearchButton
          searchQuery={searchQuery}
          pagination={pagination}
          onSearch={handleSearchResults}
          triggerSearch={triggerSearch}
        />
      </section>

      <Pagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalPages={totalPages}
      />
    </div>
  );
};
