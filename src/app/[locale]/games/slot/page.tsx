import type { Metadata } from 'next';
import GamePageLayout from '@/components/layout/GamePageLayout';
import Header from '@/components/layout/Header';
import SlotGameClient from '@/components/slot/SlotGameClient';
import GameDescription from '@/components/ui/GameDescription';
import { type Locale } from '@/i18n/settings';
import { createPageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale as Locale, 'slot', '/games/slot', { openGraph: true });
}

export default async function SlotPage({ params }: Props) {
  await params;
  return (
    <GamePageLayout
      header={<Header />}
      game={<SlotGameClient />}
      description={<GameDescription gameKey="slot" />}
    />
  );
}
