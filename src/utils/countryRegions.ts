import countries from 'world-countries';

export const countryToRegionMap: Record<string, string> = countries.reduce(
  (acc, country) => {
    acc[country.name.common] = country.region;
    return acc;
  },
  {} as Record<string, string>
);

export const isoCodeToRegionMap: Record<string, string> = countries.reduce(
  (acc, country) => {
    if (country.cca3) {
      acc[country.cca3] = country.region;
    }
    return acc;
  },
  {} as Record<string, string>
);

export const getCountryRegion = (
  countryName: string,
  isoCode?: string
): string => {
  if (isoCode && isoCodeToRegionMap[isoCode]) {
    return isoCodeToRegionMap[isoCode];
  }

  if (countryToRegionMap[countryName]) {
    return countryToRegionMap[countryName];
  }

  return 'Unknown region';
};

export const getAllRegions = (): string[] => {
  const regions = new Set(countries.map(country => country.region));
  return ['All', ...Array.from(regions).sort(), 'Unknown region'];
};

export const isRegion = (countryName: string): boolean => {
  const allRegions = getAllRegions();
  const regionsToCheck = allRegions.filter(
    region => region !== 'All' && region !== 'Unknown region'
  );

  return regionsToCheck.some(region => countryName.includes(region));
};
