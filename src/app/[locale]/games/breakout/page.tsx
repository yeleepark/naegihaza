import type { Metadata } from 'next';
import GamePageLayout from '@/components/layout/GamePageLayout';
import Header from '@/components/layout/Header';
import BreakoutGameClient from '@/components/breakout/BreakoutGameClient';
import GameDescription from '@/components/ui/GameDescription';
import { type Locale } from '@/i18n/settings';
import { createPageMetadata } from '@/lib/metadata';
import { getTranslations, getMetadata } from '@/i18n/get-translations';
import { generateFAQSchema, generateGameSchema, generateBreadcrumbSchema, generateHowToSchema } from '@/lib/structured-data';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale as Locale, 'breakout', '/games/breakout', { openGraph: true });
}

export default async function BreakoutPage({ params }: Props) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const meta = getMetadata(locale as Locale);
  const faqSchema = generateFAQSchema(t.breakout.description.faq.items);
  const gameSchema = generateGameSchema(meta.breakout.title, meta.breakout.description, `https://freerandomgame.com/${locale}/games/breakout`);
  const breadcrumbSchema = generateBreadcrumbSchema(locale, meta.breakout.title, '/games/breakout');
  const howToSchema = generateHowToSchema(meta.breakout.title, t.breakout.howToPlay.steps);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <GamePageLayout
        header={<Header />}
        game={<BreakoutGameClient />}
        description={<GameDescription description={t.breakout.description} locale={locale} currentGame="breakout" />}
      />
    </>
  );
}
