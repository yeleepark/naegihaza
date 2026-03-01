import type { Metadata } from 'next';
import GamePageLayout from '@/components/layout/GamePageLayout';
import Header from '@/components/layout/Header';
import BombGameClient from '@/components/bomb/BombGameClient';
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
  return createPageMetadata(locale as Locale, 'bomb', '/games/bomb', { openGraph: true });
}

export default async function BombPage({ params }: Props) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const meta = getMetadata(locale as Locale);
  const faqSchema = generateFAQSchema(t.bomb.description.faq.items);
  const gameSchema = generateGameSchema(meta.bomb.title, meta.bomb.description, `https://naegihaza.com/${locale}/games/bomb`);
  const breadcrumbSchema = generateBreadcrumbSchema(locale, meta.bomb.title, '/games/bomb');
  const howToSchema = generateHowToSchema(meta.bomb.title, t.bomb.howToPlay.steps);

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
        game={<BombGameClient />}
        description={<GameDescription description={t.bomb.description} locale={locale} currentGame="bomb" />}
      />
    </>
  );
}
