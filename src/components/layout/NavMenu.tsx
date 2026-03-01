'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import {
  X,
  Home,
  BrickWall,
  Coins,
  Target,
  Bomb,
} from 'lucide-react';

const GAME_ITEMS = [
  { key: 'breakout', icon: BrickWall, color: 'text-cyan-400' },
  { key: 'slot', icon: Coins, color: 'text-purple-400' },
  { key: 'roulette', icon: Target, color: 'text-yellow-400' },
  { key: 'bomb', icon: Bomb, color: 'text-red-400' },
];

interface NavMenuProps {
  onClose: () => void;
}

export default function NavMenu({ onClose }: NavMenuProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll while menu is open (mobile only)
  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* Backdrop: dark on mobile, transparent on desktop (click-outside) */}
      <div
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
        onClick={onClose}
      />

      {/* Nav panel: fullscreen on mobile, dropdown on desktop */}
      <nav
        className="fixed inset-0 z-50 flex flex-col max-w-md mx-auto px-6 py-4
          md:absolute md:inset-auto md:right-0 md:top-full md:mt-2
          md:w-56 md:max-w-none md:mx-0
          md:rounded-lg md:shadow-xl md:bg-gray-900 md:py-3 md:px-2"
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="self-end p-2 text-white/70 hover:text-white transition-colors md:hidden"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Menu items */}
        <div className="flex flex-col gap-2 mt-4 md:mt-0">
          {/* Home link */}
          <Link
            href={`/${locale}`}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-game text-sm">{t('header.backToList')}</span>
          </Link>

          <div className="border-t border-white/10 my-2" />

          {/* Game list */}
          {GAME_ITEMS.map((item) => {
            const Icon = item.icon;
            const gamePath = `/${locale}/games/${item.key}`;
            const isActive = pathname.startsWith(gamePath);

            return (
              <Link
                key={item.key}
                href={gamePath}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                <span className="font-game text-sm">
                  {t(`home.${item.key}.title`)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
