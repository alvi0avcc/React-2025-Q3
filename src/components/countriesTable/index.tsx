import { memo, useCallback } from 'react';
import type { CountryList } from '@/types';
import styles from './countriesTable.module.css';
import { PopulationCell } from '@components/populationCell';

interface CountriesTableProps {
  data: CountryList;
  filteredCountryKeys: string[];
  onCountrySelect: (countryKey: string) => void;
  selectedYear?: number;
}

export const CountriesTable = memo(
  ({
    data,
    filteredCountryKeys,
    onCountrySelect,
    selectedYear,
  }: CountriesTableProps) => {
    const handleCountryClick = useCallback(
      (countryKey: string) => {
        onCountrySelect(countryKey);
      },
      [onCountrySelect]
    );

    if (filteredCountryKeys.length === 0) {
      return (
        <div className={styles.noResults}>
          <p>No countries found matching your criteria.</p>
        </div>
      );
    }

    return (
      <>
        <div className={styles.countryScrollTable}>
          <table className={styles.countrySelectedTable}>
            <tbody>
              {filteredCountryKeys.map(countryKey => {
                const countryEntry = data[countryKey];

                return (
                  <tr
                    key={countryKey}
                    className={styles.countryLine}
                    onClick={() => handleCountryClick(countryKey)}
                  >
                    <td className={styles.countryCell}>{countryKey}</td>
                    <PopulationCell
                      key={countryKey}
                      data={data}
                      countryKey={countryKey}
                      year={selectedYear}
                    />
                    <td className={styles.countryCell}>
                      {countryEntry.iso_code ? (
                        <span className={styles.isoCode}>
                          {countryEntry.iso_code}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
);

CountriesTable.displayName = 'CountriesTable';
