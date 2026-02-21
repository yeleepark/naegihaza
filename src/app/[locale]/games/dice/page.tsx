import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import DiceGameClient from '@/components/dice/DiceGameClient';
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
    title: '주사위 굴리기',
    description: meta.dice.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/games/dice`,
      languages: {
        'ko': `${baseUrl}/ko/games/dice`,
        'en': `${baseUrl}/en/games/dice`,
        'zh': `${baseUrl}/zh/games/dice`,
        'es': `${baseUrl}/es/games/dice`,
        'x-default': `${baseUrl}/ko/games/dice`,
      },
    },
    openGraph: {
      title: meta.dice.title,
      description: meta.dice.description,
      url: `${baseUrl}/${locale}/games/dice`,
      locale: locale === 'ko' ? 'ko_KR' : locale === 'en' ? 'en_US' : locale === 'zh' ? 'zh_CN' : 'es_ES',
    },
  };
}

export default async function DicePage({ params }: Props) {
  await params; // Ensure params is resolved
  return (
    <div className="min-h-screen md:h-screen w-screen flex flex-col bg-[#fef3e2] overflow-auto md:overflow-hidden">
      <Header />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <WaveCurtain />

        <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4 md:p-8">
          <DiceGameClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
