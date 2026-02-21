'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { WheelSegment, SpinConfig, Participant } from '@/types/roulette';
import RouletteScene from './RouletteScene';

type GameSpinningProps = {
  segments: WheelSegment[];
  participants: Participant[];
  spinConfig?: SpinConfig;
  isSpinning: boolean;
  onSpin: () => void;
  onShuffle: () => void;
  onSpinComplete: () => void;
};

export default function GameSpinning({
  segments,
  participants,
  spinConfig,
  isSpinning,
  onSpin,
  onShuffle,
  onSpinComplete,
}: GameSpinningProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      {/* Roulette Wheel */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <div className="h-full max-h-[60vh] aspect-square max-w-full">
          <RouletteScene
            segments={segments}
            participants={participants}
            spinConfig={spinConfig}
            onSpinComplete={onSpinComplete}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="shrink-0 pb-2 flex items-center gap-3">
        {!isSpinning && (
          <>
            <Button
              onClick={onShuffle}
              variant="secondary"
              className="px-6 py-4 text-xl lowercase"
            >
              셔플
            </Button>
            <Button
              onClick={onSpin}
              variant="primary"
              className="px-12 py-4 text-xl lowercase"
            >
              룰렛 돌리기
            </Button>
          </>
        )}

        {isSpinning && (
          <div className="bg-white border-4 border-black rounded-xl px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-game font-black text-black text-lg">
              돌아가는 중...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
