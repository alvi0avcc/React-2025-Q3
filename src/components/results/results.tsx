import styles from './results.module.css';
import { ResultsResponse } from './response/response';
import { ResultsReject } from './reject/reject';
import type { Spacecraft } from '@/types/types';
import type { ApiError } from '@/api/api';

type Props = {
  spacecrafts: Spacecraft[];
  error: ApiError | null;
  isLoading: boolean;
};

export const Results = ({ spacecrafts, error, isLoading }: Props) => {
  if (isLoading) {
    return (
      <section className={styles.results}>
        <img
          className={styles.loader}
          src="./loader.gif"
          alt="Loading spacecrafts data"
        />
        <div className={styles.loading}>Loading spacecrafts data...</div>
      </section>
    );
  }

  if (!error && !spacecrafts.length) {
    return <div className={styles.empty}>No spacecrafts found</div>;
  }

  return (
    <div className={styles.results}>
      {!error ? (
        <ResultsResponse spacecrafts={spacecrafts} />
      ) : (
        <ResultsReject error={error} />
      )}
    </div>
  );
};
