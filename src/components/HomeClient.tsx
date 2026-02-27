'use client';

import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import GameCard from '@/components/GameCard';
import { BrickWall, Target, Dices, WavesLadder, Bomb, Cherry } from 'lucide-react';

const GAMES = ['breakout', 'slot', 'roulette', 'dice', 'ladder', 'bomb'];

const ICON_BASE = 'w-9 h-9 md:w-14 md:h-14 stroke-[2.5]';

const GAME_ITEMS = [
  {
    key: 'breakout',
    icon: <BrickWall className={`${ICON_BASE} text-cyan-800`} />,
    bgColor: 'bg-cyan-300',
  },
  {
    key: 'slot',
    icon: <Cherry className={`${ICON_BASE} text-purple-800`} />,
    bgColor: 'bg-purple-300',
  },
  {
    key: 'roulette',
    icon: <Target className={`${ICON_BASE} text-yellow-800`} />,
    bgColor: 'bg-yellow-300',
  },
  {
    key: 'dice',
    icon: <Dices className={`${ICON_BASE} text-blue-800`} />,
    bgColor: 'bg-blue-300',
  },
  {
    key: 'ladder',
    icon: <WavesLadder className={`${ICON_BASE} text-green-800`} />,
    bgColor: 'bg-green-300',
  },
  {
    key: 'bomb',
    icon: <Bomb className={`${ICON_BASE} text-red-800`} />,
    bgColor: 'bg-red-300',
  },
];

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
    <div className="flex flex-col items-center gap-8 w-full pt-2 md:pt-8">
      {/* Games Grid */}
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GAME_ITEMS.map((item) => (
            <GameCard
              key={item.key}
              title={t(`home.${item.key}.title`)}
              description={t(`home.${item.key}.description`)}
              icon={item.icon}
              bgColor={item.bgColor}
              href={`/${locale}/games/${item.key}`}
            />
          ))}
        </div>
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
