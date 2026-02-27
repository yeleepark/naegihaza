import type { Metadata } from 'next';
import GamePageLayout from '@/components/layout/GamePageLayout';
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
    <GamePageLayout
      game={<BreakoutGameClient />}
      description={<GameDescription gameKey="breakout" />}
    />
  );
}
