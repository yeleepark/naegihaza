import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LadderGameClient from '@/components/ladder/LadderGameClient';
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
    <div className="h-screen h-[100dvh] w-screen flex flex-col bg-[#fef3e2] overflow-y-auto snap-y snap-proximity">
      <Header />

      <div className="relative flex-1 flex flex-col">
        <main className="relative z-10 flex-1 flex items-start justify-center p-4 md:p-8">
          <LadderGameClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
