import styles from './response.module.css';
import type { Spacecraft } from '@/types/types';

type Props = {
  spacecrafts: Spacecraft[];
};

export const ResultsResponse = ({ spacecrafts }: Props) => {
  const getDisplayValue = (
    value: string | undefined,
    replacement = 'hidden'
  ) => {
    return value?.trim() ? value : replacement;
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
          {spacecrafts.map(item => (
            <tr key={item.uid}>
              <td>{getDisplayValue(item.name)}</td>
              <td>{getDisplayValue(item.spacecraftClass?.name)}</td>
              <td>{getDisplayValue(item.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
