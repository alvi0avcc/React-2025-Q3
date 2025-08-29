import { useMemo, useState, useCallback } from 'react';
import type { CountrySelectProps } from '@/types';
import styles from './countrySelect.module.css';
import { getCountryRegion, isRegion } from '@/utils/countryRegions';
import { useComputations } from '@/hooks/useComputations';
import { RegionFilter } from '@components/regionFilter';
import { CountriesTable } from '@components/countriesTable';
import { SearchBar } from '@components/searchBar';

export function CountrySelect({ data, onCountryChange }: CountrySelectProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleRegionChange = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term.toLowerCase());
  }, []);

  const { getOrCompute: getCachedRegion } = useComputations<string>();
  const { getOrCompute: getCachedIsRegion } = useComputations<boolean>();

  const cachedIsRegion = useCallback(
    (countryName: string) => {
      return getCachedIsRegion(`isRegion-${countryName}`, () =>
        isRegion(countryName)
      );
    },
    [getCachedIsRegion]
  );

  const cachedGetCountryRegion = useCallback(
    (countryName: string, isoCode?: string) => {
      return getCachedRegion(`region-${countryName}-${isoCode}`, () =>
        getCountryRegion(countryName, isoCode)
      );
    },
    [getCachedRegion]
  );

  const filteredCountryKeys = useMemo(() => {
    return Object.entries(data)
      .filter(([countryName, countryEntry]) => {
        if (cachedIsRegion(countryName)) return false;

        if (selectedRegion !== 'All') {
          const region = cachedGetCountryRegion(
            countryName,
            countryEntry.iso_code
          );
          if (region !== selectedRegion) return false;
        }

        if (searchTerm) {
          return countryName.toLowerCase().includes(searchTerm);
        }

        return true;
      })
      .map(([countryKey]) => countryKey);
  }, [
    data,
    selectedRegion,
    searchTerm,
    cachedIsRegion,
    cachedGetCountryRegion,
  ]);

  return (
    <div className={styles.countrySelectTableContainer}>
      <div className={styles.filtersContainer}>
        <SearchBar onSearchChange={handleSearchChange} />
        <RegionFilter onRegionChange={handleRegionChange} />
      </div>

      <table className={styles.countryHeaderTable}>
        <thead>
          <tr>
            <th className={styles.countrySelectHeader}>Country Name</th>
            <th className={styles.countrySelectHeader}>Population</th>
            <th className={styles.countrySelectHeader}>ISO code</th>
          </tr>
        </thead>
      </table>

      <CountriesTable
        data={data}
        filteredCountryKeys={filteredCountryKeys}
        onCountryChange={onCountryChange}
      />
    </div>
  );
}
