import { useEffect, useRef, useState } from 'react';
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
import { useGetSpacecraftsQuery } from '@/store/slice/apiSlice';
import { isApiError } from '@/utils/valid';

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
  const [storedSearchQuery, setStoredSearchQuery] = useLocalStorage();
  const searchQueryRef = useRef(storedSearchQuery);

  const initPagination: PaginationOptions = {
    pageNumber: Number.parseInt(
      searchParams.get('page') || `${defaultPagination.pageNumber}`
    ),
    pageSize: Number.parseInt(
      searchParams.get('size') || `${defaultPagination.pageSize}`
    ),
  };

  const [pagination, setPagination] = useState(initPagination);

  const { data, error, isFetching } = useGetSpacecraftsQuery({
    searchQuery: searchQueryRef.current,
    options: pagination,
  });

  const handleSearchRequest = () => {
    setPagination({
      pageNumber: defaultPagination.pageNumber,
      pageSize: pagination.pageSize,
    });
    setStoredSearchQuery(searchQueryRef.current);
    handleSearch();
  };

  const handleInputChange = (value: string) => {
    searchQueryRef.current = value;
  };

  const onPaginationChange = (newPagination: PaginationOptions) => {
    setPagination(newPagination);
  };

  const handleSearch = () => {
    onSearchResults(
      data?.spacecraft || [],
      data?.info,
      error && isApiError(error) ? error : null,
      isFetching
    );

    if (!error && data?.info) {
      setTotalPages(data?.info.totalPages);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', `${pagination.pageNumber}`);
    if (
      typeof spacecraftSelectedId === 'number' &&
      Number.isInteger(spacecraftSelectedId) &&
      spacecraftSelectedId >= 0
    ) {
      params.set('id', `${spacecraftSelectedId}`);
      void navigate(`/details?${params.toString()}`, { replace: true });
    } else {
      void navigate(`/?${params.toString()}`, { replace: true });
    }
  }, [pagination, setSearchParams, spacecraftSelectedId]);

  useEffect(() => {
    handleSearch();
  }, [data, error, isFetching]);

  return (
    <div className={styles.topControls}>
      <section className={styles.search}>
        <SearchInputField
          initialValue={searchQueryRef.current}
          onInputChange={handleInputChange}
          onSearchRequest={handleSearchRequest}
        />

        <SearchButton isFetching={isFetching} onSearch={handleSearch} />
      </section>

      <Pagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalPages={totalPages}
      />
    </div>
  );
};
