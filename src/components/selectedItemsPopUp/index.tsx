'use client';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@src/store';
import { clearSelected } from '@src/store/slice/selectedSpacecraftSlice';
import styles from './selectedItemsPopUp.module.css';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export const SelectedItemsPopUp = () => {
  const t = useTranslations('SelectedItemsPopUp');
  const dispatch = useDispatch();
  const { selectedItems } = useSelector(
    (state: RootState) => state.selectedSpacecraft
  );
  const [isLoading, setIsLoading] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const handleUnselectAll = () => {
    dispatch(clearSelected());
  };

  const handleSave = async () => {
    if (selectedItems.length === 0) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedItems }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `${selectedItems.length}_items.csv`;
        downloadLinkRef.current.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
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
          {t('selected')}
        </span>

        <button
          onClick={handleUnselectAll}
          className={styles.popUpButton}
          disabled={isLoading}
        >
          {t('unselect')}
        </button>

        <button
          onClick={handleSave}
          className={styles.popUpButton}
          disabled={isLoading}
        >
          {isLoading ? t('generating') : t('download')}
        </button>

        <a
          ref={downloadLinkRef}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
