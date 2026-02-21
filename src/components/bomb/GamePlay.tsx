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
      className="relative"
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative w-full aspect-[3/4] cursor-pointer
          transition-transform duration-500
          [transform-style:preserve-3d]
          ${card.isFlipped || isFlipping ? '[transform:rotateY(180deg)]' : ''}
          ${card.isBomb && card.isFlipped ? 'animate-[shake_0.4s_ease-in-out]' : ''}
        `}
        onClick={() => !isDisabled && onCardFlip(card.id)}
        style={{
          transformStyle: 'preserve-3d',
          transform: card.isFlipped || isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.5s',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-xl border-4 border-black bg-gray-800 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-3xl font-black text-white select-none">?</span>
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
          <span className="text-3xl select-none">
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
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Turn indicator */}
      <div className="text-center">
        <div
          className="inline-block px-6 py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2"
          style={{ backgroundColor: playerColor }}
        >
          <p className="font-game text-2xl font-black text-black">
            {t('bomb.turnOf', { name: currentPlayer })}
          </p>
        </div>
        <p className="font-game text-sm font-bold text-black/60">
          {t('bomb.clickCard')}
        </p>
      </div>

      {/* Cards remaining */}
      <p className="font-game text-sm font-bold text-black/60">
        {t('bomb.cardsLeft', { count: remainingCards })}
      </p>

      {/* Card grid: 4×3 */}
      <div className="grid grid-cols-4 gap-3 w-full">
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
  );
}
