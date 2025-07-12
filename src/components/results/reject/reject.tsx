import { Component } from 'react';
import styles from './reject.module.css';
import { isApiError } from '@/utils/valid';
import type { ApiError } from '@/api/api';

type Props = {
  error: ApiError;
};
export class ResultsReject extends Component<Props> {
  render() {
    const { error } = this.props;

    return (
      <div className={styles.reject}>
        <h3 className={styles.title}>Error Loading Data</h3>

        <p className={styles.message}>{error.message}</p>

        {isApiError(error) && error.status === 404 && (
          <p className={styles.hint}>
            The requested resource was not found. Please check your search
            query.
          </p>
        )}

        {isApiError(error) && error.status === 405 && (
          <p className={styles.hint}>
            Method Not Allowed: This endpoint does not accept the request method
            used.
          </p>
        )}

        {isApiError(error) && (error.status ?? 0) >= 500 && (
          <p className={styles.hint}>
            Our servers are having issues. Please try again late.
          </p>
        )}
      </div>
    );
  }
}
