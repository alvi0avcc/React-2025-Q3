import styles from './results.module.css';
import { ResultsResponse } from './response/response';
import { ResultsReject } from './reject/reject';
import type { Spacecraft } from '@/types/types';
import type { ApiError } from '@/api/api';
import { Loader } from '@/components/loader/loader';
import { SelectedItemsPopUp } from '../selectedItemsPopUp/selectedItemsPopUp';

type Props = {
  spacecrafts: Spacecraft[];
  error: ApiError | null;
  isLoading: boolean;
  onSpacecraftSelected?: (id: number) => void;
};

export const Results = ({
  spacecrafts,
  error,
  isLoading,
  onSpacecraftSelected,
}: Props) => {
  if (isLoading) {
    return (
      <section className={styles.results}>
        <Loader />
      </section>
    );
  }

  if (!error && spacecrafts.length === 0) {
    return <div className={styles.empty}>No spacecrafts found</div>;
  }

  return (
    <div className={styles.results}>
      {!error ? (
        <>
          <ResultsResponse
            spacecrafts={spacecrafts}
            onSpacecraftSelected={onSpacecraftSelected}
          />
          <SelectedItemsPopUp />
        </>
      ) : (
        <ResultsReject error={error} />
      )}
    </div>
  );
};
