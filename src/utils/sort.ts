import type { CountryList, SortField, SortOrder } from '@/types';
import { getLatestPopulation } from './getLatestPopulation';

export const sortCountries = (
  data: CountryList,
  countryKeys: string[],
  sortField: SortField,
  sortOrder: SortOrder
): string[] => {
  return [...countryKeys].sort((a, b) => {
    let valueA: string | number;
    let valueB: string | number;

    if (sortField === 'name') {
      valueA = a.toLowerCase();
      valueB = b.toLowerCase();
    } else {
      valueA = getLatestPopulation(data, a) || 0;
      valueB = getLatestPopulation(data, b) || 0;
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === 'asc'
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    }
  });
};
