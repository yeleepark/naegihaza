'use client';

import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { BreakoutMode } from '@/types/breakout';
import { useBreakoutEngine } from '@/hooks/useBreakoutEngine';
import { SPEED_MIN, SPEED_MAX, SPEED_STEP } from '@/lib/breakout-engine';

type Props = {
  participants: string[];
  onResult: (name: string, color: string) => void;
  mode: BreakoutMode;
};

export default function GamePlay({ participants, onResult, mode }: Props) {
  const {
    canvasRef,
    wrapRef,
    showStart,
    speedMultiplier,
    handleStart,
    handleSpeedChange,
  } = useBreakoutEngine(participants, onResult);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full max-w-[600px] mx-auto gap-8">
      <p className="font-game text-center text-sm font-bold text-black/60">
        {t(mode === 'penalty' ? 'breakout.notice.penalty' : 'breakout.notice.winner')}
      </p>
      <div
        ref={wrapRef}
        className="h-[70dvh] relative rounded-2xl overflow-hidden border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
        {showStart && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Button
              onClick={handleStart}
              variant="primary"
              className="text-lg px-8 py-4 lowercase"
            >
              {t('breakout.play')}
            </Button>
          </div>
        )}
      </div>

      {/* Speed slider */}
      <div className="flex items-center gap-3 px-1">
        <span className="font-game text-xs text-black/50 flex-shrink-0">
          {t('breakout.speed')}
        </span>
        <input
          type="range"
          min={SPEED_MIN}
          max={SPEED_MAX}
          step={SPEED_STEP}
          value={speedMultiplier}
          onChange={(e) => handleSpeedChange(Number(e.target.value))}
          className="flex-1 h-2 appearance-none rounded-full bg-black/10 accent-black cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
        />
        <span className="font-game text-xs font-bold text-black/70 w-10 text-right flex-shrink-0">
          x{speedMultiplier.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
