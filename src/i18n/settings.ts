export const locales = ['ko', 'en', 'zh', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  es: 'Español',
};

export const localeLabels: Record<Locale, { native: string; english: string }> = {
  ko: { native: '한국어', english: 'Korean' },
  en: { native: 'English', english: 'English' },
  zh: { native: '中文', english: 'Chinese' },
  es: { native: 'Español', english: 'Spanish' },
};
