'use client';

import GameCard from '@/components/GameCard';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';

const GAMES = ['roulette', 'dice', 'ladder', 'bomb'];

export default function HomeClient() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const handleRandomGame = () => {
    const game = GAMES[Math.floor(Math.random() * GAMES.length)];
    router.push(`/${locale}/games/${game}`);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full md:pt-12">
      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
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
        <GameCard
          title={t('home.bomb.title')}
          description={t('home.bomb.description')}
          icon="💣"
          bgColor="bg-red-300"
          href={`/${locale}/games/bomb`}
        />
      </div>

      {/* Random Game Button */}
      <button
        onClick={handleRandomGame}
        className="font-game text-lg font-black text-black bg-purple-400 hover:bg-purple-500 px-8 py-4 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200"
      >
        {t('home.randomGame')}
      </button>
    </div>
  );
}
