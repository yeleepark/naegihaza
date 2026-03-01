'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import confetti from 'canvas-confetti';
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
  preExplosion: boolean;
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

/** SVG Bomb component with burning fuse */
function SvgBomb({ remainingRatio, exploded, preExplosion }: { remainingRatio: number; exploded: boolean; preExplosion: boolean }) {
  // Fuse burns from right to left based on remainingRatio
  const fuseLength = preExplosion ? 0 : remainingRatio * 20; // max fuse length 20
  const glowIntensity = preExplosion ? 20 : Math.max(0, (1 - remainingRatio) * 12);
  const isDanger = remainingRatio <= 0.5;

  if (exploded) {
    // Explosion burst SVG
    return (
      <div className="animate-explosion-burst">
        <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
          {/* Star burst shape */}
          <polygon
            points="40,5 47,28 70,28 51,42 58,65 40,52 22,65 29,42 10,28 33,28"
            fill="#ef4444"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <polygon
            points="40,15 45,32 58,32 48,40 52,55 40,47 28,55 32,40 22,32 35,32"
            fill="#fb923c"
          />
          <circle cx="40" cy="40" r="8" fill="#fbbf24" />
        </svg>
      </div>
    );
  }

  if (preExplosion) {
    // Pre-explosion: bomb swells and trembles, fuse gone, intense red glow
    return (
      <div className="animate-pre-explosion">
        <svg
          width="70"
          height="80"
          viewBox="0 0 70 80"
          style={{
            filter: `drop-shadow(0 0 ${glowIntensity}px rgba(239, 68, 68, 0.9))`,
          }}
        >
          {/* Bomb body — red tint */}
          <circle cx="35" cy="48" r="24" fill="#2e1a1a" stroke="#ef4444" strokeWidth="2.5" />
          <circle cx="35" cy="48" r="20" fill="#442d2d" />
          <ellipse cx="28" cy="40" rx="6" ry="8" fill="rgba(255,100,100,0.1)" />
          {/* Fuse base — glowing */}
          <rect x="31" y="24" width="8" height="6" rx="2" fill="#ef4444" />
          {/* Spark at fuse base — intense */}
          <g className="animate-fuse-spark">
            <circle cx="35" cy="22" r="6" fill="#ef4444" opacity="0.8" />
            <circle cx="35" cy="22" r="3" fill="#fbbf24" />
            <circle cx="35" cy="22" r="1.5" fill="#fff" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={isDanger ? 'animate-bomb-wobble' : ''}>
      <svg
        width="70"
        height="80"
        viewBox="0 0 70 80"
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity}px rgba(239, 68, 68, ${0.3 + (1 - remainingRatio) * 0.5}))`,
        }}
      >
        {/* Bomb body */}
        <circle cx="35" cy="48" r="24" fill="#1a1a2e" stroke="#333" strokeWidth="2" />
        <circle cx="35" cy="48" r="20" fill="#2d2d44" />
        {/* Highlight */}
        <ellipse cx="28" cy="40" rx="6" ry="8" fill="rgba(255,255,255,0.08)" />

        {/* Fuse base (top of bomb) */}
        <rect x="31" y="24" width="8" height="6" rx="2" fill="#555" />

        {/* Fuse line — shortens as time runs out */}
        <path
          d={`M 39 24 Q ${39 + fuseLength * 0.4} ${18 - fuseLength * 0.3}, ${39 + fuseLength * 0.8} ${14 - fuseLength * 0.2}`}
          fill="none"
          stroke="#8B7355"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Spark at fuse tip */}
        {remainingRatio > 0.02 && (
          <g className="animate-fuse-spark">
            <circle
              cx={39 + fuseLength * 0.8}
              cy={14 - fuseLength * 0.2}
              r="4"
              fill="#fbbf24"
              opacity="0.9"
            />
            <circle
              cx={39 + fuseLength * 0.8}
              cy={14 - fuseLength * 0.2}
              r="2"
              fill="#fff"
            />
            {/* Spark particles */}
            <circle
              cx={39 + fuseLength * 0.8 - 3}
              cy={14 - fuseLength * 0.2 - 3}
              r="1"
              fill="#fb923c"
              opacity="0.7"
            />
            <circle
              cx={39 + fuseLength * 0.8 + 2}
              cy={14 - fuseLength * 0.2 - 4}
              r="1.2"
              fill="#fbbf24"
              opacity="0.6"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

/** Floating ember particles */
function EmberParticles() {
  const embers = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    size: 2 + Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute bottom-0 rounded-full animate-ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            backgroundColor: e.id % 2 === 0 ? '#fb923c' : '#fbbf24',
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function GamePlay({
  participants,
  currentHolder,
  isRunning,
  exploded,
  preExplosion,
  remainingRatio,
  direction,
  onStart,
}: Props) {
  const { t } = useTranslation();
  const { enabled, setEnabled, playBombTick, playBombExplode, playHeartbeatPulse } = useSound();
  const prevHolderRef = useRef(currentHolder);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [flashHolder, setFlashHolder] = useState<number | null>(null);
  const [showExplosionFlash, setShowExplosionFlash] = useState(false);

  const clearHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Play tick sound on holder change + flash effect
  useEffect(() => {
    if (currentHolder !== prevHolderRef.current && currentHolder >= 0 && isRunning) {
      playBombTick();
      setFlashHolder(currentHolder);
      const timer = setTimeout(() => setFlashHolder(null), 300);
      return () => clearTimeout(timer);
    }
    prevHolderRef.current = currentHolder;
  }, [currentHolder, isRunning, playBombTick]);

  // Play explode sound + explosion effects
  useEffect(() => {
    if (exploded) {
      playBombExplode();
      clearHeartbeat();

      // White flash
      setShowExplosionFlash(true);
      setTimeout(() => setShowExplosionFlash(false), 300);

      // Explosion confetti — debris effect
      confetti({
        particleCount: 80,
        spread: 360,
        startVelocity: 30,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#1a1a2e', '#2d2d44', '#ef4444', '#fb923c', '#fbbf24'],
        gravity: 1.2,
        scalar: 0.8,
        shapes: ['square'],
        zIndex: 30,
      });

      // Second wave — sparks
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 180,
          startVelocity: 20,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#fbbf24', '#fb923c', '#ef4444'],
          gravity: 0.6,
          scalar: 0.5,
          zIndex: 30,
        });
      }, 150);
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
  useEffect(() => {
    return () => {
      clearHeartbeat();
      confetti.reset();
    };
  }, [clearHeartbeat]);

  const showStart = !isRunning && !exploded && !preExplosion && currentHolder < 0;
  const gameActive = isRunning || preExplosion;
  const cardSize = getCardSize(participants.length);
  const textSize = getTextSize(participants.length);
  const timerColor = getTimerColor(remainingRatio);
  const isDanger = remainingRatio <= 0.5;

  // Current holder position for SVG line
  const holderPos = currentHolder >= 0 ? getCirclePosition(currentHolder, participants.length) : null;

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

      {/* Timer bar — enhanced */}
      <div className={`w-full max-w-[500px] h-5 rounded-full border-2 border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
        gameActive || exploded ? 'bg-gray-800' : 'invisible'
      } ${isDanger && gameActive ? 'animate-timer-pulse' : ''}`}
        style={isDanger && gameActive ? { boxShadow: `3px 3px 0px 0px rgba(0,0,0,1), 0 0 12px rgba(239, 68, 68, 0.5)` } : undefined}
      >
        <div
          className="h-full rounded-full transition-colors duration-300 relative overflow-hidden animate-timer-shine"
          style={{
            width: `${Math.max(remainingRatio * 100, 0)}%`,
            backgroundColor: timerColor,
          }}
        />
      </div>

      {/* Fullscreen explosion flash */}
      {showExplosionFlash && (
        <div className="fixed inset-0 bg-white z-[20] animate-explosion-flash pointer-events-none" />
      )}

      {/* Fullscreen danger overlay — opacity grows as time runs out */}
      {(isDanger && gameActive || preExplosion) && (
        <div
          className="fixed inset-0 pointer-events-none z-[5] animate-screen-shake"
          style={{ backgroundColor: preExplosion
            ? 'rgba(239, 68, 68, 0.25)'
            : `rgba(239, 68, 68, ${0.03 + (0.5 - remainingRatio) / 0.5 * 0.15})`
          }}
        />
      )}

      {/* Vignette effect — darkens as time runs out */}
      {(gameActive || preExplosion) && (
        <div
          className="fixed inset-0 pointer-events-none z-[4]"
          style={{
            background: preExplosion
              ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)'
              : `radial-gradient(ellipse at center, transparent ${60 + remainingRatio * 30}%, rgba(0,0,0,${0.2 + (1 - remainingRatio) * 0.5}) 100%)`,
          }}
        />
      )}

      {/* Floating ember particles in danger zone */}
      {(isDanger && gameActive || preExplosion) && <EmberParticles />}

      {/* Circle arena */}
      <div className="relative w-full aspect-square max-w-[500px] rounded-2xl">
        {/* SVG overlay for dash line from center to holder */}
        {holderPos && gameActive && !exploded && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
            <line
              x1="50%"
              y1="50%"
              x2={`${holderPos.x}%`}
              y2={`${holderPos.y}%`}
              stroke={preExplosion ? '#ef4444' : isDanger ? '#ef4444' : '#fbbf24'}
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.6"
            />
          </svg>
        )}

        {/* Central SVG bomb */}
        {(gameActive || exploded) && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]">
            <SvgBomb remainingRatio={remainingRatio} exploded={exploded} preExplosion={preExplosion} />
          </div>
        )}

        {/* Participants in circle */}
        {participants.map((p, i) => {
          const pos = getCirclePosition(i, participants.length);
          const isHolder = currentHolder === i;
          const isExplodedHolder = exploded && isHolder;
          const isFlashing = flashHolder === i;

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
                    transition-all duration-200
                    ${isExplodedHolder ? 'animate-exploded-card scale-110' : ''}
                    ${isFlashing ? 'animate-bomb-receive' : ''}
                    ${isHolder && preExplosion ? 'scale-115 animate-bomb-wobble' : ''}
                    ${isHolder && !exploded && !preExplosion ? 'scale-110' : ''}
                  `}
                  style={{
                    backgroundColor: isExplodedHolder ? '#ef4444' : p.color,
                    boxShadow: isExplodedHolder
                      ? '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4), 3px 3px 0px 0px rgba(0,0,0,1)'
                      : isHolder && preExplosion
                        ? '0 0 25px rgba(239, 68, 68, 0.9), 0 0 50px rgba(239, 68, 68, 0.5), 0 0 80px rgba(239, 68, 68, 0.3), 3px 3px 0px 0px rgba(0,0,0,1)'
                        : isHolder && !exploded
                          ? isDanger
                            ? '0 0 15px rgba(239, 68, 68, 0.7), 0 0 30px rgba(239, 68, 68, 0.3), 3px 3px 0px 0px rgba(0,0,0,1)'
                            : '0 0 15px rgba(250, 204, 21, 0.7), 0 0 30px rgba(250, 204, 21, 0.3), 3px 3px 0px 0px rgba(0,0,0,1)'
                          : '3px 3px 0px 0px rgba(0,0,0,1)',
                  }}
                >
                  <span
                    className={`font-game font-black text-black ${textSize} leading-tight text-center px-1 truncate max-w-full`}
                  >
                    {p.name}
                  </span>
                </div>
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
