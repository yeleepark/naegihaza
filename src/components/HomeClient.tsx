'use client';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import GameCard from '@/components/GameCard';
import { BrickWall, Target, Dices, WavesLadder, Bomb, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';

const GAMES = ['breakout', 'roulette', 'dice', 'ladder', 'bomb'];

const ICON_BASE = 'w-16 h-16 stroke-[2.5]';

const GAME_ITEMS = [
  {
    key: 'breakout',
    icon: <BrickWall className={`${ICON_BASE} text-cyan-800`} />,
    bgColor: 'bg-cyan-300',
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
  const swiperRef = useRef<SwiperType | null>(null);

  const handleRandomGame = () => {
    const game = GAMES[Math.floor(Math.random() * GAMES.length)];
    router.push(`/${locale}/games/${game}`);
  };

  const arrowBase =
    'flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 transition-all duration-150 select-none cursor-pointer';

  return (
    <div className="flex flex-col items-center gap-8 w-full pt-4 md:pt-16 lg:pt-20">
      {/* Games Swiper */}
      <div className="w-full px-2 py-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Prev button */}
          <button
            aria-label="Previous slide"
            className={arrowBase}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft className="w-5 h-5" color="black" strokeWidth={3} />
          </button>

          <div className="flex-1 min-w-0">
            <Swiper
              modules={[Navigation, A11y]}
              spaceBetween={16}
              slidesPerView={1}
              centeredSlides={true}
              breakpoints={{
                640: { slidesPerView: 1.5, centeredSlides: false },
                768: { slidesPerView: 2, centeredSlides: false },
                1024: { slidesPerView: 4, spaceBetween: 24, centeredSlides: false },
              }}
              a11y={{
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
              }}
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
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

          {/* Next button */}
          <button
            aria-label="Next slide"
            className={arrowBase}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight className="w-5 h-5" color="black" strokeWidth={3} />
          </button>
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
