import styles from './loader.module.css';

export const Loader = () => {
  return (
    <>
      <img className={styles.loader} src="./loader.gif" alt="Loading data" />
      <div className={styles.loading}>Loading data...</div>
    </>
  );
};
