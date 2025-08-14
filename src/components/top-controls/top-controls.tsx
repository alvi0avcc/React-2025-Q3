'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './top-controls.module.css';
import { SearchInputField } from './search-input-field/search-input-field';
import { SearchButton } from './search-button/search-button';
import type {
  PaginationOptions,
  Spacecraft,
  SpacecraftsTotalInfo,
} from '@src/types/types';
import { type ApiError } from '@src/api/api';
import { Pagination } from './pagination/pagination';
import { defaultPagination } from '@src/const/const';
// import { useNavigate, useSearchParams } from 'react-router';
import { useLocalStorage } from '@src/hooks/useLocalStorage';
import {
  apiSlice,
  useGetSpacecraftsQuery,
  useLazyGetSpacecraftsQuery,
  useRefreshSpacecraftsMutation,
} from 'src/store/slice/apiSlice';
import { isApiError } from '@src/utils/valid';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
  // spacecraftSelectedId,
}: Props) => {
  // const navigate = useNavigate();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);
  // const [searchParams, setSearchParams] = useSearchParams();
  const [storedSearchQuery, setStoredSearchQuery] = useLocalStorage();
  const searchQueryRef = useRef(storedSearchQuery);
  const [dataSource, setDataSource] = useState<boolean | null>(null);

  const dispatch = useDispatch();

  const initPagination: PaginationOptions = {
    pageNumber: Number.parseInt(
      searchParams.get('page') || `${defaultPagination.pageNumber}`
    ),
    pageSize: Number.parseInt(
      searchParams.get('size') || `${defaultPagination.pageSize}`
    ),
  };

  const [pagination, setPagination] = useState(initPagination);

  const { data, error, isFetching, refetch } = useGetSpacecraftsQuery({
    searchQuery: searchQueryRef.current,
    options: pagination,
  });

  const [triggerSearch, { isFetching: isLazyFetching }] =
    useLazyGetSpacecraftsQuery();

  const [refreshSpacecrafts] = useRefreshSpacecraftsMutation();

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

  const handleManualRefresh = async () => {
    try {
      await refreshSpacecrafts();
      void refetch();
      setDataSource(true);
    } catch (error_) {
      console.error('Refresh failed:', error_);
    }
  };

  const handleFullReset = async () => {
    try {
      dispatch(apiSlice.util.resetApiState());
      setPagination(defaultPagination);
      searchQueryRef.current = '';
      setStoredSearchQuery('');

      const params = new URLSearchParams();
      params.set('page', defaultPagination.pageNumber.toString());
      params.set('size', defaultPagination.pageSize.toString());
      router.push(`${pathname}?${params.toString()}`);
      // void navigate('/', { replace: true });

      await triggerSearch({
        searchQuery: '',
        options: defaultPagination,
      });
    } catch (error_) {
      console.error('Cache reset failed:', error_);
    }
  };

  const handleSearch = () => {
    const isLoading = isFetching || isLazyFetching;

    onSearchResults(
      data?.spacecraft || [],
      data?.info,
      error && isApiError(error) ? error : null,
      isLoading
    );

    if (!error && data?.info) {
      setTotalPages(data?.info.totalPages);
    }
  };

  useEffect(() => {
    setDataSource(isFetching);

    // const params = new URLSearchParams();
    // params.set('page', `${pagination.pageNumber}`);
    // if (
    //   typeof spacecraftSelectedId === 'number' &&
    //   Number.isInteger(spacecraftSelectedId) &&
    //   spacecraftSelectedId >= 0
    // ) {
    //   params.set('id', `${spacecraftSelectedId}`);
    //   void navigate(`/details?${params.toString()}`, { replace: true });
    // } else {
    //   void navigate(`/?${params.toString()}`, { replace: true });
    // }
    // }, [pagination, setSearchParams, spacecraftSelectedId]);
  }, [isFetching]);

  useEffect(() => {
    handleSearch();
  }, [data, error, isFetching, isLazyFetching]);

  return (
    <div className={styles.topControls}>
      <section className={styles.search}>
        <SearchInputField
          initialValue={searchQueryRef.current}
          onInputChange={handleInputChange}
          onSearchRequest={handleSearchRequest}
        />
        <SearchButton
          isFetching={isFetching || isLazyFetching}
          onSearch={handleSearchRequest}
        />
      </section>

      <fieldset className={styles.refresh}>
        <legend>{dataSource ? 'Fresh data' : 'Cached data'}</legend>
        <button
          onClick={handleManualRefresh}
          disabled={isFetching || isLazyFetching}
          className={styles.refreshButton}
        >
          Refresh Current Page
        </button>

        <button
          onClick={handleFullReset}
          disabled={isFetching || isLazyFetching}
          className={styles.resetButton}
        >
          Reset All Cache
        </button>
      </fieldset>

      <Pagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalPages={totalPages}
      />
    </div>
  );
};
