import type { Metadata } from 'next';
import { locales, type Locale } from '@/i18n/settings';
import { getMetadata } from '@/i18n/get-translations';
import I18nProvider from '@/components/I18nProvider';

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const meta = getMetadata(locale);
  const baseUrl = 'https://naegihaza.com';

  return {
    title: meta.home.title,
    description: meta.home.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'ko': `${baseUrl}/ko`,
        'en': `${baseUrl}/en`,
        'zh': `${baseUrl}/zh`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/ko`,
      },
    },
  };
}

export default function LocaleLayout({ children, params }: Props) {
  return <I18nProvider>{children}</I18nProvider>;
}
