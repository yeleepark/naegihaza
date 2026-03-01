'use client';

import Button from '@/components/ui/Button';
import { CELL_HEIGHT } from '@/utils/slot';
import { SlotResult } from '@/types/slot';
import { useTranslation } from 'react-i18next';
import { useSlotMachine } from '@/hooks/useSlotMachine';
import { useSound } from '@/hooks/useSound';
import { Volume2, VolumeX } from 'lucide-react';

type GamePlayProps = {
  participants: string[];
  onComplete: (result: SlotResult) => void;
};

export default function GamePlay({ participants, onComplete }: GamePlayProps) {
  const { enabled, setEnabled, playTick, playFanfare, vibrate } = useSound();

  const { spinning, stopped, strip, offset, handleSpin } =
    useSlotMachine(participants, {
      onComplete,
      onTick: playTick,
      onResult: () => {
        playFanfare();
        vibrate([100, 50, 100]);
      },
    });
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center w-full max-w-xs px-4">
        {/* Slot machine */}
        <div className="w-full relative">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className="absolute -top-1 -right-1 z-30 p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-shadow"
          >
            {enabled ? (
              <Volume2 className="w-5 h-5 text-black" />
            ) : (
              <VolumeX className="w-5 h-5 text-black/40" />
            )}
          </button>

          {/* Machine body */}
          <div className="bg-pink-400 border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            {/* Arch top with lights */}
            <div className="relative bg-pink-500 border-b-4 border-black pt-4 pb-3 px-4">
              {/* Decorative dots (lights) */}
              <div className="flex justify-center gap-2 mb-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full border border-black ${
                      spinning
                        ? i % 2 === 0
                          ? 'bg-yellow-300 animate-pulse'
                          : 'bg-white animate-pulse [animation-delay:0.5s]'
                        : stopped
                          ? 'bg-yellow-300'
                          : 'bg-pink-300'
                    }`}
                  />
                ))}
              </div>
              {/* BIG WIN text */}
              <p className="text-center font-game font-black text-xl text-yellow-300 tracking-wider [-webkit-text-stroke:1px_black] [text-stroke:1px_black]">
                BIG WIN
              </p>
            </div>

            {/* GOOD LUCK banner */}
            <div className="bg-white border-b-3 border-black mx-4 mt-3 mb-2 py-1 rounded border-2">
              <p className="text-center font-game font-black text-sm text-black tracking-widest">
                GOOD LUCK
              </p>
            </div>

            {/* Reel display area */}
            <div className="mx-4 mb-3">
              <div className="relative">
                {/* Reel window */}
                <div
                  className="overflow-hidden border-3 border-black rounded-lg bg-gray-900 relative"
                  style={{ height: CELL_HEIGHT }}
                >
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
                          stopped && i === strip.length - 1
                            ? 'text-yellow-300'
                            : 'text-white'
                        }`}
                        style={{
                          height: CELL_HEIGHT,
                          textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                        }}
                      >
                        <span className="truncate px-3">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Winner highlight glow */}
                {stopped && (
                  <div className="absolute inset-0 rounded-lg border-4 border-yellow-300 pointer-events-none animate-pulse shadow-[0_0_12px_rgba(253,224,71,0.6)]" />
                )}
              </div>
            </div>

            {/* Gold coins */}
            <div className="flex justify-center gap-3 mb-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="w-5 h-5 rounded-full border border-yellow-600 bg-yellow-300" />
                </div>
              ))}
            </div>

            {/* Pink shelf */}
            <div className="h-3 bg-pink-600 border-t-2 border-black" />

            {/* Gold grill */}
            <div className="bg-amber-400 border-t-2 border-black px-6 py-3 space-y-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1.5 bg-amber-500 rounded-full border border-amber-600"
                />
              ))}
            </div>
          </div>
        </div>

        {/* SPIN button */}
        <Button
          onClick={handleSpin}
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
