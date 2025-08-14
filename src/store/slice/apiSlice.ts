import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PaginationOptions,
  Spacecraft,
  SpacecraftsTotalInfo,
} from '@src/types/types';
import {
  baseUrl,
  defaultPagination,
  keepUnusedDataFor,
} from '@src/const/const';
import { isValidSpacecrafts, isSpacecraftsTotalInfo } from '@src/utils/valid';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Spacecrafts'],
  endpoints: builder => ({
    getSpacecrafts: builder.query<
      { spacecraft: Spacecraft[]; info?: SpacecraftsTotalInfo },
      { searchQuery: string; options?: PaginationOptions; refresh?: boolean }
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
      providesTags: result =>
        result
          ? [
              ...result.spacecraft.map(({ uid }) => ({
                type: 'Spacecrafts' as const,
                uid,
              })),
              { type: 'Spacecrafts', uid: 'LIST' },
            ]
          : [{ type: 'Spacecrafts', uid: 'LIST' }],
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
      keepUnusedDataFor: keepUnusedDataFor,
    }),
    refreshSpacecrafts: builder.mutation<null, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: [{ type: 'Spacecrafts', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSpacecraftsQuery,
  useLazyGetSpacecraftsQuery,
  useRefreshSpacecraftsMutation,
} = apiSlice;
