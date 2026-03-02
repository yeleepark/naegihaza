import type { Metadata } from 'next';
import GamePageLayout from '@/components/layout/GamePageLayout';
import Header from '@/components/layout/Header';
import MineGameClient from '@/components/mine/MineGameClient';
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
  return createPageMetadata(locale as Locale, 'mine', '/games/mine', { openGraph: true });
}

export default async function MinePage({ params }: Props) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const meta = getMetadata(locale as Locale);
  const faqSchema = generateFAQSchema(t.mine.description.faq.items);
  const gameSchema = generateGameSchema(meta.mine.title, meta.mine.description, `https://www.freerandomgame.com/${locale}/games/mine`);
  const breadcrumbSchema = generateBreadcrumbSchema(locale, meta.mine.title, '/games/mine');
  const howToSchema = generateHowToSchema(meta.mine.title, t.mine.howToPlay.steps);

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
        game={<MineGameClient />}
        description={<GameDescription description={t.mine.description} locale={locale} currentGame="mine" />}
      />
    </>
  );
}
