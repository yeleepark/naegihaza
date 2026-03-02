'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BreakoutResult } from '@/types/breakout';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';

type GameResultProps = {
  result: BreakoutResult;
  onPlayAgain: () => void;
  onReset: () => void;
};

function fireCelebration() {
  const colors = ['#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399'];

  // Main burst
  confetti({
    particleCount: 200,
    spread: 160,
    origin: { x: 0.5, y: 0.5 },
    colors,
    gravity: 0.8,
    scalar: 1.5,
    zIndex: 30,
  });

  // Left side
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.7 },
      colors,
      zIndex: 30,
    });
  }, 150);

  // Right side
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.7 },
      colors,
      zIndex: 30,
    });
  }, 300);

  // Rain from top
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 180,
      origin: { x: 0.5, y: 0 },
      colors,
      gravity: 1.2,
      scalar: 1,
      drift: 0,
      zIndex: 30,
    });
  }, 600);
}

export default function GameResult({
  result,
  onPlayAgain,
  onReset,
}: GameResultProps) {
  const { t } = useTranslation();
  const { playBreakoutWin } = useSound();

  useEffect(() => {
    fireCelebration();
    playBreakoutWin();
    return () => {
      confetti.reset();
    };
  }, [playBreakoutWin]);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10 animate-result-appear">
        <div className="text-center">
          <h2 className="font-game text-2xl font-black text-black mb-6">
            {t('common.resultTitle')}
          </h2>
          <div
            className="rounded-xl p-8 mb-6 border-4 border-black animate-breakout-result-glow"
            style={{ backgroundColor: result.winnerColor, color: result.winnerColor }}
          >
            <p className="font-game text-4xl md:text-5xl font-black text-black break-words animate-bounce-in">
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
