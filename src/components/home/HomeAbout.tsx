'use client';

import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { BrickWall, Coins, Target, Bomb, Flag } from 'lucide-react';

const SECTION_INTRO_KEYS = ['p1', 'p2', 'p3'] as const;
const SECTION_BIRTH_KEYS = ['p1', 'p2', 'p3', 'p4'] as const;
const GAME_KEYS = ['breakout', 'slot', 'roulette', 'bomb', 'horse'] as const;

const GAME_ICONS: Record<string, ReactNode> = {
  breakout: <BrickWall className="w-5 h-5 stroke-[2.5] inline-block align-text-bottom mr-1.5" />,
  slot: <Coins className="w-5 h-5 stroke-[2.5] inline-block align-text-bottom mr-1.5" />,
  roulette: <Target className="w-5 h-5 stroke-[2.5] inline-block align-text-bottom mr-1.5" />,
  bomb: <Bomb className="w-5 h-5 stroke-[2.5] inline-block align-text-bottom mr-1.5" />,
  horse: <Flag className="w-5 h-5 stroke-[2.5] inline-block align-text-bottom mr-1.5" />,
};

const SECTION_BGS = [
  '#e8f4f8', // intro - light blue
  '#d4f0e4', // birth - light mint
  '#e8e0f0', // features - light lavender
  '#fff4d4', // games - light yellow
  '#ffe8e0', // randomStart - light peach
  '#fce4ec', // useCases - light pink
  '#e0f4f4', // outro - light cyan
] as const;

export default function HomeAbout() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params?.locale || 'ko';

  const featuresItems = t('home.about.sections.features.items', { returnObjects: true }) as string[];
  const useCasesItems = t('home.about.sections.useCases.items', { returnObjects: true }) as string[];

  return (
    <>
      {/* intro */}
      <section
        className="md:min-h-screen md:min-h-[100dvh] md:h-screen md:h-[100dvh] flex items-center justify-center px-6 py-12 md:py-16 md:snap-start md:snap-always sa-animation sa-fade-up"
        style={{ backgroundColor: SECTION_BGS[0] }}
      >
        <div className="max-w-2xl w-full">
          <h2 className="font-game text-xl md:text-2xl font-black text-black mb-4">
            {t('home.about.sections.intro.title')}
          </h2>
          <div className="font-game text-base md:text-lg text-black/85 leading-relaxed space-y-4">
            {SECTION_INTRO_KEYS.map((key) => (
              <p key={key} className="whitespace-pre-line">
                {t(`home.about.sections.intro.${key}`)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* birth */}
      <section
        className="md:min-h-screen md:min-h-[100dvh] md:h-screen md:h-[100dvh] flex items-center justify-center px-6 py-12 md:py-16 md:snap-start md:snap-always sa-animation sa-fade-up"
        style={{ backgroundColor: SECTION_BGS[1] }}
      >
        <div className="max-w-2xl w-full">
          <h2 className="font-game text-xl md:text-2xl font-black text-black mb-4">
            {t('home.about.sections.birth.title')}
          </h2>
          <div className="font-game text-base md:text-lg text-black/85 leading-relaxed space-y-4">
            {SECTION_BIRTH_KEYS.map((key) => (
              <p key={key} className="whitespace-pre-line">
                {t(`home.about.sections.birth.${key}`)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section
        className="md:min-h-screen md:min-h-[100dvh] md:h-screen md:h-[100dvh] flex items-center justify-center px-6 py-12 md:py-16 md:snap-start md:snap-always sa-animation sa-fade-up overflow-y-auto"
        style={{ backgroundColor: SECTION_BGS[2] }}
      >
        <div className="max-w-2xl w-full my-auto">
          <h2 className="font-game text-xl md:text-2xl font-black text-black mb-4">
            {t('home.about.sections.features.title')}
          </h2>
          <ul className="list-disc list-inside font-game text-base md:text-lg text-black/85 leading-relaxed space-y-2 mb-4">
            {Array.isArray(featuresItems) &&
              featuresItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
          </ul>
          <p className="font-game text-base md:text-lg text-black/85 leading-relaxed whitespace-pre-line">
            {t('home.about.sections.features.closing')}
          </p>
        </div>
      </section>

      {/* games */}
      <section
        className="md:min-h-screen md:min-h-[100dvh] md:h-screen md:h-[100dvh] flex items-center justify-center px-6 py-12 md:py-16 md:snap-start md:snap-always sa-animation sa-fade-up overflow-y-auto"
        style={{ backgroundColor: SECTION_BGS[3] }}
      >
        <div className="max-w-2xl w-full my-auto">
          <h2 className="font-game text-xl md:text-2xl font-black text-black mb-6">
            {t('home.about.sections.games.title')}
          </h2>
          {/* Horizontal scroll row */}
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-2 px-2 snap-x snap-mandatory">
            {GAME_KEYS.map((gameKey) => {
              const recommend = t(`home.about.sections.games.${gameKey}.recommend`, {
                returnObjects: true,
              }) as string[];
              return (
                <div
                  key={gameKey}
                  className="flex-shrink-0 w-64 snap-start border-l-4 border-black/20 pl-3 pr-2"
                >
                  <a href={`/${locale}/games/${gameKey}`} className="font-game text-base font-black text-black mb-2 block hover:text-pink-600 transition-colors underline underline-offset-2">
                    {GAME_ICONS[gameKey]}{t(`home.about.sections.games.${gameKey}.title`)}
                  </a>
                  <p className="font-game text-sm text-black/85 leading-relaxed whitespace-pre-line mb-3">
                    {t(`home.about.sections.games.${gameKey}.desc`)}
                  </p>
                  <p className="font-game text-xs font-bold text-black/70 uppercase tracking-wide mb-1">
                    {t(`home.about.sections.games.${gameKey}.recommendTitle`)}
                  </p>
                  <ul className="list-disc list-inside font-game text-sm text-black/75 space-y-0.5">
                    {Array.isArray(recommend) &&
                      recommend.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* random start */}
      <section
        className="md:min-h-screen md:min-h-[100dvh] md:h-screen md:h-[100dvh] flex items-center justify-center px-6 py-12 md:py-16 md:snap-start md:snap-always sa-animation sa-fade-up"
        style={{ backgroundColor: SECTION_BGS[4] }}
      >
        <div className="max-w-2xl w-full">
          <h2 className="font-game text-xl md:text-2xl font-black text-black mb-4">
            {t('home.about.sections.randomStart.title')}
          </h2>
          <div className="font-game text-base md:text-lg text-black/85 leading-relaxed space-y-4">
            <p className="whitespace-pre-line">{t('home.about.sections.randomStart.p1')}</p>
            <p className="whitespace-pre-line">{t('home.about.sections.randomStart.p2')}</p>
          </div>
        </div>
      </section>

      {/* use cases */}
      <section
        className="md:min-h-screen md:min-h-[100dvh] md:h-screen md:h-[100dvh] flex items-center justify-center px-6 py-12 md:py-16 md:snap-start md:snap-always sa-animation sa-fade-up"
        style={{ backgroundColor: SECTION_BGS[5] }}
      >
        <div className="max-w-2xl w-full">
          <h2 className="font-game text-xl md:text-2xl font-black text-black mb-4">
            {t('home.about.sections.useCases.title')}
          </h2>
          <ul className="font-game text-base md:text-lg text-black/85 leading-relaxed grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside">
            {Array.isArray(useCasesItems) &&
              useCasesItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
          </ul>
        </div>
      </section>

      {/* outro */}
      <section
        className="md:min-h-screen md:min-h-[100dvh] md:h-screen md:h-[100dvh] flex items-center justify-center px-6 py-12 md:py-16 md:snap-start md:snap-always sa-animation sa-fade-up"
        style={{ backgroundColor: SECTION_BGS[6] }}
      >
        <p className="font-game text-base md:text-lg text-black/90 leading-relaxed whitespace-pre-line text-center max-w-2xl">
          {t('home.about.sections.outro')}
        </p>
      </section>
    </>
  );
}
