import { baseUrl, localStorageKey } from '@/const/const';
import type { Spacecraft } from '@/types/types';
import { isValidSpacecrafts } from '@/utils/valid';

export class ApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const spacecraftsFetch = async (
  searchQuery: string
): Promise<Response | undefined> => {
  const params = new URLSearchParams();
  const query = searchQuery.trim();
  params.append('name', query);
  localStorageSet(query);

  try {
    const response: Response = await fetch(`${baseUrl}?${params.toString()}`, {
      method: 'POST',
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

export const localStorageGet = (): string => {
  return localStorage.getItem(localStorageKey) || '';
};

const localStorageSet = async (value: string): Promise<void> => {
  localStorage.setItem(localStorageKey, value);
  return;
};

export const spacecraftsGet = async (
  searchQuery: string
): Promise<Spacecraft[]> => {
  try {
    const response: Response | undefined = await spacecraftsFetch(searchQuery);

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

    return isValidSpacecrafts(data.spacecrafts);
  } catch (error) {
    if (error instanceof ApiError)
      throw new ApiError(error.message, error.status);

    throw new ApiError('Network request failed', undefined);
  }
};
