import {
  baseUrl,
  defaultPagination,
  delayBetweenRequestsMsec,
} from '@src/const/const';
import type {
  PaginationOptions,
  Spacecraft,
  SpacecraftsTotalInfo,
} from '@src/types/types';
import pause from '@src/utils/pause';
import { isSpacecraftsTotalInfo, isValidSpacecrafts } from '@src/utils/valid';

export class ApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const buildSearchParams = (
  searchQuery: string,
  options: PaginationOptions = defaultPagination
): URLSearchParams => {
  const params = new URLSearchParams();
  const query = searchQuery.trim();
  params.set('name', query);

  params.set(
    'pageNumber',
    `${options.pageNumber || defaultPagination.pageNumber}`
  );
  params.set('pageSize', `${options.pageSize || defaultPagination.pageSize}`);

  return params;
};

const spacecraftsFetch = async (
  params: URLSearchParams
): Promise<Response | undefined> => {
  await pause(delayBetweenRequestsMsec);

  try {
    const response: Response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(error.message, error.status);
    }
    throw error;
  }
};

export const spacecraftsGet = async (
  params: URLSearchParams
): Promise<{
  spacecraft: Spacecraft[];
  info: SpacecraftsTotalInfo | undefined;
}> => {
  try {
    const response: Response | undefined = await spacecraftsFetch(params);

    if (!response) {
      throw new ApiError('Invalid response format');
    }

    const data = await response.json();

    if (!data || typeof data !== 'object' || !('spacecrafts' in data)) {
      throw new ApiError('Invalid response format');
    }

    if (!Array.isArray(data.spacecrafts)) {
      throw new ApiError('Spacecrafts data is not an array');
    }

    const info: SpacecraftsTotalInfo | undefined = isSpacecraftsTotalInfo(
      data.page
    )
      ? data.page
      : undefined;

    return { spacecraft: isValidSpacecrafts(data.spacecrafts), info: info };
  } catch (error) {
    if (error instanceof ApiError)
      throw new ApiError(error.message, error.status);

    throw new ApiError('Network request failed', undefined);
  }
};
