'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { RouletteResult } from '@/types/roulette';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';

type GameResultProps = {
  result: RouletteResult;
  onPlayAgain: () => void;
  onReset: () => void;
};

function fireCelebration(winnerColor: string) {
  const colors = ['#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399'];
  // Emphasize the winner's color
  const palette = [winnerColor, winnerColor, ...colors];

  // Main burst
  confetti({
    particleCount: 200,
    spread: 120,
    origin: { x: 0.5, y: 0.5 },
    colors: palette,
    gravity: 0.8,
    scalar: 1.4,
    zIndex: 30,
  });

  // Side bursts
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.7 },
      colors: palette,
      zIndex: 30,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.7 },
      colors: palette,
      zIndex: 30,
    });
  }, 200);

  // 3rd wave: rain from top
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 270,
      spread: 160,
      origin: { x: 0.5, y: 0 },
      colors: palette,
      gravity: 1.2,
      scalar: 1,
      drift: 0,
      zIndex: 30,
    });
  }, 500);
}

export default function GameResult({
  result,
  onPlayAgain,
  onReset,
}: GameResultProps) {
  const { t } = useTranslation();
  const { playRouletteWin } = useSound();

  useEffect(() => {
    fireCelebration(result.winnerColor);
    playRouletteWin();

    return () => {
      confetti.reset();
    };
  }, [playRouletteWin, result.winnerColor]);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10 animate-result-appear">
        <div className="text-center">
          <h2 className="font-game text-2xl font-black text-black mb-6">
            {t('common.resultTitle')}
          </h2>
          <div
            className="rounded-xl p-8 mb-6 border-4 border-black animate-roulette-result-glow"
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
