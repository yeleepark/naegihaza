'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { HorseResult } from '@/types/horse';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';
import { Trophy } from 'lucide-react';

type GameResultProps = {
  result: HorseResult;
  onPlayAgain: () => void;
  onReset: () => void;
};


function fireCelebration(winnerColor: string) {
  const colors = ['#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399'];
  const palette = [winnerColor, winnerColor, ...colors];

  // Stage 1: Main burst
  confetti({
    particleCount: 200,
    spread: 120,
    origin: { x: 0.5, y: 0.5 },
    colors: palette,
    gravity: 0.8,
    scalar: 1.4,
    zIndex: 30,
  });

  // Stage 2: Side cannons
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

  // Stage 3: Star-shaped fall
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

  // Stage 4: Sustained sparkle
  setTimeout(() => {
    const interval = setInterval(() => {
      confetti({
        particleCount: 10,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: palette,
        gravity: 0.6,
        scalar: 0.7,
        zIndex: 30,
      });
    }, 200);
    setTimeout(() => clearInterval(interval), 1500);
  }, 800);
}

function WinnerBadge({ label }: { label: string }) {
  return (
    <span className="inline-block font-game text-[10px] md:text-xs font-black text-black bg-yellow-400 px-1.5 py-0.5 rounded border border-yellow-600 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]">
      {label}
    </span>
  );
}

export default function GameResult({
  result,
  onPlayAgain,
  onReset,
}: GameResultProps) {
  const { t } = useTranslation();
  const { playBreakoutWin } = useSound();

  useEffect(() => {
    if (result.rankings.length > 0) {
      fireCelebration(result.rankings[0].color);
      playBreakoutWin();
    }

    return () => {
      confetti.reset();
    };
  }, [playBreakoutWin, result.rankings]);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10 animate-result-appear">
        <div className="text-center">
          <h2 className="font-game text-2xl font-black text-black mb-4 flex items-center justify-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500 fill-yellow-500" /> {t('horse.result.title')}
          </h2>

          {/* Rankings */}
          <div className="space-y-1.5 mb-5">
            {result.rankings.map((entry, i) => (
              <div
                key={entry.name}
                className="flex items-center gap-3 p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-rank-slide-in"
                style={{
                  backgroundColor: `${entry.color}40`,
                  animationDelay: `${0.2 + i * 0.15}s`,
                  animationFillMode: 'backwards',
                }}
              >
                <div className="w-8 text-center shrink-0">
                  <span className="font-game text-base font-black text-black/60">
                    {entry.rank}
                  </span>
                </div>
                <div className="flex-1 text-left flex items-center gap-2">
                  <span className="font-game text-sm md:text-base font-black text-black/80 break-words">
                    {entry.name}
                  </span>
                  {entry.rank === result.winnerRank && (
                    <WinnerBadge label={t('horse.winner')} />
                  )}
                </div>
              </div>
            ))}
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
