import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScratchGameClient from '@/components/scratch/ScratchGameClient';
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
    title: meta.scratch.title,
    description: meta.scratch.description,
    keywords: meta.scratch.keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}/games/scratch`,
      languages: {
        ko: `${baseUrl}/ko/games/scratch`,
        en: `${baseUrl}/en/games/scratch`,
        zh: `${baseUrl}/zh/games/scratch`,
        es: `${baseUrl}/es/games/scratch`,
        'x-default': `${baseUrl}/ko/games/scratch`,
      },
    },
    openGraph: {
      title: meta.scratch.title,
      description: meta.scratch.description,
      url: `${baseUrl}/${locale}/games/scratch`,
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

export default async function ScratchPage({ params }: Props) {
  await params;
  return (
    <div className="h-screen max-h-[100dvh] w-screen flex flex-col bg-[#fef3e2] overflow-hidden">
      <Header />

      <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
        <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center p-2 md:p-4 overflow-hidden">
          <ScratchGameClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
