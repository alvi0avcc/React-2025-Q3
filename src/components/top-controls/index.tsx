'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './top-controls.module.css';
import { SearchInputField } from './search-input-field';
import { SearchButton } from './search-button';
import type {
  PaginationOptions,
  Spacecraft,
  SpacecraftsTotalInfo,
} from '@src/types/types';
import { type ApiError } from '@src/api/api';
import { Pagination } from './pagination';
import { defaultPagination } from '@src/const/const';
import {
  apiSlice,
  useGetSpacecraftsQuery,
  useLazyGetSpacecraftsQuery,
  useRefreshSpacecraftsMutation,
} from 'src/store/slice/apiSlice';
import { isApiError } from '@src/utils/valid';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { skipToken } from '@reduxjs/toolkit/query';

type Props = {
  onSearchResults: (
    spacecrafts: Spacecraft[],
    info: SpacecraftsTotalInfo | undefined,
    error: ApiError | null,
    isLoading: boolean
  ) => void;
  spacecraftSelectedId?: number | null;
  initialData?: {
    spacecraft: Spacecraft[];
    info?: SpacecraftsTotalInfo;
  };
};

export const TopControls = ({ onSearchResults, initialData }: Props) => {
  const [init, setInit] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);
  const searchQueryRef = useRef('');
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

  const { data, error, isFetching, refetch } = useGetSpacecraftsQuery(
    init
      ? skipToken
      : { searchQuery: searchQueryRef.current, options: pagination }
  );

  const [triggerSearch, { isFetching: isLazyFetching }] =
    useLazyGetSpacecraftsQuery();

  const [refreshSpacecrafts] = useRefreshSpacecraftsMutation();

  const updateURL = (newPagination: PaginationOptions, searchQuery: string) => {
    const params = new URLSearchParams();
    params.set('page', newPagination.pageNumber.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchRequest = () => {
    const newPagination = {
      pageNumber: defaultPagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    setPagination(newPagination);
    updateURL(newPagination, searchQueryRef.current);
    setInit(false);
    handleSearch();
  };

  const handleInputChange = (value: string) => {
    searchQueryRef.current = value;
  };

  const onPaginationChange = (newPagination: PaginationOptions) => {
    setPagination(newPagination);
    updateURL(newPagination, searchQueryRef.current);
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
      updateURL(defaultPagination, '');

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
  }, [isFetching]);

  useEffect(() => {
    handleSearch();
  }, [data, error, isFetching, isLazyFetching]);

  useEffect(() => {
    if (initialData) {
      onSearchResults(initialData.spacecraft, initialData.info, null, false);
      if (initialData.info?.totalPages) {
        setTotalPages(initialData.info.totalPages);
      }
    }
  }, [initialData]);

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

      {!init ? (
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
      ) : null}

      <Pagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalPages={totalPages}
      />
    </div>
  );
};
