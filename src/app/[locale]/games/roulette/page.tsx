import type { Metadata } from 'next';
import GamePageLayout from '@/components/layout/GamePageLayout';
import Header from '@/components/layout/Header';
import RouletteGameClient from '@/components/roulette/RouletteGameClient';
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
  return createPageMetadata(locale as Locale, 'roulette', '/games/roulette', { openGraph: true });
}

export default async function RoulettePage({ params }: Props) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const meta = getMetadata(locale as Locale);
  const faqSchema = generateFAQSchema(t.roulette.description.faq.items);
  const gameSchema = generateGameSchema(meta.roulette.title, meta.roulette.description, `https://www.freerandomgame.com/${locale}/games/roulette`);
  const breadcrumbSchema = generateBreadcrumbSchema(locale, meta.roulette.title, '/games/roulette');
  const howToSchema = generateHowToSchema(meta.roulette.title, t.roulette.howToPlay.steps);

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
        game={<RouletteGameClient />}
        description={<GameDescription description={t.roulette.description} locale={locale} currentGame="roulette" />}
      />
    </>
  );
}
