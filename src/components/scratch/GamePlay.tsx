'use client';

import { ScratchCard } from '@/types/scratch';
import ScratchCardItem from '@/components/scratch/ScratchCardItem';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

type GamePlayProps = {
  cards: ScratchCard[];
  winnerCount: number;
  onScratched: (id: number) => void;
  onShowResult: () => void;
};

export default function GamePlay({ cards, winnerCount, onScratched, onShowResult }: GamePlayProps) {
  const { t } = useTranslation();
  const scratchedCount = cards.filter((c) => c.isScratched).length;
  const allScratched = scratchedCount === cards.length;

  // Determine grid columns based on card count
  const count = cards.length;
  let cols = 'grid-cols-3';
  if (count <= 2) cols = 'grid-cols-2';
  else if (count <= 4) cols = 'grid-cols-2 sm:grid-cols-4';
  else if (count <= 6) cols = 'grid-cols-3';
  else if (count <= 8) cols = 'grid-cols-4';
  else cols = 'grid-cols-4 sm:grid-cols-5';

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full min-h-0 flex-1">
      {/* Header */}
      <div className="text-center shrink-0">
        <div className="inline-block px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-300 mb-1">
          <p className="font-game text-lg md:text-2xl font-black text-black">
            🎟️ {t('scratch.title')}
          </p>
        </div>
        <p className="font-game text-xs font-bold text-black/60">
          {t('scratch.winnerCountLabel', { count: winnerCount })} · {t('scratch.scratchedCount', { done: scratchedCount, total: cards.length })}
        </p>
      </div>

      {/* Cards grid */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto">
        <div className={`grid ${cols} gap-2 sm:gap-3 p-2 max-w-2xl mx-auto`}>
          {cards.map((card) => (
            <ScratchCardItem key={card.id} card={card} onScratched={onScratched} />
          ))}
        </div>
      </div>

      {/* Show result button */}
      {allScratched && (
        <div className="shrink-0 pb-2">
          <Button onClick={onShowResult} variant="primary" className="lowercase">
            {t('scratch.showResult')}
          </Button>
        </div>
      )}
    </div>
  );
}
