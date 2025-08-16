import './globals.css';

import Header from '@/header';
import { ThemeProvider } from 'src/context/themeProvider';
import { Wrapper } from '@/wrapper';
import { ErrorBoundary } from '@/error-boundary';

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
              <Header />
              <main id="root">{children}</main>
            </Wrapper>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
