import Link from 'next/link';
import { type ReactNode } from 'react';

type GameCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  href: string;
  disabled?: boolean;
};

export default function GameCard({
  title,
  description,
  icon,
  bgColor,
  href,
  disabled,
}: GameCardProps) {
  const content = (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-8 h-64
        ${bgColor}
        border-4 border-black
        transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 cursor-pointer'
        }
      `}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="font-game text-2xl font-black text-black mb-2">
        {title}
      </h3>
      <p className="font-game text-sm text-black/80 leading-relaxed">
        {description}
      </p>
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

  return <Link href={href}>{content}</Link>;
}
