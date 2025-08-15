import styles from './response.module.css';
import type { Spacecraft } from '@src/types/types';
import { getDisplayValue } from '@src/utils/valid';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSpacecraft } from 'src/store/slice/selectedSpacecraftSlice';
import type { RootState } from 'src/store';

type Props = {
  spacecrafts: Spacecraft[];
  onSpacecraftSelected?: (id: number) => void;
};

export const ResultsResponse = ({
  spacecrafts,
  onSpacecraftSelected,
}: Props) => {
  const [spacecraft, setSpacecraft] = useState<Spacecraft | null>(null);
  const dispatch = useDispatch();
  const { selectedIds } = useSelector(
    (state: RootState) => state.selectedSpacecraft
  );

  const handleSpacecraftSelected = (id: number) => {
    if (onSpacecraftSelected) {
      setSpacecraft(spacecrafts[id]);
      onSpacecraftSelected(id);
    }
  };

  const handleToggleSelect = (item: Spacecraft) => {
    dispatch(toggleSpacecraft(item));
  };

  const handleCloseDetails = () => {
    setSpacecraft(null);
    onSpacecraftSelected?.(-1);
  };

  return (
    <div className={styles.response}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.rowHover}>
            <th className={styles.colSelect}>Select</th>
            <th>Name</th>
            <th>Class</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {spacecrafts.map((item, id) => (
            <tr
              key={item.uid}
              onClick={() => handleSpacecraftSelected?.(id)}
              className={selectedIds.includes(item.uid) ? styles.selected : ''}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.uid)}
                  onClick={e => e.stopPropagation()}
                  onChange={() => handleToggleSelect(item)}
                />
              </td>
              <td>{getDisplayValue(item.name)}</td>
              <td>{getDisplayValue(item.spacecraftClass?.name)}</td>
              <td>{getDisplayValue(item.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Outlet
        context={{ spacecraft: spacecraft, onClose: handleCloseDetails }}
      />
    </div>
  );
};
