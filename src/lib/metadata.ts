import type { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from '@/i18n/settings';
import { getMetadata } from '@/i18n/get-translations';

const BASE_URL = 'https://naegihaza.com';

const OG_LOCALE_MAP: Record<string, string> = {
  ko: 'ko_KR',
  en: 'en_US',
  zh: 'zh_CN',
  es: 'es_ES',
};

type MetaKey = 'home' | 'dice' | 'roulette' | 'ladder' | 'bomb' | 'breakout' | 'slot' | 'privacy' | 'terms';

export function createPageMetadata(
  locale: Locale,
  metaKey: MetaKey,
  path: string,
  options?: {
    xDefault?: string;
    openGraph?: boolean;
    alternateLocale?: boolean;
  },
): Metadata {
  const meta = getMetadata(locale);
  const pageMeta = meta[metaKey];

  const metadata: Metadata = {
    title: pageMeta.title,
    description: pageMeta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}${path}`,
      languages: {
        ...Object.fromEntries(
          locales.map(l => [l, `${BASE_URL}/${l}${path}`]),
        ),
        'x-default': `${BASE_URL}/${options?.xDefault ?? defaultLocale}${path}`,
      },
    },
  };

  if ('keywords' in pageMeta) {
    metadata.keywords = (pageMeta as { keywords: string[] }).keywords;
  }

  if (options?.openGraph) {
    metadata.openGraph = {
      title: pageMeta.title,
      description: pageMeta.description,
      url: `${BASE_URL}/${locale}${path}`,
      locale: OG_LOCALE_MAP[locale],
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Naegihaza' }],
      ...(options.alternateLocale && {
        alternateLocale: locales
          .filter(l => l !== locale)
          .map(l => OG_LOCALE_MAP[l]),
      }),
    };
  }

  return metadata;
}
