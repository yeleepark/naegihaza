'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { RouletteResult } from '@/types/roulette';

type GameResultProps = {
  result: RouletteResult;
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
  useEffect(() => {
    fireConfetti();

    return () => {
      confetti.reset();
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10">
        <div className="text-center">
          <h2 className="font-game text-2xl font-black text-black mb-6">
            당첨자 발표
          </h2>

          <div
            className="rounded-xl p-8 mb-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
              같은 인원으로 다시 하기
            </Button>
            <Button
              onClick={onReset}
              variant="secondary"
              className="w-full lowercase"
            >
              처음으로 돌아가기
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
