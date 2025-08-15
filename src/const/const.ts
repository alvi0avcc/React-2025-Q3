import type { PaginationOptions } from '@src/types/types';

export const baseUrl = 'https://stapi.co/api/v2/rest/spacecraft/search';
export const localStorageKey = 'searchQuery';
export const defaultPagination: PaginationOptions = {
  pageNumber: 1,
  pageSize: 25,
} as const;
export const delayBetweenRequestsMsec = 50;

export const keepUnusedDataForSec = 60;
