import { locales } from '@/i18n/settings';
import I18nProvider from '@/components/I18nProvider';
import { Analytics } from "@vercel/analytics/next"
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RandomGame.zip',
  alternateName: '랜덤게임.zip',
  url: 'https://www.freerandomgame.com',
  description: "Free online random game platform to enjoy with friends. Use roulette, slot machine, and breakout to fairly decide with fun.",
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  creator: { '@type': 'Person', name: 'Seoyoon Park', email: 'dev.yelee@gmail.com' },
  inLanguage: ['ko', 'en', 'zh', 'es'],
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '1.0.0',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.freerandomgame.com/{search_term_string}',
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
