import Link from 'next/link';
import styles from './page404.module.css';

const Page404 = () => {
  return (
    <main className={styles.main404}>
      <Link className={styles.goHome} href="/">
        Back to Home Page
      </Link>
    </main>
  );
};

export default Page404;
