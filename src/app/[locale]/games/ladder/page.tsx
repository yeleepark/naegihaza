import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LadderGameClient from '@/components/ladder/LadderGameClient';
import GameDescription from '@/components/ui/GameDescription';
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
    title: meta.ladder.title,
    description: meta.ladder.description,
    keywords: meta.ladder.keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}/games/ladder`,
      languages: {
        ko: `${baseUrl}/ko/games/ladder`,
        en: `${baseUrl}/en/games/ladder`,
        zh: `${baseUrl}/zh/games/ladder`,
        es: `${baseUrl}/es/games/ladder`,
        'x-default': `${baseUrl}/ko/games/ladder`,
      },
    },
    openGraph: {
      title: meta.ladder.title,
      description: meta.ladder.description,
      url: `${baseUrl}/${locale}/games/ladder`,
      locale:
        locale === 'ko'
          ? 'ko_KR'
          : locale === 'en'
            ? 'en_US'
            : locale === 'zh'
              ? 'zh_CN'
              : 'es_ES',
      images: [{ url: 'https://naegihaza.com', width: 1200, height: 630, alt: 'Naegihaza' }],
    },
  };
}

export default async function LadderPage({ params }: Props) {
  await params;
  return (
    <div className="h-screen h-[100dvh] w-screen flex flex-col overflow-hidden bg-[#fef3e2]">
      <Header />

      <main className="relative flex-1 min-h-0 overflow-y-auto">
        <section className="h-[calc(100dvh-3.25rem)] flex items-start justify-center p-4 md:p-8">
          <LadderGameClient />
        </section>
        <section className="min-h-[calc(100dvh-3.25rem)] flex flex-col">
          <div className="flex-1 py-8">
            <GameDescription gameKey="ladder" />
          </div>
          <Footer />
        </section>
      </main>
    </div>
  );
}
