import { useMemo, useState, useCallback } from 'react';
import type { CountrySelectProps, SortField, SortOrder } from '@/types';
import styles from './countrySelect.module.css';
import { getCountryRegion, isRegion } from '@/utils/countryRegions';
import { useComputations } from '@/hooks/useComputations';
import { RegionFilter } from '@components/regionFilter';
import { SearchBar } from '@components/searchBar';
import { SortControls } from '@components/sortControls';
import { CountriesTable } from '@components/countriesTable';
import { sortCountries } from '@/utils/sort';

export function CountrySelect({ data, onCountryChange }: CountrySelectProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleRegionChange = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term.toLowerCase());
  }, []);

  const handleSortChange = useCallback((field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
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

  const sortedCountryKeys = useMemo(() => {
    return sortCountries(data, filteredCountryKeys, sortField, sortOrder);
  }, [data, filteredCountryKeys, sortField, sortOrder]);

  return (
    <div className={styles.countrySelectTableContainer}>
      <div className={styles.filtersContainer}>
        <SearchBar onSearchChange={handleSearchChange} />
        <RegionFilter onRegionChange={handleRegionChange} />
        <SortControls
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      <table className={styles.countryHeaderTable}>
        <thead>
          <tr>
            <th className={styles.countrySelectHeader}>
              Country Name
              {sortField === 'name' && (
                <span className={styles.sortIndicator}>
                  {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                </span>
              )}
            </th>
            <th className={styles.countrySelectHeader}>
              Population
              {sortField === 'population' && (
                <span className={styles.sortIndicator}>
                  {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                </span>
              )}
            </th>
            <th className={styles.countrySelectHeader}>ISO code</th>
          </tr>
        </thead>
      </table>

      <CountriesTable
        data={data}
        filteredCountryKeys={sortedCountryKeys}
        onCountryChange={onCountryChange}
      />
    </div>
  );
}
