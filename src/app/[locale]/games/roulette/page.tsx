import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RouletteGameClient from '@/components/roulette/RouletteGameClient';
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
    title: meta.roulette.title,
    description: meta.roulette.description,
    keywords: meta.roulette.keywords,
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
      images: [{ url: 'https://naegihaza.com', width: 1200, height: 630, alt: 'Naegihaza' }],
    },
  };
}

export default async function RoulettePage({ params }: Props) {
  await params; // Ensure params is resolved
  return (
    <div className="min-h-screen md:h-screen w-screen flex flex-col bg-[#fef3e2] overflow-auto md:overflow-hidden">
      <Header />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4 md:p-8">
          <RouletteGameClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
