import type { ApiError } from '@/api/api';
import type { Spacecraft, SpacecraftsTotalInfo } from '@/types/types';

const isValidSpacecraft = (spacecraft: unknown): spacecraft is Spacecraft => {
  return (
    spacecraft !== null &&
    typeof spacecraft === 'object' &&
    'uid' in spacecraft &&
    typeof spacecraft.uid === 'string' &&
    'name' in spacecraft &&
    typeof spacecraft.name === 'string' &&
    (!('registry' in spacecraft) ||
      spacecraft.registry === null ||
      typeof spacecraft.registry === 'string') &&
    (!('status' in spacecraft) ||
      spacecraft.status === null ||
      typeof spacecraft.status === 'string') &&
    (!('dateStatus' in spacecraft) ||
      spacecraft.dateStatus === null ||
      typeof spacecraft.dateStatus === 'string') &&
    (!('species' in spacecraft) ||
      spacecraft.species === null ||
      typeof spacecraft.species === 'string') &&
    (!('owner' in spacecraft) ||
      spacecraft.owner === null ||
      (spacecraft.owner !== null &&
        typeof spacecraft.owner === 'object' &&
        'uid' in spacecraft.owner &&
        typeof spacecraft.owner.uid === 'string' &&
        'name' in spacecraft.owner &&
        typeof spacecraft.owner.name === 'string')) &&
    (!('operator' in spacecraft) ||
      spacecraft.operator === null ||
      (spacecraft.operator !== null &&
        typeof spacecraft.operator === 'object' &&
        'uid' in spacecraft.operator &&
        typeof spacecraft.operator.uid === 'string' &&
        'name' in spacecraft.operator &&
        typeof spacecraft.operator.name === 'string')) &&
    (!('affiliation' in spacecraft) ||
      spacecraft.affiliation === null ||
      (spacecraft.affiliation !== null &&
        typeof spacecraft.affiliation === 'object' &&
        'uid' in spacecraft.affiliation &&
        typeof spacecraft.affiliation.uid === 'string' &&
        'name' in spacecraft.affiliation &&
        typeof spacecraft.affiliation.name === 'string')) &&
    (!('spacecraftClass' in spacecraft) ||
      spacecraft.spacecraftClass === null ||
      (spacecraft.spacecraftClass !== null &&
        typeof spacecraft.spacecraftClass === 'object' &&
        'uid' in spacecraft.spacecraftClass &&
        typeof spacecraft.spacecraftClass.uid === 'string' &&
        'name' in spacecraft.spacecraftClass &&
        typeof spacecraft.spacecraftClass.name === 'string'))
  );
};

export const isValidSpacecrafts = (data: unknown[]): Spacecraft[] => {
  return data.filter(item => isValidSpacecraft(item));
};

export const isApiError = (error: Error): error is ApiError => {
  return 'status' in error;
};

export function isSpacecraftsTotalInfo(
  obj: unknown
): obj is SpacecraftsTotalInfo {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const requiredKeys: Array<keyof SpacecraftsTotalInfo> = [
    'firstPage',
    'lastPage',
    'numberOfElements',
    'pageNumber',
    'pageSize',
    'totalElements',
    'totalPages',
  ];

  return requiredKeys.every(key => key in obj);
}

export const getDisplayValue = (
  value: string | undefined,
  replacement = 'hidden'
) => {
  return value?.trim() ? value : replacement;
};
