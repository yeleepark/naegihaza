import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
    keywords: meta.bomb.keywords,
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
      images: [{ url: 'https://naegihaza.com', width: 1200, height: 630, alt: 'Naegihaza' }],
    },
  };
}

export default async function BombPage({ params }: Props) {
  await params;
  return (
    <div className="h-screen h-[100dvh] w-screen flex flex-col bg-[#fef3e2] overflow-y-auto snap-y snap-proximity">
      <Header />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center p-2 md:p-4">
          <BombGameClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
