import { Component } from 'react';
import styles from './reject.module.css';

type Props = {
  className?: string;
};

export class ResultsReject extends Component<Props> {
  render() {
    return <div className={styles.reject}>Reject</div>;
  }
}
