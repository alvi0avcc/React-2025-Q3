import { Component } from 'react';
import type { ReactNode } from 'react';
import styles from './wrapper.module.css';

type Props = {
  children: ReactNode;
};

export class Wrapper extends Component<Props> {
  render() {
    const { children } = this.props;
    return <div className={styles.wrapper}>{children}</div>;
  }
}
