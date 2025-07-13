import { Component } from 'react';
import styles from './error-button.module.css';

interface State {
  error: boolean;
}

export class ErrorButton extends Component<unknown, State> {
  state: State = {
    error: false,
  };

  throwError = () => {
    this.setState({ error: true });
  };

  render() {
    if (this.state.error) {
      throw new Error('Test error by "Error Button"');
    }

    return (
      <button onClick={this.throwError} className={styles.errorButton}>
        Error Button
      </button>
    );
  }
}
