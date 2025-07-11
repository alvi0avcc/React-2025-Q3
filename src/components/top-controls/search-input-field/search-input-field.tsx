import { Component } from 'react';
import styles from './search-input-field.module.css';

type Props = {
  className?: string;
};

export class SearchInputField extends Component<Props> {
  render() {
    return <div className={styles.searchInputField}>SearchInputField</div>;
  }
}
