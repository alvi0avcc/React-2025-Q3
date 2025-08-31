import { useState, useMemo, memo } from 'react';
import type { CountryList, DataEntry } from '@/types';
import styles from './countryDetail.module.css';
import { ColumnSelectorModal } from '@components/columnSelectorModal';
import { formatColumnName } from '@/utils/formatters';

interface CountryDetailProps {
  countryKey: string | null;
  data: CountryList;
  selectedYear?: number;
}

const BASE_COLUMNS = ['year', 'population', 'co2', 'co2_per_capita'];

export const CountryDetail = memo(
  ({ countryKey, data, selectedYear }: CountryDetailProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] =
      useState<string[]>(BASE_COLUMNS);

    const countryData = useMemo(() => {
      if (!countryKey) return null;
      return data[countryKey];
    }, [countryKey, data]);

    const availableColumns = useMemo(() => {
      const columns = new Set<string>(BASE_COLUMNS);
      if (countryData?.data) {
        countryData.data.forEach(entry => {
          Object.keys(entry).forEach(key => {
            if (
              key in entry &&
              entry[key as keyof DataEntry] !== undefined &&
              entry[key as keyof DataEntry] !== null
            ) {
              columns.add(key);
            }
          });
        });
      }
      return Array.from(columns).sort();
    }, [countryData]);

    const filteredYearlyData = useMemo(() => {
      if (!countryData?.data) return [];

      let dataToShow = countryData.data;

      if (selectedYear !== undefined) {
        dataToShow = countryData.data.filter(
          entry => entry.year === selectedYear
        );

        if (dataToShow.length === 0) {
          const availableYears = countryData.data
            .filter(entry => entry.year !== undefined)
            .map(entry => entry.year!)
            .sort(
              (a, b) => Math.abs(a - selectedYear) - Math.abs(b - selectedYear)
            );

          if (availableYears.length > 0) {
            const closestYear = availableYears[0];
            dataToShow = countryData.data.filter(
              entry => entry.year === closestYear
            );
          }
        }
      }

      return dataToShow.slice().sort((a, b) => (b.year || 0) - (a.year || 0));
    }, [countryData, selectedYear]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleColumnsChange = (columns: string[]) => {
      setSelectedColumns(columns);
    };

    if (!countryKey) {
      return (
        <div className={styles.noSelection}>
          <p>Select a country to view detailed data</p>
        </div>
      );
    }

    if (!countryData) {
      return (
        <div className={styles.error}>
          <p>Country data not found</p>
        </div>
      );
    }

    return (
      <div className={styles.countryDetail}>
        <div className={styles.countryDetailheader}>
          <h3>{countryKey}</h3>
          {countryData.iso_code && (
            <span className={styles.isoCode}>ISO: {countryData.iso_code}</span>
          )}
          <div className={styles.yearInfo}>
            {selectedYear !== undefined ? (
              <span className={styles.selectedYear}>
                Showing data for: {selectedYear}
              </span>
            ) : (
              <span className={styles.allYears}>
                Showing all available years
              </span>
            )}
          </div>
          <button onClick={handleOpenModal} className={styles.columnButton}>
            Select Columns
          </button>
        </div>

        <div className={styles.tableContainer}>
          {filteredYearlyData.length === 0 ? (
            <div className={styles.noData}>
              <p>
                No data available{' '}
                {selectedYear !== undefined
                  ? `for year ${selectedYear}`
                  : 'for this country'}
              </p>
            </div>
          ) : (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  {selectedColumns.map(column => (
                    <th key={column}>{formatColumnName(column)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredYearlyData.map((entry, index) => (
                  <tr key={index}>
                    {selectedColumns.map(column => (
                      <td key={column} className={styles.dataCell}>
                        {entry[column as keyof typeof entry] ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <ColumnSelectorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          availableColumns={availableColumns}
          selectedColumns={selectedColumns}
          onColumnsChange={handleColumnsChange}
        />
      </div>
    );
  }
);

CountryDetail.displayName = 'CountryDetail';
