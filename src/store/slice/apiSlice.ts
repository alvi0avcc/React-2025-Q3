import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PaginationOptions,
  Spacecraft,
  SpacecraftsTotalInfo,
} from '@/types/types';
import { baseUrl, defaultPagination } from '@/const/const';
import { isValidSpacecrafts, isSpacecraftsTotalInfo } from '@/utils/valid';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: builder => ({
    getSpacecrafts: builder.query<
      { spacecraft: Spacecraft[]; info?: SpacecraftsTotalInfo },
      { searchQuery: string; options?: PaginationOptions }
    >({
      query: ({ searchQuery, options = defaultPagination }) => ({
        url: '',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: searchQuery.trim(),
          pageNumber: `${options.pageNumber || defaultPagination.pageNumber}`,
          pageSize: `${options.pageSize || defaultPagination.pageSize}`,
        }),
      }),
      transformResponse: (response: unknown) => {
        if (typeof response !== 'object' || response === null) {
          throw new Error('Invalid response format: expected an object');
        }

        if (
          !('spacecrafts' in response) ||
          !Array.isArray(response.spacecrafts)
        ) {
          throw new Error(
            'Invalid response format: spacecrafts array missing or invalid'
          );
        }

        const spacecrafts = isValidSpacecrafts(response.spacecrafts);
        if (spacecrafts.length !== response.spacecrafts.length) {
          console.warn('Some spacecraft items were filtered out as invalid');
        }

        let info: SpacecraftsTotalInfo | undefined;
        if ('page' in response) {
          if (isSpacecraftsTotalInfo(response.page)) {
            info = response.page;
          } else {
            console.warn('Invalid page info format');
          }
        }

        return {
          spacecraft: spacecrafts,
          info,
        };
      },
    }),
  }),
});

export const { useGetSpacecraftsQuery } = apiSlice;
