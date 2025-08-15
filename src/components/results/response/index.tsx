import styles from './response.module.css';
import type { Spacecraft } from '@src/types/types';
import { getDisplayValue } from '@src/utils/valid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSpacecraft } from 'src/store/slice/selectedSpacecraftSlice';
import type { RootState } from 'src/store';
import classNames from 'classnames';
import { useRouter, useSearchParams } from 'next/navigation';
import Details from '../details';

type Props = {
  spacecrafts: Spacecraft[];
  onSpacecraftSelected?: (id: number) => void;
};

export const ResultsResponse = ({
  spacecrafts,
  onSpacecraftSelected,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [spacecraft, setSpacecraft] = useState<Spacecraft | null>(null);
  const dispatch = useDispatch();
  const { selectedIds } = useSelector(
    (state: RootState) => state.selectedSpacecraft
  );

  const handleSpacecraftSelected = (id: number) => {
    const selectedSpacecraft = spacecrafts[id];
    setSpacecraft(selectedSpacecraft);

    const params = new URLSearchParams(searchParams.toString());
    params.set('detail', selectedSpacecraft.uid.toString());
    router.push(`?${params.toString()}`, { scroll: false });

    if (onSpacecraftSelected) {
      onSpacecraftSelected(id);
    }
  };

  const handleToggleSelect = (item: Spacecraft) => {
    dispatch(toggleSpacecraft(item));
  };

  const handleCloseDetails = () => {
    setSpacecraft(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('detail');
    router.push(`?${params.toString()}`, { scroll: false });
    onSpacecraftSelected?.(-1);
  };

  return (
    <div className={styles.response}>
      <table className={styles.table}>
        <thead>
          <tr>
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
              onClick={() => handleSpacecraftSelected(id)}
              className={classNames(
                selectedIds.includes(item.uid) ? styles.selected : '',
                styles.rowHover
              )}
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

      <Details
        context={{ spacecraft: spacecraft, onClose: handleCloseDetails }}
      />
    </div>
  );
};
