'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ScratchResult } from '@/types/scratch';
import { useTranslation } from 'react-i18next';

type GameResultProps = {
  result: ScratchResult;
  onPlayAgain: () => void;
  onReset: () => void;
};

function fireCelebration() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.4 },
    colors: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
    gravity: 0.9,
    scalar: 1.1,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.7 },
      colors: ['#fbbf24', '#f59e0b', '#10b981'],
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.7 },
      colors: ['#fbbf24', '#f59e0b', '#10b981'],
    });
  }, 200);
}

export default function GameResult({ result, onPlayAgain, onReset }: GameResultProps) {
  const { t } = useTranslation();

  useEffect(() => {
    fireCelebration();
    return () => { confetti.reset(); };
  }, []);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10">
        <div className="text-center">
          <div className="text-5xl mb-3">🎊</div>
          <h2 className="font-game text-2xl font-black text-black mb-6">
            {t('scratch.result.title')}
          </h2>

          {/* Winners */}
          <div className="mb-4">
            <p className="font-game text-sm font-bold text-black/60 mb-2">
              {t('scratch.result.winners')}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {result.winners.map((name) => (
                <div
                  key={name}
                  className="rounded-xl px-4 py-2 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-yellow-300"
                >
                  <span className="font-game text-lg font-black text-black">🎊 {name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={onPlayAgain} variant="primary" className="w-full lowercase">
              {t('common.playAgain')}
            </Button>
            <Button onClick={onReset} variant="secondary" className="w-full lowercase">
              {t('common.reset')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
