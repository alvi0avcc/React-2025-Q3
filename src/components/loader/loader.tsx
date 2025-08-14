import styles from './loader.module.css';
// import LoaderIcon from '@/assets/loader.gif';

export const Loader = () => {
  return (
    <>
      {/* <img className={styles.loader} src={LoaderIcon} alt="Loading data" /> */}
      <div className={styles.loading}>Loading data...</div>
    </>
  );
};
