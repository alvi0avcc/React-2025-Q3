import styles from './yearSelector.module.css';

interface YearSelectorProps {
  selectedYear: number | undefined;
  onYearChange: (year: number | undefined) => void;
  availableYears: number[];
}

export const YearSelector = ({
  selectedYear,
  onYearChange,
  availableYears,
}: YearSelectorProps) => {
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onYearChange(value === undefined ? undefined : Number(value));
  };

  return (
    <div className={styles.yearSelectorContainer}>
      <label htmlFor="year-selector" className={styles.yearSelectorLabel}>
        Select Year:
      </label>
      <select
        id="year-selector"
        value={selectedYear === undefined ? 'last' : selectedYear}
        onChange={handleYearChange}
        className={styles.yearSelector}
      >
        <option value="last">Latest Year</option>
        {availableYears.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
