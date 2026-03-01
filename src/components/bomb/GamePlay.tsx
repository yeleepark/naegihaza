'use client';

import { useEffect, useRef, useCallback } from 'react';
import Button from '@/components/ui/Button';
import { BombParticipant } from '@/types/bomb';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';
import { Volume2, VolumeX } from 'lucide-react';

type Props = {
  participants: BombParticipant[];
  currentHolder: number;
  isRunning: boolean;
  exploded: boolean;
  remainingRatio: number;
  direction: 1 | -1;
  onStart: () => void;
};

function getCirclePosition(index: number, total: number) {
  // Start from top (-90°), go clockwise
  const angle = ((2 * Math.PI) / total) * index - Math.PI / 2;
  const radius = 38; // % from center
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);
  return { x, y };
}

function getCardSize(total: number) {
  if (total <= 4) return 'w-20 h-20 md:w-24 md:h-24';
  if (total <= 8) return 'w-16 h-16 md:w-20 md:h-20';
  if (total <= 12) return 'w-14 h-14 md:w-18 md:h-18';
  return 'w-12 h-12 md:w-16 md:h-16';
}

function getTextSize(total: number) {
  if (total <= 4) return 'text-xs md:text-sm';
  if (total <= 8) return 'text-[10px] md:text-xs';
  return 'text-[9px] md:text-[11px]';
}

/** Returns color that shifts from green → yellow → red as ratio decreases */
function getTimerColor(ratio: number): string {
  if (ratio > 0.5) return '#22c55e';
  if (ratio > 0.25) return '#eab308';
  return '#ef4444';
}

export default function GamePlay({
  participants,
  currentHolder,
  isRunning,
  exploded,
  remainingRatio,
  direction,
  onStart,
}: Props) {
  const { t } = useTranslation();
  const { enabled, setEnabled, playBombTick, playBombExplode, playHeartbeatPulse } = useSound();
  const prevHolderRef = useRef(currentHolder);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Play tick sound on holder change
  useEffect(() => {
    if (currentHolder !== prevHolderRef.current && currentHolder >= 0 && isRunning) {
      playBombTick();
    }
    prevHolderRef.current = currentHolder;
  }, [currentHolder, isRunning, playBombTick]);

  // Play explode sound
  useEffect(() => {
    if (exploded) {
      playBombExplode();
      clearHeartbeat();
    }
  }, [exploded, playBombExplode, clearHeartbeat]);

  // Heartbeat sound: starts at remainingRatio < 0.6, accelerates 70→180 BPM
  useEffect(() => {
    if (!isRunning || exploded) {
      clearHeartbeat();
      return;
    }

    if (remainingRatio < 0.6) {
      // Map 0.6→0 to 70→180 BPM
      const progress = Math.min(1, (0.6 - remainingRatio) / 0.6);
      const bpm = 70 + progress * 110;
      const intervalMs = (60 / bpm) * 1000;

      // Only restart interval if BPM changed significantly
      clearHeartbeat();
      playHeartbeatPulse();
      heartbeatRef.current = setInterval(playHeartbeatPulse, intervalMs);
    }

    return clearHeartbeat;
  }, [isRunning, exploded, Math.floor(remainingRatio * 20), playHeartbeatPulse, clearHeartbeat]);

  // Cleanup on unmount
  useEffect(() => clearHeartbeat, [clearHeartbeat]);

  const showStart = !isRunning && !exploded && currentHolder < 0;
  const cardSize = getCardSize(participants.length);
  const textSize = getTextSize(participants.length);
  const timerColor = getTimerColor(remainingRatio);
  const isDanger = remainingRatio <= 0.5;

  return (
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto gap-14">
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

      {/* Timer bar — always rendered, invisible when inactive to keep layout stable */}
      <div className={`w-full max-w-[500px] h-4 rounded-full border-2 border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
        isRunning || exploded ? 'bg-white/10' : 'invisible'
      }`}>
        <div
          className="h-full rounded-full transition-colors duration-300"
          style={{
            width: `${Math.max(remainingRatio * 100, 0)}%`,
            backgroundColor: timerColor,
          }}
        />
      </div>

      {/* Fullscreen danger overlay — opacity grows as time runs out */}
      {isDanger && isRunning && (
        <div
          className="fixed inset-0 pointer-events-none z-[5] animate-screen-shake"
          style={{ backgroundColor: `rgba(239, 68, 68, ${0.03 + (0.5 - remainingRatio) / 0.5 * 0.15})` }}
        />
      )}

      {/* Circle arena */}
      <div className="relative w-full aspect-square max-w-[500px] rounded-2xl">
        {/* Participants in circle */}
        {participants.map((p, i) => {
          const pos = getCirclePosition(i, participants.length);
          const isHolder = currentHolder === i;
          const isExplodedHolder = exploded && isHolder;

          return (
            <div
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="relative">
                <div
                  className={`
                    ${cardSize} rounded-xl border-3 border-black flex items-center justify-center
                    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200
                    ${isExplodedHolder ? 'animate-shake ring-4 ring-red-500 scale-110' : ''}
                    ${isHolder && !exploded ? `ring-4 scale-110 ${isDanger ? 'ring-red-500 animate-bounce' : 'ring-yellow-400 animate-pulse'}` : ''}
                  `}
                  style={{ backgroundColor: isExplodedHolder ? '#ef4444' : p.color }}
                >
                  <span
                    className={`font-game font-black text-black ${textSize} leading-tight text-center px-1 truncate max-w-full`}
                  >
                    {p.name}
                  </span>
                </div>
                {isHolder && (
                  <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-2xl md:text-3xl leading-none drop-shadow-md ${
                    exploded ? 'animate-explode-pulse' : 'animate-spin'
                  }`}>
                    {exploded ? '💥' : '💣'}
                  </span>
                )}
              </div>
            </div>
          );
        })}

      </div>

      {/* Start overlay — covers below header, sound toggle stays clickable (z-[8] > z-[7]) */}
      {showStart && (
        <div className="fixed inset-0 top-16 flex items-center justify-center bg-black/40 z-[7]">
          <Button
            onClick={onStart}
            variant="primary"
            className="text-lg px-8 py-4 lowercase"
          >
            {t('bomb.play')}
          </Button>
        </div>
      )}
    </div>
  );
}
