'use client';

import GameCard from '@/components/GameCard';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

export default function HomeClient() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="flex flex-col items-center gap-8 w-full md:pt-12">
      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <GameCard
          title={t('home.roulette.title')}
          description={t('home.roulette.description')}
          icon="🎰"
          bgColor="bg-yellow-300"
          href={`/${locale}/games/roulette`}
        />
        <GameCard
          title={t('home.dice.title')}
          description={t('home.dice.description')}
          icon="🎲"
          bgColor="bg-blue-300"
          href={`/${locale}/games/dice`}
        />
        <GameCard
          title={t('home.ladder.title')}
          description={t('home.ladder.description')}
          icon="🪜"
          bgColor="bg-green-300"
          href={`/${locale}/games/ladder`}
        />
      </div>

      {/* Random Game Switch Button */}
      <a
        href={`/${locale}/games/roulette`}
        className="group flex items-center gap-3 bg-purple-400 hover:bg-purple-500 px-8 py-4 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <span className="font-game text-lg font-black text-black">
          {t('home.randomGame')}
        </span>
      </a>
    </div>
  );
}
