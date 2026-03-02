import type { Metadata } from 'next';
import GamePageLayout from '@/components/layout/GamePageLayout';
import Header from '@/components/layout/Header';
import SlotGameClient from '@/components/slot/SlotGameClient';
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
  return createPageMetadata(locale as Locale, 'slot', '/games/slot', { openGraph: true });
}

export default async function SlotPage({ params }: Props) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const meta = getMetadata(locale as Locale);
  const faqSchema = generateFAQSchema(t.slot.description.faq.items);
  const gameSchema = generateGameSchema(meta.slot.title, meta.slot.description, `https://freerandomgame.com/${locale}/games/slot`);
  const breadcrumbSchema = generateBreadcrumbSchema(locale, meta.slot.title, '/games/slot');
  const howToSchema = generateHowToSchema(meta.slot.title, t.slot.howToPlay.steps);

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
        game={<SlotGameClient />}
        description={<GameDescription description={t.slot.description} locale={locale} currentGame="slot" />}
      />
    </>
  );
}
