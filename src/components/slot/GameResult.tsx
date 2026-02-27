'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SlotResult } from '@/types/slot';
import { useTranslation } from 'react-i18next';
import { Cherry } from 'lucide-react';

type GameResultProps = {
  result: SlotResult;
  onPlayAgain: () => void;
  onReset: () => void;
};

function fireCelebration() {
  const colors = ['#a855f7', '#fbbf24', '#f472b6', '#60a5fa', '#34d399'];

  confetti({
    particleCount: 120,
    spread: 120,
    origin: { x: 0.5, y: 0.5 },
    colors,
    gravity: 0.8,
    scalar: 1.2,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 200);
}

export default function GameResult({
  result,
  onPlayAgain,
  onReset,
}: GameResultProps) {
  const { t } = useTranslation();

  useEffect(() => {
    fireCelebration();

    return () => {
      confetti.reset();
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10">
        <div className="text-center">
          <h2 className="font-game text-2xl font-black text-black mb-6">
            {t('slot.result.winner')}
          </h2>

          {/* Winner */}
          <div
            className="rounded-xl p-8 mb-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: result.winnerColor }}
          >
            <Cherry className="w-12 h-12 text-black stroke-[2.5] mx-auto mb-3" />
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
