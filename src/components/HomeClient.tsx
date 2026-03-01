'use client';

import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import GameCard from '@/components/GameCard';
import { BrickWall, Target, Coins } from 'lucide-react';

const ICON_BASE = 'w-9 h-9 md:w-14 md:h-14 stroke-[2.5]';

const GAME_ITEMS = [
  {
    key: 'breakout',
    icon: <BrickWall className={`${ICON_BASE} text-cyan-800`} />,
    bgColor: 'bg-cyan-300',
  },
  {
    key: 'slot',
    icon: <Coins className={`${ICON_BASE} text-purple-800`} />,
    bgColor: 'bg-purple-300',
  },
  {
    key: 'roulette',
    icon: <Target className={`${ICON_BASE} text-yellow-800`} />,
    bgColor: 'bg-yellow-300',
  },
];

export default function HomeClient() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as string;
  return (
    <div className="flex flex-col items-center gap-8 w-full pt-2 md:pt-8">
      {/* Games Grid */}
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
    </div>
  );
}
