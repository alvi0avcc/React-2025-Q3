import styles from './page404.module.css';
import { NavLink } from 'react-router';

const Page404 = () => {
  return (
    <main className={styles.main}>
      <NavLink className={styles.goHome} to="/" end>
        Back to Home Page
      </NavLink>
    </main>
  );
};

export default Page404;
