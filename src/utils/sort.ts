import type { CountryList, SortField, SortOrder } from '@/types';
import { getPopulationForYear } from '@/utils/year';

export const sortCountries = (
  data: CountryList,
  countryKeys: string[],
  sortField: SortField,
  sortOrder: SortOrder,
  latestYear: number,
  selectedYear: number | undefined
): string[] => {
  const targetYear = selectedYear === undefined ? latestYear : selectedYear;

  return [...countryKeys].sort((a, b) => {
    let valueA: string | number;
    let valueB: string | number;

    if (sortField === 'name') {
      valueA = a.toLowerCase();
      valueB = b.toLowerCase();
    } else {
      valueA = getPopulationForYear(data, a, targetYear) || 0;
      valueB = getPopulationForYear(data, b, targetYear) || 0;
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
