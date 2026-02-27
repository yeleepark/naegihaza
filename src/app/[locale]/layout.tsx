import type { Metadata } from 'next';
import { locales, type Locale } from '@/i18n/settings';
import I18nProvider from '@/components/I18nProvider';
import { Analytics } from "@vercel/analytics/next"
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import InstallPrompt from '@/components/ui/InstallPrompt';
import { createPageMetadata } from '@/lib/metadata';

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
    <I18nProvider locale={locale}>
      {children}
      <Analytics />
      <ServiceWorkerRegistration />
      <InstallPrompt />
    </I18nProvider>
  );
}
