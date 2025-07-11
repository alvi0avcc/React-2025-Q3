import { Component } from 'react';
import styles from './response.module.css';

type Props = {
  className?: string;
};

export class ResultsResponse extends Component<Props> {
  render() {
    return <div className={styles.response}>Response</div>;
  }
}
