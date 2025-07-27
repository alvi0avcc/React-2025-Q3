import styles from './response.module.css';
import type { Spacecraft } from '@/types/types';
import { getDisplayValue } from '@/utils/valid';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

type Props = {
  spacecrafts: Spacecraft[];
  onSpacecraftSelected?: (id: number) => void;
};

export const ResultsResponse = ({
  spacecrafts,
  onSpacecraftSelected,
}: Props) => {
  const [spacecraft, setSpacecraft] = useState<Spacecraft | null>(null);
  const navigate = useNavigate();

  const handleSpacecraftSelected = (id: number) => {
    if (onSpacecraftSelected) {
      setSpacecraft(spacecrafts[id]);
      void navigate('details', { state: { spacecraft } });
      onSpacecraftSelected(id);
    }
  };

  return (
    <div className={styles.response}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {spacecrafts.map((item, id) => (
            <tr key={item.uid} onClick={() => handleSpacecraftSelected?.(id)}>
              <td>{getDisplayValue(item.name)}</td>
              <td>{getDisplayValue(item.spacecraftClass?.name)}</td>
              <td>{getDisplayValue(item.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Outlet context={{ spacecraft: spacecraft }} />
    </div>
  );
};
