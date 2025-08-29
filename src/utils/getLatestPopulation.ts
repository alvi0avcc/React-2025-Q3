import type { CountryList } from '@/types';

export function getLatestPopulation(
  countryList: CountryList,
  countryName: string
): number | null {
  const country = countryList[countryName];
  if (!country?.data?.length) {
    return null;
  }

  let latestYear = 0;
  let latestPopulation: number | null = null;

  for (const entry of country.data) {
    if (
      entry.population != null &&
      entry.year != null &&
      entry.year > latestYear
    ) {
      latestYear = entry.year;
      latestPopulation = entry.population;
    }
  }

  return latestPopulation;
}
