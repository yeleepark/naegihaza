import type { Metadata } from 'next';
import GamePageLayout from '@/components/layout/GamePageLayout';
import Header from '@/components/layout/Header';
import DiceGameClient from '@/components/dice/DiceGameClient';
import GameDescription from '@/components/ui/GameDescription';
import { type Locale } from '@/i18n/settings';
import { createPageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale as Locale, 'dice', '/games/dice', { openGraph: true });
}

export default async function DicePage({ params }: Props) {
  await params;
  return (
    <GamePageLayout
      header={<Header />}
      game={<DiceGameClient />}
      description={<GameDescription gameKey="dice" />}
    />
  );
}
