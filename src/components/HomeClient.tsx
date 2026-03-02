'use client';

import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import GameCard from '@/components/GameCard';
import { BrickWall, Target, Coins, Bomb, Flag, Grid3x3 } from 'lucide-react';

const ICON_BASE = 'w-6 h-6 md:w-14 md:h-14 stroke-[2.5]';

const GAME_ITEMS = [
  {
    key: 'breakout',
    icon: <BrickWall className={`${ICON_BASE} text-cyan-800`} />,
    bgColor: 'bg-cyan-300',
    minPlayers: 2,
    maxPlayers: 100,
    mobileMaxPlayers: 10,
    gameType: 'pickOne' as const,
  },
  {
    key: 'slot',
    icon: <Coins className={`${ICON_BASE} text-rose-800`} />,
    bgColor: 'bg-rose-300',
    minPlayers: 2,
    maxPlayers: 100,
    gameType: 'pickOne' as const,
  },
  {
    key: 'roulette',
    icon: <Target className={`${ICON_BASE} text-yellow-800`} />,
    bgColor: 'bg-yellow-300',
    minPlayers: 2,
    maxPlayers: 12,
    gameType: 'pickOne' as const,
  },
  {
    key: 'bomb',
    icon: <Bomb className={`${ICON_BASE} text-orange-800`} />,
    bgColor: 'bg-orange-300',
    minPlayers: 2,
    maxPlayers: 20,
    gameType: 'pickOne' as const,
  },
  {
    key: 'horse',
    icon: <Flag className={`${ICON_BASE} text-green-800`} />,
    bgColor: 'bg-green-300',
    minPlayers: 2,
    maxPlayers: 10,
    gameType: 'ranking' as const,
  },
  {
    key: 'mine',
    icon: <Grid3x3 className={`${ICON_BASE} text-purple-800`} />,
    bgColor: 'bg-purple-300',
    minPlayers: 2,
    maxPlayers: 10,
    gameType: 'pickOne' as const,
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {GAME_ITEMS.map((item) => (
            <GameCard
              key={item.key}
              title={t(`home.${item.key}.title`)}
              description={t(`home.${item.key}.description`)}
              badge={
                item.mobileMaxPlayers ? (
                  <>
                    <span className="md:hidden">{t('common.players', { min: item.minPlayers, max: item.mobileMaxPlayers })}</span>
                    <span className="hidden md:inline">{t('common.players', { min: item.minPlayers, max: item.maxPlayers })}</span>
                  </>
                ) : (
                  t('common.players', { min: item.minPlayers, max: item.maxPlayers })
                )
              }
              gameType={{ label: t(`common.gameType.${item.gameType}`), type: item.gameType }}
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
