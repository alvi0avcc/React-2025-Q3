import { Component } from 'react';
import styles from './search-button.module.css';

type Props = {
  className?: string;
};

export class SearchButton extends Component<Props> {
  render() {
    return <button className={styles.searchButton}>SearchButton</button>;
  }
}
