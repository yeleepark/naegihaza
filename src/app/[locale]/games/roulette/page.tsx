import type { Metadata } from 'next';
import GamePageLayout from '@/components/layout/GamePageLayout';
import RouletteGameClient from '@/components/roulette/RouletteGameClient';
import GameDescription from '@/components/ui/GameDescription';
import { type Locale } from '@/i18n/settings';
import { createPageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale as Locale, 'roulette', '/games/roulette', { openGraph: true });
}

export default async function RoulettePage({ params }: Props) {
  await params;
  return (
    <GamePageLayout
      game={<RouletteGameClient />}
      description={<GameDescription gameKey="roulette" />}
    />
  );
}
