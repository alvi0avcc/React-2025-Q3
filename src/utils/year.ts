import type { CountryList } from '@/types';
import { getLatestPopulation } from './getLatestPopulation';

export const getAvailableYears = (data: CountryList): number[] => {
  const years = new Set<number>();

  Object.values(data).forEach(country => {
    country.data?.forEach(entry => {
      if (entry.year) {
        years.add(entry.year);
      }
    });
  });

  return Array.from(years).sort((a, b) => b - a);
};

export const getLatestAvailableYear = (data: CountryList): number => {
  const years = getAvailableYears(data);
  return years.length > 0 ? years[0] : new Date().getFullYear() - 1;
};

export const getPopulationForYear = (
  data: CountryList,
  countryKey: string,
  year?: number
): number | null => {
  const country = data[countryKey];
  if (!country?.data) return null;

  if (!year) return getLatestPopulation(data, countryKey);

  const exactEntry = country.data.find(entry => entry.year === year);
  if (exactEntry && exactEntry.population != null) {
    return exactEntry.population;
  }

  return getLatestPopulation(data, countryKey);
};
