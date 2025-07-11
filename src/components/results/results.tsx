import { Component } from 'react';
import styles from './results.module.css';
import { ResultsResponse } from './response/response';
import { ResultsReject } from './reject/reject';
import { ErrorButton } from './error-button/error-button';

type Props = {
  className?: string;
};

export class Results extends Component<Props> {
  render() {
    return (
      <div className={styles.results}>
        <ResultsResponse />
        <ResultsReject />
        <ErrorButton />
      </div>
    );
  }
}
