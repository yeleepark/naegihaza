import Link from 'next/link';
import { type ReactNode } from 'react';
import { Users } from 'lucide-react';

type GameCardProps = {
  title: string;
  description: string;
  badge: ReactNode;
  icon: ReactNode;
  bgColor: string;
  href: string;
  disabled?: boolean;
};

export default function GameCard({
  title,
  description,
  badge,
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
      <div className="mb-2 md:mb-4">{icon}</div>
      <h3 className="font-game text-base md:text-xl font-black text-black mb-1 md:mb-2">
        {title}
      </h3>
      <p className="font-game text-xs md:text-sm text-black/70 mb-2 md:mb-3">
        {description}
      </p>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/10 rounded-full font-game text-[11px] md:text-xs text-black/70">
        <Users className="w-3 h-3" />
        {badge}
      </span>
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
