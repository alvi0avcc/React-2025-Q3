'use client';

import { Component } from 'react';
import type { ReactNode } from 'react';
import styles from './error-boundary.module.css';

interface State {
  hasError: boolean;
  error: Error | null;
}

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={styles.back}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset} className={styles.resetButton}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
}
