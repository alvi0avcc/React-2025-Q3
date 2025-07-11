import type { Spacecraft } from '@/utils/types';

const isValidSpacecraft = (spacecraft: unknown): spacecraft is Spacecraft => {
  return (
    spacecraft !== null &&
    typeof spacecraft === 'object' &&
    'uid' in spacecraft &&
    typeof spacecraft.uid === 'string' &&
    'name' in spacecraft &&
    typeof spacecraft.name === 'string' &&
    'registry' in spacecraft &&
    (spacecraft.registry === undefined ||
      typeof spacecraft.registry === 'string') &&
    'status' in spacecraft &&
    (spacecraft.status === undefined ||
      typeof spacecraft.status === 'string') &&
    'dateStatus' in spacecraft &&
    (spacecraft.dateStatus === undefined ||
      typeof spacecraft.dateStatus === 'string') &&
    'species' in spacecraft &&
    (spacecraft.species === undefined ||
      typeof spacecraft.species === 'string') &&
    'owner' in spacecraft &&
    (spacecraft.owner === undefined || typeof spacecraft.owner === 'string') &&
    'operator' in spacecraft &&
    (spacecraft.operator === undefined ||
      typeof spacecraft.operator === 'string') &&
    'affiliation' in spacecraft &&
    (spacecraft.affiliation === undefined ||
      typeof spacecraft.affiliation === 'string') &&
    'spacecraftClass' in spacecraft &&
    (spacecraft.spacecraftClass === undefined ||
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
