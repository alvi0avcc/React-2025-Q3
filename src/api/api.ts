import { baseUrl, localStorageKey } from '@/const/const';
import type { Spacecraft } from '@/types/types';
import { isValidSpacecrafts } from '@/utils/valid';

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

    return response;
  } catch {
    return undefined;
  }
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

    if (response) {
      const data: unknown = await response.json();

      if (
        data !== null &&
        typeof data === 'object' &&
        'spacecrafts' in data &&
        Array.isArray(data.spacecrafts)
      ) {
        return isValidSpacecrafts(data.spacecrafts);
      }
    }
    return [];
  } catch {
    return [];
  }
};
