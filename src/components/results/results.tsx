import { Component } from 'react';
import styles from './results.module.css';
import { ResultsResponse } from './response/response';
import { ResultsReject } from './reject/reject';
import { ErrorButton } from './error-button/error-button';
import type { Spacecraft } from '@/types/types';

type Props = {
  spacecrafts: Spacecraft[];
  error: Error | null;
  isLoading: boolean;
};

export class Results extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { spacecrafts, error, isLoading } = this.props;

    if (isLoading) {
      return <div className={styles.loading}>Loading spacecrafts data...</div>;
    }

    if (!spacecrafts.length) {
      return <div className={styles.empty}>No spacecrafts found</div>;
    }

    return (
      <div className={styles.results}>
        {!error ? (
          <ResultsResponse spacecrafts={spacecrafts} />
        ) : (
          <ResultsReject />
        )}

        <ErrorButton />
      </div>
    );
  }
}
