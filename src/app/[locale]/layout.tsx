import type { Metadata } from 'next';
import { Press_Start_2P, Jua } from "next/font/google";
import { locales, type Locale } from '@/i18n/settings';
import I18nProvider from '@/components/I18nProvider';
import { Analytics } from "@vercel/analytics/next"
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { createPageMetadata } from '@/lib/metadata';

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

const jua = Jua({
  variable: "--font-jua",
  weight: "400",
  subsets: ["latin"],
});

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
    <html lang={locale}>
      <head>
        <meta name="theme-color" content="#fef3e2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4501038602130909"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${pressStart2P.variable} ${jua.variable} antialiased`}>
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
      </body>
    </html>
  );
}
