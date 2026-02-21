import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import BombGameClient from '@/components/bomb/BombGameClient';
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
    title: meta.bomb.title,
    description: meta.bomb.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/games/bomb`,
      languages: {
        'ko': `${baseUrl}/ko/games/bomb`,
        'en': `${baseUrl}/en/games/bomb`,
        'zh': `${baseUrl}/zh/games/bomb`,
        'es': `${baseUrl}/es/games/bomb`,
        'x-default': `${baseUrl}/ko/games/bomb`,
      },
    },
    openGraph: {
      title: meta.bomb.title,
      description: meta.bomb.description,
      url: `${baseUrl}/${locale}/games/bomb`,
      locale: locale === 'ko' ? 'ko_KR' : locale === 'en' ? 'en_US' : locale === 'zh' ? 'zh_CN' : 'es_ES',
    },
  };
}

export default async function BombPage({ params }: Props) {
  await params;
  return (
    <div className="min-h-screen md:h-screen w-screen flex flex-col bg-[#fef3e2] overflow-auto md:overflow-hidden">
      <Header />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <WaveCurtain />

        <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4 md:p-8">
          <BombGameClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
