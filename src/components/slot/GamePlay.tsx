'use client';

import Button from '@/components/ui/Button';
import { CELL_HEIGHT } from '@/utils/slot';
import { SlotResult } from '@/types/slot';
import { useTranslation } from 'react-i18next';
import { useSlotMachine } from '@/hooks/useSlotMachine';
import { useSound } from '@/hooks/useSound';
import { Volume2, VolumeX } from 'lucide-react';

const REEL_CELLS = 3;

const STAR_COLORS = [
  '#fda4af', // rose-300
  '#fcd34d', // amber-300
  '#67e8f9', // cyan-300
  '#f9a8d4', // pink-300
  '#fde047', // yellow-300
  '#6ee7b7', // emerald-300
  '#fda4af', // rose-300
  '#93c5fd', // blue-300
  '#fcd34d', // amber-300
];

type GamePlayProps = {
  participants: string[];
  onComplete: (result: SlotResult) => void;
};

export default function GamePlay({ participants, onComplete }: GamePlayProps) {
  const { enabled, setEnabled, playSlotTick, playSlotSpin } = useSound();

  const { spinning, stopped, nearStop, strip, offset, handleSpin } =
    useSlotMachine(participants, {
      onComplete,
      onTick: playSlotTick,
    });
  const { t } = useTranslation();

  const winnerIndex = strip.length - 2;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center w-full max-w-xs px-4">
        {/* Slot machine */}
        <div className="w-full relative">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className="fixed top-[4.5rem] right-6 md:right-8 z-[8] p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-shadow"
          >
            {enabled ? (
              <Volume2 className="w-5 h-5 text-black" />
            ) : (
              <VolumeX className="w-5 h-5 text-black/40" />
            )}
          </button>

          {/* Machine body */}
          <div
            className={`bg-rose-300 border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${
              nearStop && spinning ? 'animate-near-stop-shake' : ''
            }`}
          >
            {/* Top header with star lights */}
            <div className="bg-rose-400 border-b-4 border-black pt-4 pb-3 px-4">
              <div className="flex justify-center gap-2">
                {STAR_COLORS.map((color, i) => (
                  <span
                    key={i}
                    className={`text-sm leading-none ${
                      spinning
                        ? nearStop
                          ? 'animate-slot-chase-fast'
                          : 'animate-slot-chase'
                        : ''
                    }`}
                    style={{
                      color: spinning || stopped ? color : 'rgba(255,255,255,0.35)',
                      animationDelay: `${i * 0.12}s`,
                      filter:
                        spinning || stopped
                          ? `drop-shadow(0 0 4px ${color})`
                          : 'none',
                    }}
                  >
                    ✦
                  </span>
                ))}
              </div>
            </div>

            {/* Colorful diamond divider */}
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-amber-400/60 text-xs">◆</span>
              <span className="text-rose-500/70 text-sm">◆</span>
              <span className="text-cyan-400/60 text-xs">◆</span>
            </div>

            {/* Reel display area */}
            <div className="mx-4 mb-3">
              <div className="relative">
                {/* Reel window — 3 cells */}
                <div
                  className="overflow-hidden border-3 border-black rounded-lg bg-gray-900 relative"
                  style={{ height: CELL_HEIGHT * REEL_CELLS }}
                >
                  {/* Top fade mask */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-900 to-transparent z-10 pointer-events-none" />
                  {/* Bottom fade mask */}
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-900 to-transparent z-10 pointer-events-none" />

                  {/* Center row highlight line */}
                  <div
                    className={`absolute left-0 right-0 z-10 pointer-events-none border-y-2 ${
                      nearStop && spinning
                        ? 'border-rose-300'
                        : 'border-rose-400/30'
                    }`}
                    style={{
                      top: CELL_HEIGHT,
                      height: CELL_HEIGHT,
                    }}
                  />

                  <div
                    className="flex flex-col"
                    style={{
                      transform: `translateY(-${offset}px)`,
                    }}
                  >
                    {strip.map((name, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-center font-game font-black text-lg md:text-xl shrink-0 ${
                          stopped && i === winnerIndex
                            ? 'text-amber-200 scale-105'
                            : 'text-white'
                        }`}
                        style={{
                          height: CELL_HEIGHT,
                          textShadow:
                            stopped && i === winnerIndex
                              ? '0 0 10px rgba(253,230,138,0.9), 0 0 20px rgba(251,191,36,0.5)'
                              : '1px 1px 0 rgba(0,0,0,0.5)',
                          background:
                            stopped && i === winnerIndex
                              ? 'linear-gradient(to right, rgba(251,191,36,0.05), rgba(253,230,138,0.15), rgba(251,191,36,0.05))'
                              : 'transparent',
                        }}
                      >
                        <span className="truncate px-3">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Winner highlight glow ring */}
                {stopped && (
                  <div className="absolute inset-0 rounded-lg border-4 border-amber-300 pointer-events-none animate-slot-reveal shadow-[0_0_16px_rgba(251,191,36,0.5)]" />
                )}

                {/* Flash overlay on stop */}
                {stopped && (
                  <div className="absolute inset-0 rounded-lg bg-white pointer-events-none animate-slot-flash" />
                )}
              </div>
            </div>

            {/* Shelf */}
            <div className="h-3 bg-rose-500 border-t-2 border-black" />

            {/* Footer */}
            <div className="bg-rose-700 border-t-2 border-black px-6 py-3" />
          </div>
        </div>

        {/* SPIN button */}
        <Button
          onClick={() => { playSlotSpin(); handleSpin(); }}
          variant="primary"
          disabled={spinning}
          className="w-full text-xl py-4 lowercase mt-5"
        >
          {t('slot.spin')}
        </Button>
      </div>
    </div>
  );
}
