import { Component } from 'react';
import styles from './top-controls.module.css';
import { SearchInputField } from './search-input-field/search-input-field';
import { SearchButton } from './search-button/search-button';

type Props = {
  className?: string;
};

export class TopControls extends Component<Props> {
  render() {
    return (
      <div className={styles.topControls}>
        <SearchInputField />
        <SearchButton />
      </div>
    );
  }
}
