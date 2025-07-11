import { Component } from 'react';
import styles from './error-button.module.css';

type Props = {
  className?: string;
};

export class ErrorButton extends Component<Props> {
  render() {
    return <button className={styles.errorButton}>ErrorButton</button>;
  }
}
