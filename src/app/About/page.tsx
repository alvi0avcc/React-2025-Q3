'use client';

import Link from 'next/link';
import styles from './about.module.css';

import { useTranslations } from 'next-intl';

const About = () => {
  const t = useTranslations('About');
  return (
    <section className={styles.about}>
      <h2>{t('about')}</h2>
      <p>{t('description')}</p>
      <a
        href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/functional-routing.md"
        target="blank"
      >
        Task «React: Routing and Hooks»
      </a>
      <p>{t('respect')}</p>
      <a href="https://github.com/alvi0avcc" target="blank">
        Aleksandr
      </a>
      <br />
      <Link className={styles.goHome} href="/">
        {t('back')}
      </Link>

      <br />

      <a href="https://rs.school/courses/reactjs" target="blank">
        The Rolling Scopes 2025 - React Course
      </a>
    </section>
  );
};

export default About;
