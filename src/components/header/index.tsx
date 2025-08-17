'use client';

import Link from 'next/link';
import styles from './header.module.css';

import { useTheme } from 'src/context/themeProvider';
import Image from 'next/image';
import LanguageSwitcher from '@/languageSwitcher';
import { useTranslations } from 'next-intl';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('Header');

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/">
        <Image src="/images/react.svg" alt="Logo" width={32} height={32} />
      </Link>
      <div>
        <Link className={styles.navAbout} href="/about">
          {t('about')}
        </Link>

        <LanguageSwitcher />

        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          title={`${t('switch')} ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-label={`${t('switch')} ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? (
            <Image
              src="/images/moon.svg"
              alt="Dark mode"
              width={24}
              height={24}
            />
          ) : (
            <Image
              src="/images/sun.svg"
              alt="Light mode"
              width={24}
              height={24}
            />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
