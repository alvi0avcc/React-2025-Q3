import { useMemo } from 'react';
import type { CountryDataProps } from '@/types';
import { getLatestPopulation } from '@/utils/getLatestPopulation';

export const PopulationCell = ({ data, countryKey }: CountryDataProps) => {
  const population = useMemo(
    () => getLatestPopulation(data, countryKey),
    [data, countryKey]
  );
  return <>{population ?? 'N/A'}</>;
};
