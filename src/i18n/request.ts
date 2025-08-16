import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es'] as const;
type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

type Messages = {
  languageSwitcher: {
    switchTo: string;
    english: string;
    spanish: string;
  };
};

const loadMessages = async (locale: Locale): Promise<Messages> => {
  const module: { default: Messages } = await import(
    `../messages/${locale}.json`
  );
  return module.default;
};

export default getRequestConfig(async ({ locale }) => {
  const validLocale: Locale = locale === 'es' ? 'es' : 'en';

  try {
    return {
      locale: validLocale,
      messages: await loadMessages(validLocale),
      now: new Date(),
      timeZone: 'UTC',
    };
  } catch (error) {
    console.error(`Failed to load ${validLocale} messages`, error);
    return {
      locale: defaultLocale,
      messages: await loadMessages(defaultLocale),
      now: new Date(),
      timeZone: 'UTC',
    };
  }
});
