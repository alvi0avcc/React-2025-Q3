'use client';

import Link from 'next/link';
import styles from './header.module.css';

// import { NavLink } from 'react-router';
import { useTheme } from 'src/context/themeProvider';
// import MoonIcon from '@/assets/moon.svg';
// import SunIcon from '@/assets/sun.svg';
// import LogoIcon from '@/assets/react.svg';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/">
        {/* <img src={LogoIcon} alt="Logo" key="logo" /> */}
      </Link>
      <div>
        <Link className={styles.navAbout} href="/about">
          About
        </Link>

        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {/* {theme === 'light' ? (
            <img src={MoonIcon} alt="Dark mode" />
          ) : (
            <img src={SunIcon} alt="Light mode" />
          )} */}
        </button>
      </div>
    </header>
  );
};

export default Header;
