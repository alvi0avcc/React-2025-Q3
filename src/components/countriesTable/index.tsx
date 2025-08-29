import { memo, useCallback } from 'react';
import type { CountryList } from '@/types';
import styles from './countriesTable.module.css';
import { PopulationCell } from '@components/populationCell';

interface CountriesTableProps {
  data: CountryList;
  filteredCountryKeys: string[];
  onCountryChange: (countryKey: string) => void;
}

export const CountriesTable = memo(
  ({ data, filteredCountryKeys, onCountryChange }: CountriesTableProps) => {
    const handleCountryClick = useCallback(
      (countryKey: string) => {
        onCountryChange(countryKey);
      },
      [onCountryChange]
    );

    return (
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
                  <td className={styles.countryCell}>
                    <PopulationCell data={data} countryKey={countryKey} />
                  </td>
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
    );
  }
);

CountriesTable.displayName = 'CountriesTable';
