import { useCallback } from 'react';
import styles from './sortControl.module.css';

export type SortField = 'name' | 'population';
export type SortOrder = 'asc' | 'desc';

interface SortControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export const SortControls = ({
  sortField,
  sortOrder,
  onSortChange,
}: SortControlsProps) => {
  const handleFieldChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const field = event.target.value as SortField;
      onSortChange(field, sortOrder);
    },
    [sortOrder, onSortChange]
  );

  const handleOrderChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const order = event.target.value as SortOrder;
      onSortChange(sortField, order);
    },
    [sortField, onSortChange]
  );

  return (
    <div className={styles.sortContainer}>
      <label htmlFor="sort-field" className={styles.sortLabel}>
        Sort by:
      </label>
      <select
        id="sort-field"
        value={sortField}
        onChange={handleFieldChange}
        className={styles.sortSelect}
      >
        <option value="name">Country Name</option>
        <option value="population">Population</option>
      </select>

      <label htmlFor="sort-order" className={styles.sortLabel}>
        ↑↓
      </label>
      <select
        id="sort-order"
        value={sortOrder}
        onChange={handleOrderChange}
        className={styles.sortSelect}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};
