import styles from './header.module.css';

import { NavLink } from 'react-router';
import { useTheme } from '@/context/themeProvider';
import MoonIcon from '@/assets/moon.svg';
import SunIcon from '@/assets/sun.svg';
import LogoIcon from '@/assets/react.svg';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <NavLink className={styles.logo} to="/" end>
        <img src={LogoIcon} alt="Logo" />
      </NavLink>
      <div>
        <NavLink className={styles.navAbout} to="/about" end>
          About
        </NavLink>

        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? (
            <img src={MoonIcon} alt="Dark mode" />
          ) : (
            <img src={SunIcon} alt="Light mode" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
