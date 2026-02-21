'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DiceResult } from '@/types/dice';
import { SEGMENT_COLORS } from '@/utils/dice';
import { useTranslation } from 'react-i18next';

type GameResultProps = {
  result: DiceResult;
  onPlayAgain: () => void;
  onReset: () => void;
};

function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    // 왼쪽에서 발사
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399'],
    });

    // 오른쪽에서 발사
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  // 초기 폭발
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399'],
  });

  frame();
}

export default function GameResult({
  result,
  onPlayAgain,
  onReset,
}: GameResultProps) {
  const { t } = useTranslation();

  useEffect(() => {
    fireConfetti();

    return () => {
      confetti.reset();
    };
  }, []);

  const isTie = result.winners.length > 1;
  const winnerColor = SEGMENT_COLORS[result.winners[0].id % SEGMENT_COLORS.length];

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10">
        <div className="text-center">
          <h2 className="font-game text-2xl font-black text-black mb-6">
            {isTie ? t('dice.result.tie') : t('dice.result.win')}
          </h2>

          <div
            className="rounded-xl p-8 mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: winnerColor }}
          >
            {isTie ? (
              <div>
                {result.winners.map((winner, index) => (
                  <p
                    key={winner.id}
                    className="font-game text-3xl md:text-4xl font-black text-black break-words"
                  >
                    {winner.name}
                    {index < result.winners.length - 1 && ', '}
                  </p>
                ))}
              </div>
            ) : (
              <p className="font-game text-4xl md:text-5xl font-black text-black break-words">
                {result.winners[0].name}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-4xl">🎲🎲</span>
              <span className="font-game text-3xl font-black text-black">
                {t('dice.result.points', { value: result.winningValue })}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onPlayAgain}
              variant="primary"
              className="w-full lowercase"
            >
              {t('common.playAgain')}
            </Button>
            <Button
              onClick={onReset}
              variant="secondary"
              className="w-full lowercase"
            >
              {t('common.reset')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
