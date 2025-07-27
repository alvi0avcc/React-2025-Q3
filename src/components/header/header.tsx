import styles from './header.module.css';

import { NavLink } from 'react-router';

const Header = () => {
  return (
    <header className={styles.header}>
      <NavLink className={styles.logo} to="/" end>
        <img src="./react.svg" alt="Logo" />
      </NavLink>

      <NavLink className={styles.navAbout} to="/about" end>
        About
      </NavLink>
    </header>
  );
};

export default Header;
