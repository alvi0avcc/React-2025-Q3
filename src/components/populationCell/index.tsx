import { useMemo } from 'react';
import type { CountryDataYearProps } from '@/types';
import { getPopulationForYear } from '@/utils/year';

export const PopulationCell = ({
  data,
  countryKey,
  year,
}: CountryDataYearProps) => {
  const population = useMemo(
    () => getPopulationForYear(data, countryKey, year),
    [data, countryKey, year]
  );
  return <>{population ?? 'N/A'}</>;
};
