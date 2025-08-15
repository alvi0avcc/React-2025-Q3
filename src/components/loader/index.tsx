import styles from './loader.module.css';
import Image from 'next/image';

const Loader = () => {
  return (
    <div className={styles.container}>
      <Image
        src="/images/loader.gif"
        width={50}
        height={50}
        alt="Loading data"
        className={styles.loader}
        priority
        unoptimized={true}
      />
      <div className={styles.loading}>Loading data...</div>
    </div>
  );
};

export default Loader;
