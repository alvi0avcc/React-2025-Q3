'use client';

import './globals.css';

import Header from '@/header';
import { ThemeProvider } from 'src/context/themeProvider';
import { Wrapper } from '@/wrapper';
import { Provider } from 'react-redux';
import { store } from '@src/store/';
import { ErrorBoundary } from '@/error-boundary';

import { useEffect, useState } from 'react';
import Loader from '@/loader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="./images/react.svg" />
        <title>Star Trek API. Next SSR</title>
      </head>
      <body suppressHydrationWarning={!isClient}>
        <ErrorBoundary>
          <main id="root">
            {!isClient ? (
              <Loader />
            ) : (
              <Provider store={store}>
                <ThemeProvider>
                  <Wrapper>
                    <Header />
                    <main id="root">{children}</main>
                  </Wrapper>
                </ThemeProvider>
              </Provider>
            )}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
