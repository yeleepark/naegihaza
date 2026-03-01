'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import Button from '@/components/ui/Button';
import { RouletteResult } from '@/types/roulette';
import { useSound } from '@/hooks/useSound';

type ResultOverlayProps = {
  result: RouletteResult;
  onPlayAgain: () => void;
  onReset: () => void;
};

function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399'],
    });

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

  confetti({
    particleCount: 100,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399'],
  });

  frame();
}

export default function ResultOverlay({
  result,
  onPlayAgain,
  onReset,
}: ResultOverlayProps) {
  const { t } = useTranslation();
  const { playFanfare, vibrate } = useSound();

  useEffect(() => {
    fireConfetti();
    playFanfare();
    vibrate([100, 50, 100, 50, 200]);

    return () => {
      confetti.reset();
    };
  }, [playFanfare, vibrate]);

  return (
    <div className="fixed inset-0 z-[5] flex items-center justify-center bg-black/40 animate-pop-in p-4">
      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 md:p-14 w-full max-w-lg animate-pop-in">
        <div className="text-center">
          <h2 className="font-game text-4xl md:text-5xl font-black text-black mb-8">
            {t('roulette.result.title')}
          </h2>

          <div
            className="rounded-xl p-10 md:p-14 mb-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: result.winnerColor }}
          >
            <p className="font-game text-5xl md:text-6xl font-black text-black break-words">
              {result.winnerName}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onPlayAgain}
              variant="primary"
              className="w-full lowercase text-lg py-4"
            >
              {t('common.playAgain')}
            </Button>
            <Button
              onClick={onReset}
              variant="secondary"
              className="w-full lowercase text-lg py-4"
            >
              {t('common.reset')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
