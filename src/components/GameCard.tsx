import Link from 'next/link';
import { type ReactNode } from 'react';
import { Users, Crosshair, ListOrdered } from 'lucide-react';

type GameCardProps = {
  title: string;
  description: string;
  badge: ReactNode;
  gameType?: { label: string; type: 'pickOne' | 'ranking' };
  icon: ReactNode;
  bgColor: string;
  href: string;
  disabled?: boolean;
};

const GAME_TYPE_ICON = {
  pickOne: Crosshair,
  ranking: ListOrdered,
};

export default function GameCard({
  title,
  description,
  badge,
  gameType,
  icon,
  bgColor,
  href,
  disabled,
}: GameCardProps) {
  const content = (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-3 md:p-5 h-full
        ${bgColor}
        border-4 border-black
        transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 cursor-pointer'
        }
      `}
    >
      {/* Mobile/Tablet: horizontal layout */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-game text-base font-black text-black">
            {title}
          </h3>
          <p className="font-game text-xs text-black/70 mt-0.5">
            {description}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/10 rounded-full font-game text-[11px] text-black/70">
              <Users className="w-3 h-3" />
              {badge}
            </span>
            {gameType && (() => { const TypeIcon = GAME_TYPE_ICON[gameType.type]; return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/20 rounded-full font-game text-[11px] text-black/80 font-bold">
                <TypeIcon className="w-3 h-3" />
                {gameType.label}
              </span>
            ); })()}
          </div>
        </div>
      </div>
      {/* Desktop: vertical layout */}
      <div className="hidden lg:block">
        <div className="mb-4">{icon}</div>
        <h3 className="font-game text-xl font-black text-black mb-2">
          {title}
        </h3>
        <p className="font-game text-sm text-black/70 mb-3">
          {description}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/10 rounded-full font-game text-xs text-black/70">
            <Users className="w-3 h-3" />
            {badge}
          </span>
          {gameType && (() => { const TypeIcon = GAME_TYPE_ICON[gameType.type]; return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/20 rounded-full font-game text-xs text-black/80 font-bold">
              <TypeIcon className="w-3 h-3" />
              {gameType.label}
            </span>
          ); })()}
        </div>
      </div>
      {disabled && (
        <div className="absolute top-4 right-4 bg-black px-3 py-1.5 rounded-lg text-[10px] text-white font-pixel">
          Coming Soon
        </div>
      )}
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href} className="h-full">{content}</Link>;
}
