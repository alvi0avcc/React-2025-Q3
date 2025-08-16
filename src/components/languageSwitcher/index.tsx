'use client';

import { useLocaleContext } from '@src/context/localeContext';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext();
  const [currentLocale, setCurrentLocale] = useState(locale);
  const t = useTranslations('LanguageSwitcher');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLocale(e.target.value);
    setLocale(e.target.value);
  };

  return (
    <select value={currentLocale} onChange={handleChange}>
      <option value="en">{t('english')}</option>
      <option value="es">{t('spanish')}</option>
    </select>
  );
}
