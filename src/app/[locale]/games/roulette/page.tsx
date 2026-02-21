import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import RouletteGameClient from '@/components/roulette/RouletteGameClient';
import { type Locale } from '@/i18n/settings';
import { getMetadata } from '@/i18n/get-translations';

type Props = {
  params: { locale: Locale };
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const meta = getMetadata(locale);
  const baseUrl = 'https://naegihaza.com';

  return {
    title: '랜덤 룰렛',
    description: meta.roulette.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/games/roulette`,
      languages: {
        'ko': `${baseUrl}/ko/games/roulette`,
        'en': `${baseUrl}/en/games/roulette`,
        'zh': `${baseUrl}/zh/games/roulette`,
        'es': `${baseUrl}/es/games/roulette`,
        'x-default': `${baseUrl}/ko/games/roulette`,
      },
    },
    openGraph: {
      title: meta.roulette.title,
      description: meta.roulette.description,
      url: `${baseUrl}/${locale}/games/roulette`,
      locale: locale === 'ko' ? 'ko_KR' : locale === 'en' ? 'en_US' : locale === 'zh' ? 'zh_CN' : 'es_ES',
    },
  };
}

export default function RoulettePage({ params }: Props) {
  return (
    <div className="min-h-screen md:h-screen w-screen flex flex-col bg-[#fef3e2] overflow-auto md:overflow-hidden">
      <Header />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <WaveCurtain />

        <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4 md:p-8">
          <RouletteGameClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
