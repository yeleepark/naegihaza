'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Horse, RaceState, RankingEntry } from '@/types/horse';
import { useSound } from '@/hooks/useSound';
import { Volume2, VolumeX } from 'lucide-react';

type GamePlayProps = {
  horses: Horse[];
  finishOrder: RankingEntry[];
  raceState: RaceState;
  countdown: number;
  isPhotoFinish: boolean;
  leader: Horse | null;
  leadChanges: number;
  onStart: () => void;
  onRaceFinished: () => void;
};

function getRankLabel(rank: number): string {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
}

// SVG Horse Component
function SvgHorse({
  color,
  isRunning,
  isLeader,
}: {
  color: string;
  isRunning: boolean;
  isLeader: boolean;
}) {
  return (
    <div className={`relative ${isRunning ? 'animate-horse-gallop' : ''}`}>
      {isLeader && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs animate-leader-pulse">
          👑
        </span>
      )}
      <svg
        width="36"
        height="28"
        viewBox="0 0 36 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isLeader ? 'drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]' : ''}
      >
        {/* Body */}
        <ellipse cx="18" cy="14" rx="11" ry="7" fill={color} />
        {/* Head */}
        <ellipse cx="30" cy="9" rx="5" ry="4.5" fill={color} />
        {/* Eye */}
        <circle cx="32" cy="8" r="1" fill="white" />
        <circle cx="32.3" cy="7.8" r="0.5" fill="black" />
        {/* Ear */}
        <polygon points="28,5 30,2 32,5" fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
        {/* Mane */}
        <path d="M25,6 Q22,3 20,7 Q18,4 16,8" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />
        {/* Front legs */}
        <g className={isRunning ? 'animate-horse-front-legs' : ''} style={{ transformOrigin: '24px 20px' }}>
          <rect x="22" y="18" width="2" height="8" rx="1" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="0.3" />
          <rect x="25" y="18" width="2" height="8" rx="1" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="0.3" />
        </g>
        {/* Back legs */}
        <g className={isRunning ? 'animate-horse-back-legs' : ''} style={{ transformOrigin: '12px 20px' }}>
          <rect x="10" y="18" width="2" height="8" rx="1" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="0.3" />
          <rect x="13" y="18" width="2" height="8" rx="1" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="0.3" />
        </g>
        {/* Tail */}
        <path
          d="M7,11 Q3,8 2,12 Q1,16 5,15"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Dust Particles
function DustParticles({ color, isRunning }: { color: string; isRunning: boolean }) {
  if (!isRunning) return null;
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full animate-dust-puff"
          style={{
            width: `${3 + i}px`,
            height: `${3 + i}px`,
            backgroundColor: color,
            opacity: 0.4,
            top: `${-2 + i * 3}px`,
            left: `${-4 - i * 2}px`,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function GamePlay({
  horses,
  finishOrder,
  raceState,
  countdown,
  isPhotoFinish,
  leader,
  leadChanges,
  onStart,
  onRaceFinished,
}: GamePlayProps) {
  const { t } = useTranslation();
  const {
    enabled,
    setEnabled,
    playFanfare,
    playBombTick,
    playHorseGallop,
    playHorseStart,
    playHorseFinish,
    playTick,
    playHeartbeatPulse,
  } = useSound();

  const gallopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevLeadChangesRef = useRef(0);
  const prevFinishCountRef = useRef(0);
  const [showFlash, setShowFlash] = useState(false);
  const [showPhotoFinishText, setShowPhotoFinishText] = useState(false);
  const [finishFlashLane, setFinishFlashLane] = useState<string | null>(null);

  // Auto-start race on mount
  useEffect(() => {
    onStart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown sounds
  useEffect(() => {
    if (raceState === 'countdown') {
      if (countdown > 0) {
        playBombTick();
      } else if (countdown === 0) {
        playHorseStart();
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 300);
      }
    }
  }, [countdown, raceState, playBombTick, playHorseStart]);

  // Gallop sound loop during racing
  useEffect(() => {
    if (raceState === 'racing') {
      gallopIntervalRef.current = setInterval(playHorseGallop, 180);
    }
    return () => {
      if (gallopIntervalRef.current) {
        clearInterval(gallopIntervalRef.current);
        gallopIntervalRef.current = null;
      }
    };
  }, [raceState, playHorseGallop]);

  // Lead change sound
  useEffect(() => {
    if (leadChanges > prevLeadChangesRef.current && raceState === 'racing') {
      playTick();
    }
    prevLeadChangesRef.current = leadChanges;
  }, [leadChanges, raceState, playTick]);

  // Photo finish tension
  useEffect(() => {
    if (isPhotoFinish && raceState === 'racing') {
      setShowPhotoFinishText(true);
      heartbeatIntervalRef.current = setInterval(playHeartbeatPulse, 400);
      setTimeout(() => setShowPhotoFinishText(false), 1500);
    } else {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    }
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [isPhotoFinish, raceState, playHeartbeatPulse]);

  // First place finish effect
  useEffect(() => {
    if (finishOrder.length > prevFinishCountRef.current) {
      const newFinisher = finishOrder[finishOrder.length - 1];
      if (newFinisher.rank === 1) {
        playHorseFinish();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { x: 0.85, y: 0.5 },
          colors: [newFinisher.color, '#fbbf24', '#fb923c'],
          zIndex: 30,
        });
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
      }
      setFinishFlashLane(newFinisher.name);
      setTimeout(() => setFinishFlashLane(null), 300);
    }
    prevFinishCountRef.current = finishOrder.length;
  }, [finishOrder, playHorseFinish]);

  // Transition to result when race finishes
  useEffect(() => {
    if (raceState === 'finished') {
      playFanfare();
      const timer = setTimeout(() => {
        onRaceFinished();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [raceState, onRaceFinished, playFanfare]);

  const getFinishRank = useCallback(
    (name: string) => {
      const entry = finishOrder.find((f) => f.name === name);
      return entry?.rank;
    },
    [finishOrder]
  );

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-3">
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

      {/* Flash overlay */}
      {showFlash && (
        <div className="absolute inset-0 z-30 bg-white/60 animate-countdown-flash rounded-2xl pointer-events-none" />
      )}

      {/* Countdown Overlay */}
      {raceState === 'countdown' && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        >
          <div className="text-center">
            <p
              key={countdown}
              className="font-game text-7xl md:text-9xl font-black animate-countdown-pop"
              style={{
                color: countdown > 0 ? 'white' : '#fbbf24',
                textShadow:
                  countdown > 0
                    ? '0 4px 8px rgba(0,0,0,0.5)'
                    : '0 0 20px rgba(251,191,36,0.8), 0 0 40px rgba(251,191,36,0.4)',
              }}
            >
              {countdown > 0 ? countdown : t('horse.go')}
            </p>
          </div>
        </div>
      )}

      {/* Photo Finish Text Overlay */}
      {showPhotoFinishText && raceState === 'racing' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <p
            className="font-game text-xl md:text-2xl font-black animate-countdown-pop"
            style={{
              color: '#fbbf24',
              textShadow: '0 0 15px rgba(251,191,36,0.8), 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {t('horse.photoFinish')}
          </p>
        </div>
      )}

      {/* Race Track */}
      <div
        className={`flex-1 w-full flex flex-col justify-center rounded-2xl border-4 border-black overflow-hidden relative ${
          isPhotoFinish && raceState === 'racing' ? 'animate-screen-shake' : ''
        }`}
        style={{
          background: 'linear-gradient(to bottom, #065f46, #022c22)',
        }}
      >
        {/* Photo finish vignette */}
        {isPhotoFinish && raceState === 'racing' && (
          <div
            className="absolute inset-0 z-10 pointer-events-none animate-vignette-in"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        )}

        {horses.map((horse, idx) => {
          const rank = getFinishRank(horse.name);
          const isFinished = horse.progress >= 100;
          const isLeader = leader?.name === horse.name && raceState === 'racing';
          const isRacing = raceState === 'racing' && !isFinished;
          const isFlashing = finishFlashLane === horse.name;

          return (
            <div
              key={horse.name}
              className={`relative flex items-center px-2 md:px-3 ${
                isLeader ? 'animate-leader-glow' : ''
              }`}
              style={{
                height: `${100 / horses.length}%`,
                backgroundColor:
                  idx % 2 === 0
                    ? 'rgba(4, 120, 87, 0.4)'
                    : 'rgba(5, 150, 105, 0.4)',
                borderBottom:
                  idx < horses.length - 1
                    ? '1px solid rgba(255,255,255,0.1)'
                    : 'none',
              }}
            >
              {/* Finish flash */}
              {isFlashing && (
                <div className="absolute inset-0 animate-finish-flash pointer-events-none z-10" />
              )}

              {/* Name label */}
              <div className="w-14 md:w-20 shrink-0 z-[2]">
                <span
                  className="block font-game text-[10px] md:text-xs font-bold text-white px-1.5 py-0.5 rounded border border-black/30 truncate"
                  style={{ backgroundColor: `${horse.color}cc` }}
                >
                  {horse.name}
                </span>
              </div>

              {/* Track area */}
              <div className="relative flex-1 h-full flex items-center">
                {/* Finish line */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-3 md:w-4 z-[1]"
                  style={{
                    background:
                      'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 8px 8px',
                  }}
                />

                {/* Horse position */}
                <div
                  className="absolute flex items-center z-[2] transition-[left] duration-75"
                  style={{
                    left: `calc(${Math.min(horse.progress, 95)}% - 18px)`,
                  }}
                >
                  {/* Dust particles */}
                  {isRacing && (
                    <DustParticles color={horse.color} isRunning={isRacing} />
                  )}

                  {/* SVG Horse */}
                  <SvgHorse
                    color={horse.color}
                    isRunning={isRacing}
                    isLeader={isLeader}
                  />

                  {/* Rank badge */}
                  {raceState === 'racing' && !isFinished && (
                    <span
                      className={`absolute -top-4 right-0 font-game text-[9px] md:text-[10px] font-black px-1 rounded ${
                        horse.currentRank === 1
                          ? 'bg-yellow-400 text-black animate-leader-pulse'
                          : 'bg-black/50 text-white'
                      }`}
                    >
                      {getRankLabel(horse.currentRank)}
                    </span>
                  )}

                  {/* Finish rank badge */}
                  {isFinished && rank && (
                    <span className="absolute -top-4 right-0 font-game text-sm font-black animate-bounce-in">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}th`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Bar */}
      <div className="shrink-0 pb-1">
        {raceState === 'racing' && (
          <div className="bg-emerald-900 border-4 border-black rounded-xl px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-game font-black text-white text-base md:text-lg animate-pulse flex items-center gap-2">
              <span>🏇</span>
              <span>{t('horse.racing')}</span>
              {leader && (
                <span className="text-yellow-400 text-sm">
                  👑 {leader.name}
                </span>
              )}
            </p>
          </div>
        )}
        {raceState === 'finished' && (
          <div className="bg-emerald-900 border-4 border-black rounded-xl px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-game font-black text-white text-base md:text-lg">
              {t('horse.finished')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
