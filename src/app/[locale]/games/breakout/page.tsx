import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakoutGameClient from '@/components/breakout/BreakoutGameClient';
import GameDescription from '@/components/ui/GameDescription';
import { type Locale } from '@/i18n/settings';
import { createPageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale as Locale, 'breakout', '/games/breakout', { openGraph: true });
}

export default async function BreakoutPage({ params }: Props) {
  await params;
  return (
    <div className="h-screen h-[100dvh] w-screen flex flex-col overflow-hidden bg-[#fef3e2]">
      <Header />

      <main className="relative flex-1 min-h-0 overflow-y-auto">
        <section className="h-[calc(100dvh-3.25rem)] flex items-start justify-center p-4 md:p-8">
          <BreakoutGameClient />
        </section>
        <section className="min-h-[calc(100dvh-3.25rem)] flex flex-col">
          <div className="flex-1 py-8">
            <GameDescription gameKey="breakout" />
          </div>
          <Footer />
        </section>
      </main>
    </div>
  );
}
