import { Component } from 'react';
import styles from './search-input-field.module.css';

type Props = {
  initialValue?: string;
  onInputChange: (query: string) => void;
  onSearchRequest: () => void;
};

export class SearchInputField extends Component<Props> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onInputChange(e.target.value);
  };

  handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.props.onSearchRequest();
    }
  };

  render() {
    return (
      <input
        className={styles.searchInputField}
        value={this.props.initialValue || ''}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        placeholder="Enter the ship name..."
      />
    );
  }
}
