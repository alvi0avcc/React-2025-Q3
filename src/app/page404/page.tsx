'use client';

import Link from 'next/link';
import styles from './page404.module.css';
import { useTranslations } from 'next-intl';

const Page404 = () => {
  const t = useTranslations('Page404');
  return (
    <main className={styles.main404}>
      <Link className={styles.goHome} href="/">
        {t('back')}
      </Link>
    </main>
  );
};

export default Page404;
