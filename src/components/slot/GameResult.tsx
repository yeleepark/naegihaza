'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SlotResult } from '@/types/slot';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';

type GameResultProps = {
  result: SlotResult;
  onPlayAgain: () => void;
  onReset: () => void;
};

function fireCelebration() {
  const colors = ['#a855f7', '#fbbf24', '#f472b6', '#60a5fa', '#34d399'];

  confetti({
    particleCount: 180,
    spread: 120,
    origin: { x: 0.5, y: 0.5 },
    colors,
    gravity: 0.8,
    scalar: 1.2,
    zIndex: 30,
  });

  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors,
      zIndex: 30,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors,
      zIndex: 30,
    });
  }, 200);
}

export default function GameResult({
  result,
  onPlayAgain,
  onReset,
}: GameResultProps) {
  const { t } = useTranslation();
  const { playSlotWin } = useSound();

  useEffect(() => {
    fireCelebration();
    playSlotWin();
    return () => {
      confetti.reset();
    };
  }, [playSlotWin]);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10">
        <div className="text-center">
          <h2 className="font-game text-2xl font-black text-black mb-6">
            <span className="mr-2" role="img" aria-label="trophy">🏆</span>
            {t('common.resultTitle')}
          </h2>
          <div
            className="rounded-xl p-8 mb-6 border-4 border-black animate-slot-winner-glow"
            style={{ backgroundColor: result.winnerColor }}
          >
            <p className="font-game text-4xl md:text-5xl font-black text-black break-words">
              {result.winnerName}
            </p>
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
