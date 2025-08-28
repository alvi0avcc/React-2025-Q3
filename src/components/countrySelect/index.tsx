import type { CountryList } from '@/types';
import styles from './countrySelect.module.css';

interface CountrySelectProps {
  data: CountryList;
  onCountryChange: (countryKey: string) => void;
}

export function CountrySelect({ data, onCountryChange }: CountrySelectProps) {
  return (
    <div className={styles.countrySelectTableContainer}>
      <table className={styles.countrySelectTable}>
        <thead>
          <tr>
            <th className={styles.countrySelectHeader}>Country Name</th>
            <th className={styles.countrySelectHeader}>Population</th>
            <th className={styles.countrySelectHeader}>ISO code</th>
          </tr>
        </thead>
      </table>

      <div className={styles.countryScrollTable}>
        <table className={styles.countrySelectTable}>
          <tbody>
            {Object.entries(data).map(([countryKey, countryEntry]) => (
              <tr
                key={countryKey}
                className={styles.countryLine}
                onClick={() => onCountryChange(countryKey)}
              >
                <th className={styles.countryCell}>{countryKey}</th>
                <th className={styles.countryCell}>xxx</th>
                <th className={styles.countryCell}>
                  {countryEntry.iso_code ? (
                    <span className={styles.isoCode}>
                      {countryEntry.iso_code}
                    </span>
                  ) : (
                    'N/A'
                  )}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
