'use client';

import { createContext, useContext, useState } from 'react';

const LocaleContext = createContext<{
  locale: string;
  setLocale: (locale: string) => void;
}>({
  locale: 'en',
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('en');

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  return useContext(LocaleContext);
}
