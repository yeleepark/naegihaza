import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import HomeClient from '@/components/HomeClient';
import { type Locale } from '@/i18n/settings';
import { getMetadata } from '@/i18n/get-translations';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = getMetadata(locale as Locale);
  const baseUrl = 'https://naegihaza.com';

  return {
    title: '홈',
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
    openGraph: {
      title: meta.home.title,
      description: meta.home.description,
      url: `${baseUrl}/${locale}`,
      locale: locale === 'ko' ? 'ko_KR' : locale === 'en' ? 'en_US' : locale === 'zh' ? 'zh_CN' : 'es_ES',
      alternateLocale: locales.filter(l => l !== locale).map(l =>
        l === 'ko' ? 'ko_KR' : l === 'en' ? 'en_US' : l === 'zh' ? 'zh_CN' : 'es_ES'
      ),
    },
  };
}

const locales = ['ko', 'en', 'zh', 'es'];

export default async function Home({ params }: Props) {
  await params; // Ensure params is resolved
  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#fef3e2]">
      <Header />

      <div className="relative flex-1 flex flex-col">
        <WaveCurtain />

        <main className="relative z-10 flex-1 flex items-center justify-center p-8 md:p-12">
          <HomeClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
