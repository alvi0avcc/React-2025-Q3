'use client';

import styles from './loader.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Loader = () => {
  const t = useTranslations('Loader');
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
      <div className={styles.loading}>{t('loader')}</div>
    </div>
  );
};

export default Loader;
