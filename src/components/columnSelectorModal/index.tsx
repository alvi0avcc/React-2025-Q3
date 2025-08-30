import { useState, useCallback } from 'react';
import styles from './columnSelectorModal.module.css';

interface ColumnSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableColumns: string[];
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

export const ColumnSelectorModal = ({
  isOpen,
  onClose,
  availableColumns,
  selectedColumns,
  onColumnsChange,
}: ColumnSelectorModalProps) => {
  const [tempSelectedColumns, setTempSelectedColumns] =
    useState<string[]>(selectedColumns);

  const handleColumnToggle = useCallback((column: string) => {
    setTempSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  }, []);

  const handleApply = useCallback(() => {
    onColumnsChange(tempSelectedColumns);
    onClose();
  }, [tempSelectedColumns, onColumnsChange, onClose]);

  const handleClose = useCallback(() => {
    setTempSelectedColumns(selectedColumns);
    onClose();
  }, [selectedColumns, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Select Columns to Display</h3>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.columnsList}>
          {availableColumns.map(column => (
            <label key={column} className={styles.columnCheckbox}>
              <input
                type="checkbox"
                checked={tempSelectedColumns.includes(column)}
                onChange={() => handleColumnToggle(column)}
              />
              {column}
            </label>
          ))}
        </div>

        <div className={styles.modalActions}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleApply} className={styles.applyButton}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
