'use client';

import { Card as CardType } from '@/types/bomb';
import { PARTICIPANT_COLORS } from '@/utils/bomb';
import { useTranslation } from 'react-i18next';

type GamePlayProps = {
  participants: string[];
  cards: CardType[];
  currentTurnIndex: number;
  flippingCardId: number | null;
  onCardFlip: (cardId: number) => void;
};

type CardItemProps = {
  card: CardType;
  flippingCardId: number | null;
  onCardFlip: (cardId: number) => void;
};

function CardItem({ card, flippingCardId, onCardFlip }: CardItemProps) {
  const isFlipping = flippingCardId === card.id;
  const isDisabled = card.isFlipped || flippingCardId !== null;

  return (
    <div
      className="relative w-full h-full min-h-0 flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative h-full w-auto max-w-full cursor-pointer flex-shrink-0
          transition-transform duration-500
          [transform-style:preserve-3d]
          ${card.isFlipped || isFlipping ? '[transform:rotateY(180deg)]' : ''}
          ${card.isBomb && card.isFlipped ? 'animate-[shake_0.4s_ease-in-out]' : ''}
        `}
        style={{
          aspectRatio: '3/4',
          transformStyle: 'preserve-3d',
          transform: card.isFlipped || isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.5s',
        }}
        onClick={() => !isDisabled && onCardFlip(card.id)}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-xl border-4 border-black bg-gray-800 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-2xl md:text-3xl font-black text-white select-none">?</span>
        </div>

        {/* Back face */}
        <div
          className={`absolute inset-0 rounded-xl border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            card.isBomb ? 'bg-red-500' : 'bg-green-400'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className="text-2xl md:text-3xl select-none">
            {card.isBomb ? '💣' : card.safeIcon}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GamePlay({
  participants,
  cards,
  currentTurnIndex,
  flippingCardId,
  onCardFlip,
}: GamePlayProps) {
  const { t } = useTranslation();
  const currentPlayer = participants[currentTurnIndex];
  const playerColor = PARTICIPANT_COLORS[currentTurnIndex % PARTICIPANT_COLORS.length];
  const remainingCards = cards.filter((c) => !c.isFlipped).length;

  return (
    <div className="flex flex-col items-center gap-2 md:gap-3 w-full h-full min-h-0 flex-1">
      {/* Turn indicator */}
      <div className="text-center shrink-0">
        <div
          className="inline-block px-4 py-2 md:px-6 md:py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-1"
          style={{ backgroundColor: playerColor }}
        >
          <p className="font-game text-lg md:text-2xl font-black text-black">
            {t('bomb.turnOf', { name: currentPlayer })}
          </p>
        </div>
        <p className="font-game text-xs md:text-sm font-bold text-black/60">
          {t('bomb.clickCard')}
        </p>
      </div>

      {/* Cards remaining */}
      <p className="font-game text-xs md:text-sm font-bold text-black/60 shrink-0">
        {t('bomb.cardsLeft', { count: remainingCards })}
      </p>

      {/* Card grid: fills remaining height, no scroll — cards scale to fit */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
        <div
          className="grid w-full h-full max-w-2xl gap-1.5 sm:gap-2 md:gap-3 p-1"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '1fr',
          }}
        >
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              flippingCardId={flippingCardId}
              onCardFlip={onCardFlip}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
