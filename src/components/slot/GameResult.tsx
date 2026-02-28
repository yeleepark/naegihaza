'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SlotResult } from '@/types/slot';
import { useTranslation } from 'react-i18next';

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
  const isPenalty = result.mode === 'penalty';
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    if (isPenalty) {
      setFlashActive(true);
      const timer = setTimeout(() => setFlashActive(false), 2000);
      return () => clearTimeout(timer);
    } else {
      fireCelebration();
      return () => {
        confetti.reset();
      };
    }
  }, [isPenalty]);

  return (
    <div className="flex items-center justify-center h-full relative">
      {isPenalty && flashActive && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            animation: 'flash-red 0.25s ease-in-out 4',
          }}
        />
      )}

      <Card
        className="max-w-md w-full relative z-10"
        style={
          isPenalty && flashActive
            ? { animation: 'shake 0.15s ease-in-out 6' }
            : undefined
        }
      >
        <div className="text-center">
          <h2
            className={`font-game text-2xl font-black mb-6 ${
              isPenalty ? 'text-red-600' : 'text-black'
            }`}
          >
            {t(isPenalty ? 'slot.result.penalty' : 'slot.result.winner')}
          </h2>

          {/* Winner */}
          <div
            className={`rounded-xl p-8 mb-6 border-4 ${
              isPenalty
                ? 'border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]'
                : 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            }`}
            style={{
              backgroundColor: result.winnerColor,
              animation: isPenalty ? 'pulse-red 1.5s ease-in-out infinite' : undefined,
            }}
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

      <style jsx>{`
        @keyframes flash-red {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(220, 38, 38, 0.5); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20% { transform: translateX(-10px) rotate(-2deg); }
          40% { transform: translateX(10px) rotate(2deg); }
          60% { transform: translateX(-8px) rotate(-1deg); }
          80% { transform: translateX(8px) rotate(1deg); }
        }
        @keyframes pulse-red {
          0%, 100% { box-shadow: 4px 4px 0px 0px rgba(239,68,68,1); }
          50% { box-shadow: 4px 4px 20px 4px rgba(239,68,68,0.6); }
        }
      `}</style>
    </div>
  );
}
