'use client';

import Header from 'src/components/header/header';
import { ThemeProvider } from 'src/context/themeProvider';
import { Wrapper } from '@/wrapper';
import { Provider } from 'react-redux';
import { store } from '@src/store/';
import { ErrorBoundary } from '@/error-boundary';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/src/assets/react.svg" />
        <title>Star Trek API. Next SSR</title>
      </head>
      <body>
        <ErrorBoundary>
          <Provider store={store}>
            <ThemeProvider>
              <Wrapper>
                <Header />
                <main id="root">{children}</main>
              </Wrapper>
            </ThemeProvider>
          </Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
