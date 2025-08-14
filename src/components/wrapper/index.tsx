import type { ReactNode } from 'react';
import styles from './wrapper.module.css';

type Props = {
  children: ReactNode;
};

export const Wrapper = ({ children }: Props) => {
  return <div className={styles.wrapper}>{children}</div>;
};
