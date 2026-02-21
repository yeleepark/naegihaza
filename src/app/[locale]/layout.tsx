import type { Metadata } from 'next';
import { locales, type Locale } from '@/i18n/settings';
import { getMetadata } from '@/i18n/get-translations';
import I18nProvider from '@/components/I18nProvider';
import { Analytics } from "@vercel/analytics/next"

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = getMetadata(locale as Locale);
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

export default async function LocaleLayout({ children, params }: Props) {
  await params; // Ensure params is resolved
  return <I18nProvider>
    {children}
    <Analytics />
    </I18nProvider>;
}
