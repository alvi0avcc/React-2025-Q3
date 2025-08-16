import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './request';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'never',
});

export const config = {
  matcher: [String.raw`/((?!api|_next|_vercel|.*\..*).*)`],
};
