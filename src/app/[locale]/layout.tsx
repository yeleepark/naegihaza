import type { Metadata } from 'next';
import { locales, type Locale } from '@/i18n/settings';
import I18nProvider from '@/components/I18nProvider';
import { Analytics } from "@vercel/analytics/next"
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { createPageMetadata } from '@/lib/metadata';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Naegihaza',
  alternateName: '내기하자',
  url: 'https://naegihaza.com',
  description: "Let's bet! Free online betting game platform to enjoy with friends. Use random roulette and dice rolling to fairly decide order and make bets.",
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  creator: { '@type': 'Person', name: 'Seoyoon Park', email: 'dev.yelee@gmail.com' },
  inLanguage: ['ko', 'en', 'zh', 'es'],
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '1.0.0',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://naegihaza.com/{search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale as Locale, 'home', '');
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        suppressHydrationWarning
      />
      <I18nProvider locale={locale}>
        {children}
        <Analytics />
        <ServiceWorkerRegistration />
      </I18nProvider>
    </>
  );
}
