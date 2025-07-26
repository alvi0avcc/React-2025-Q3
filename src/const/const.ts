import type { PaginationOptions } from '@/types/types';

export const baseUrl = 'https://stapi.co/api/v2/rest/spacecraft/search';
export const localStorageKey = 'searchQuery';
export const defaultPagination: PaginationOptions = {
  pageNumber: 1,
  pageSize: 25,
} as const;
export const delayBetweenRequests = 50; //ms
