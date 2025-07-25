import styles from './reject.module.css';
import { isApiError } from '@/utils/valid';
import type { ApiError } from '@/api/api';

type Props = {
  error: ApiError;
};
export const ResultsReject = ({ error }: Props) => {
  const errorHint = () => {
    if (!isApiError(error)) return null;

    switch (error.status) {
      case 404:
        return (
          <p className={styles.hint}>
            The requested resource was not found. Please check your search
            query.
          </p>
        );
      case 405:
        return (
          <p className={styles.hint}>
            Method Not Allowed: This endpoint does not accept the request method
            used.
          </p>
        );
      default:
        if ((error.status ?? 0) >= 500) {
          return (
            <p className={styles.hint}>
              Our servers are having issues. Please try again later.
            </p>
          );
        }
        return null;
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
