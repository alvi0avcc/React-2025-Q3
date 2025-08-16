'use client';

import './globals.css';
import Header from '@/header';
import { ThemeProvider } from 'src/context/themeProvider';
import { Wrapper } from '@/wrapper';
import { ErrorBoundary } from '@/error-boundary';
import { NextIntlClientProvider } from 'next-intl';
import { LocaleProvider, useLocaleContext } from '@src/context/localeContext';

import enMessages from '@src/app/messages/en.json';
import esMessages from '@src/app/messages/es.json';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="./images/react.svg" />
        <title>Star Trek API. Next SSR</title>
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider>
            <Wrapper>
              <LocaleProvider>
                <LocaleContent children={children} />
              </LocaleProvider>
            </Wrapper>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

function LocaleContent({ children }: { children: React.ReactNode }) {
  const { locale } = useLocaleContext();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={locale === 'en' ? enMessages : esMessages}
      timeZone="UTC"
      now={new Date()}
    >
      <Header />
      <main id="root">{children}</main>
    </NextIntlClientProvider>
  );
}
