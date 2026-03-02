'use client';

import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { WheelSegment, SpinConfig, Participant } from '@/types/roulette';
import RouletteScene from './RouletteScene';
import { useSound } from '@/hooks/useSound';
import { Volume2, VolumeX } from 'lucide-react';

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
  const { t } = useTranslation();
  const { enabled, setEnabled, playRouletteSpin, playRouletteTick } = useSound();
  const [nearStop, setNearStop] = useState(false);

  const handleNearStop = useCallback(() => {
    setNearStop(true);
  }, []);

  const handleSpinComplete = useCallback(() => {
    // Fire pre-result confetti burst
    confetti({
      particleCount: 60,
      spread: 90,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399'],
      gravity: 1,
      scalar: 1,
      zIndex: 30,
    });

    setNearStop(false);
    onSpinComplete();
  }, [onSpinComplete]);

  // Cleanup confetti on unmount
  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  // Reset nearStop when spin starts
  useEffect(() => {
    if (isSpinning) {
      setNearStop(false);
    }
  }, [isSpinning]);

  return (
    <div className={`relative flex flex-col items-center justify-center h-full gap-4 ${nearStop ? 'animate-near-stop-shake' : ''}`}>
      {/* Sound Toggle */}
      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className="fixed top-[4.5rem] right-6 md:right-8 z-[8] p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-shadow"
      >
        {enabled ? (
          <Volume2 className="w-5 h-5 text-black" />
        ) : (
          <VolumeX className="w-5 h-5 text-black" />
        )}
      </button>

      {/* Roulette Wheel */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <div className="h-full max-h-[60vh] aspect-square max-w-full">
          <RouletteScene
            segments={segments}
            participants={participants}
            spinConfig={spinConfig}
            onSpinComplete={handleSpinComplete}
            onSegmentCross={playRouletteTick}
            onNearStop={handleNearStop}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="shrink-0 pb-2 flex items-center gap-3">
        {!isSpinning && (
          <>
            <Button
              onClick={() => { onShuffle(); playRouletteSpin(); }}
              variant="secondary"
              className="px-6 py-4 text-xl lowercase"
            >
              {t('roulette.spinning.shuffle')}
            </Button>
            <Button
              onClick={onSpin}
              variant="primary"
              className="px-12 py-4 text-xl lowercase"
            >
              {t('roulette.spinning.spin')}
            </Button>
          </>
        )}

        {isSpinning && (
          <div className="bg-white border-4 border-black rounded-xl px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-game font-black text-black text-lg animate-spin-pulse">
              {t('roulette.spinning.spinning')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
