'use client';

import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import GameCard from '@/components/GameCard';
import 'swiper/css';
import 'swiper/css/pagination';

const GAMES = ['roulette', 'dice', 'ladder', 'bomb'];

const GAME_ITEMS = [
  {
    key: 'roulette',
    icon: '🎰',
    bgColor: 'bg-yellow-300',
  },
  {
    key: 'dice',
    icon: '🎲',
    bgColor: 'bg-blue-300',
  },
  {
    key: 'ladder',
    icon: '🪜',
    bgColor: 'bg-green-300',
  },
  {
    key: 'bomb',
    icon: '💣',
    bgColor: 'bg-red-300',
  },
] as const;

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
    <div className="flex flex-col items-center gap-8 w-full pt-4 md:pt-16 lg:pt-20">
      {/* Games Swiper - full width on desktop */}
      <div className="w-full px-2 py-4 md:px-6 lg:px-8">
        <Swiper
          modules={[Pagination, A11y]}
          spaceBetween={16}
          slidesPerView={1.15}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          pagination={{ clickable: true }}
          a11y={{
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
          }}
          className="!pb-10"
        >
          {GAME_ITEMS.map((item) => (
            <SwiperSlide key={item.key} className="!py-4 !px-3">
              <GameCard
                title={t(`home.${item.key}.title`)}
                description={t(`home.${item.key}.description`)}
                icon={item.icon}
                bgColor={item.bgColor}
                href={`/${locale}/games/${item.key}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
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
