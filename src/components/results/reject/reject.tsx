import styles from './reject.module.css';
import { isApiError } from '@/utils/valid';
import type { ApiError } from '@/api/api';

type Props = {
  error: ApiError;
};
export const ResultsReject = ({ error }: Props) => {
  console.log('ResultsReject =', error);

  const errorHint = () => {
    if (!isApiError(error)) return null;

    switch (error.status) {
      case 404: {
        return (
          <p className={styles.hint}>
            Error-404. The requested resource was not found. Please check your
            search query.
          </p>
        );
      }
      case 405: {
        return (
          <p className={styles.hint}>
            Error-405. Method Not Allowed: This endpoint does not accept the
            request method used.
          </p>
        );
      }
      default: {
        if ((error.status ?? 0) >= 500) {
          return (
            <p className={styles.hint}>
              Error-5xx. Our servers are having issues. Please try again later.
            </p>
          );
        }

        return <p className={styles.hint}>{error.status}</p>;
      }
    }
  };

  return (
    <div className={styles.reject}>
      <h3 className={styles.title}>Error Loading Data</h3>

      <p className={styles.message}>{error.message}</p>

      {errorHint()}
    </div>
  );
};
