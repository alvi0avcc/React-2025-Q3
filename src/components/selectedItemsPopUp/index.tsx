import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/store';
import { clearSelected } from 'src/store/slice/selectedSpacecraftSlice';
import styles from './SelectedItemsPopUp.module.css';
import { useRef } from 'react';
import { getDisplayValue } from '@src/utils/valid';

export const SelectedItemsPopUp = () => {
  const dispatch = useDispatch();
  const { selectedItems } = useSelector(
    (state: RootState) => state.selectedSpacecraft
  );
  const saveLink = useRef<HTMLAnchorElement>(null);

  const handleUnselectAll = () => {
    dispatch(clearSelected());
  };

  const handleSave = () => {
    if (selectedItems.length === 0) return;

    const headers = ['UID', 'Name', 'Class', 'Status', 'Registry', 'Species'];
    const csvRows = selectedItems.map(item =>
      [
        `"${item.uid}"`,
        `"${item.name}"`,
        getDisplayValue(item.spacecraftClass?.name),
        getDisplayValue(item.status),
        getDisplayValue(item.registry),
        getDisplayValue(item.species),
      ].join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    if (saveLink.current) {
      saveLink.current.href = url;
      saveLink.current.download = `${selectedItems.length}_items.csv`;
      saveLink.current.click();
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <span>
          {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}{' '}
          selected
        </span>

        <button onClick={handleUnselectAll} className={styles.popUpButton}>
          Unselect all
        </button>

        <button onClick={handleSave} className={styles.popUpButton}>
          Download
        </button>
        <a ref={saveLink} style={{ display: 'none' }}></a>
      </div>
    </div>
  );
};
