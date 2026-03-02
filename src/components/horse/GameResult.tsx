'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { HorseResult } from '@/types/horse';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';
import { Trophy, Medal } from 'lucide-react';

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

// Podium component for top 3
function Podium({ rankings }: { rankings: HorseResult['rankings'] }) {
  const first = rankings.find((r) => r.rank === 1);
  const second = rankings.find((r) => r.rank === 2);
  const third = rankings.find((r) => r.rank === 3);

  if (!first) return null;

  return (
    <div className="flex items-end justify-center gap-2 md:gap-3 mb-4">
      {/* 2nd Place - Left */}
      {second && (
        <div
          className="flex flex-col items-center animate-podium-rise"
          style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}
        >
          <Medal className="w-7 h-7 text-gray-400 fill-gray-400 mb-1" />
          <span
            className="block font-game text-xs md:text-sm font-black text-white px-2 py-1 rounded-t-lg border-2 border-black border-b-0 truncate max-w-[80px] md:max-w-[100px] text-center"
            style={{ backgroundColor: second.color }}
          >
            {second.name}
          </span>
          <div
            className="w-20 md:w-24 rounded-t-lg border-2 border-black border-b-0"
            style={{ height: '80px', backgroundColor: '#92400e' }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="font-game text-white/60 text-lg font-black">2</span>
            </div>
          </div>
        </div>
      )}

      {/* 1st Place - Center */}
      <div
        className="flex flex-col items-center animate-podium-rise"
        style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
      >
        <Medal className="w-9 h-9 text-yellow-400 fill-yellow-400 mb-1 animate-winner-bounce" />
        <span
          className="block font-game text-sm md:text-base font-black text-white px-3 py-1.5 rounded-t-lg border-2 border-black border-b-0 truncate max-w-[90px] md:max-w-[110px] text-center"
          style={{ backgroundColor: first.color }}
        >
          {first.name}
        </span>
        <div
          className="w-24 md:w-28 rounded-t-lg border-2 border-black border-b-0 animate-winner-glow"
          style={{ height: '110px', backgroundColor: '#92400e' }}
        >
          <div className="flex items-center justify-center h-full">
            <span className="font-game text-yellow-400 text-2xl font-black">1</span>
          </div>
        </div>
      </div>

      {/* 3rd Place - Right */}
      {third && (
        <div
          className="flex flex-col items-center animate-podium-rise"
          style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}
        >
          <Medal className="w-7 h-7 text-amber-700 fill-amber-700 mb-1" />
          <span
            className="block font-game text-xs md:text-sm font-black text-white px-2 py-1 rounded-t-lg border-2 border-black border-b-0 truncate max-w-[80px] md:max-w-[100px] text-center"
            style={{ backgroundColor: third.color }}
          >
            {third.name}
          </span>
          <div
            className="w-20 md:w-24 rounded-t-lg border-2 border-black border-b-0"
            style={{ height: '55px', backgroundColor: '#92400e' }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="font-game text-white/60 text-lg font-black">3</span>
            </div>
          </div>
        </div>
      )}
    </div>
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

  const restRankings = result.rankings.filter((r) => r.rank > 3);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10 animate-result-appear">
        <div className="text-center">
          <h2 className="font-game text-2xl font-black text-black mb-4 flex items-center justify-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500 fill-yellow-500" /> {t('horse.result.title')}
          </h2>

          {/* Podium */}
          <Podium rankings={result.rankings} />


          {/* 4th place and below */}
          {restRankings.length > 0 && (
            <div className="space-y-1.5 mb-5">
              {restRankings.map((entry, i) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-3 p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-rank-slide-in"
                  style={{
                    backgroundColor: `${entry.color}40`,
                    animationDelay: `${0.8 + i * 0.15}s`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <div className="w-8 text-center shrink-0">
                    <span className="font-game text-base font-black text-black/60">
                      {entry.rank}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-game text-sm md:text-base font-black text-black/80 break-words">
                      {entry.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

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
