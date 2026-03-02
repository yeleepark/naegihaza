import { Horse, RaceState } from '@/types/horse';
import { Crown, Medal } from 'lucide-react';

type RaceTrackProps = {
  horses: Horse[];
  raceState: RaceState;
  isPhotoFinish: boolean;
  leader: Horse | null;
  finishFlashLane: string | null;
  getFinishRank: (name: string) => number | undefined;
};

function getRankLabel(rank: number): string {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
}

function SvgHorse({
  color,
  isRunning,
  isLeader,
  speed,
}: {
  color: string;
  isRunning: boolean;
  isLeader: boolean;
  speed: number;
}) {
  const gallopDuration = isRunning ? Math.max(0.12, 0.3 - speed * 0.25) : 0;
  const legDuration = isRunning ? Math.max(0.1, 0.35 - speed * 0.3) : 0;
  const mouthOpen = isRunning && speed > 0.15;

  return (
    <div
      className={`relative ${isRunning ? 'animate-horse-gallop' : ''}`}
      style={isRunning ? { animationDuration: `${gallopDuration}s` } : undefined}
    >
      {isLeader && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 animate-leader-pulse">
          <Crown className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        </span>
      )}
      <svg
        width="40"
        height="36"
        viewBox="0 0 40 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isLeader ? 'drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]' : ''}
      >
        {/* Body */}
        <ellipse cx="14" cy="20" rx="9" ry="6" fill={color} />
        <ellipse cx="14" cy="22" rx="5.5" ry="3" fill="white" opacity="0.15" />

        {/* Neck */}
        <path d="M20,16 C23,13 25,11 28,12 C27,16 24,19 21,19 Z" fill={color} />

        {/* Head — elongated horizontal oval (horse face profile) */}
        <ellipse cx="32" cy="10" rx="6" ry="4.5" fill={color} />
        <ellipse cx="30" cy="9" rx="3" ry="2" fill="white" opacity="0.1" />

        {/* Muzzle — protruding snout */}
        <ellipse cx="37" cy="13.5" rx="2.8" ry="2" fill={color} />

        {/* Nostrils */}
        <circle cx="38.8" cy="13" r="0.5" fill="rgba(0,0,0,0.3)" />
        <circle cx="38.8" cy="14.2" r="0.4" fill="rgba(0,0,0,0.2)" />

        {/* Eye — one big cute eye (side view) */}
        <ellipse cx="30" cy="9" rx="2" ry="2.5" fill="white" />
        <ellipse cx="30.3" cy="9.2" rx="1.3" ry="1.6" fill="#1a1a2e" />
        <circle cx="30.8" cy="8.5" r="0.6" fill="white" opacity="0.9" />
        <circle cx="30" cy="9.8" r="0.3" fill="white" opacity="0.6" />

        {/* Blush */}
        <ellipse cx="35" cy="11.5" rx="1.5" ry="1" fill="#f9a8d4" opacity="0.4" />

        {/* Ears — tall pointed horse ears */}
        <path d="M28.5,5.5 L29.5,1 L31,5.2" fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" />
        <path d="M29,4.8 L29.7,1.8 L30.5,4.7" fill="#f9a8d4" opacity="0.35" />
        <path d="M31,6 L32.2,2 L33.5,5.8" fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" />
        <path d="M31.5,5.5 L32.3,2.8 L33,5.4" fill="#f9a8d4" opacity="0.35" />

        {/* Mane — flowing along head and neck */}
        <path d="M28,3.5 Q24,7 22,12 Q21,15 20,17" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M30,3.5 Q28,5 27,7" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Mouth */}
        {mouthOpen ? (
          <ellipse cx="38" cy="15" rx="1" ry="0.7" fill="#1a1a2e" opacity="0.5" />
        ) : (
          <path d="M36.5,15 Q37.5,16 39,15" stroke="#1a1a2e" strokeWidth="0.5" fill="none" opacity="0.4" />
        )}

        {/* Front legs — short stubby */}
        <g
          className={isRunning ? 'animate-horse-front-legs' : ''}
          style={{
            transformOrigin: '20px 26px',
            ...(isRunning ? { animationDuration: `${legDuration}s` } : {}),
          }}
        >
          <rect x="18" y="25" width="2.5" height="5" rx="1.2" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="0.3" />
          <rect x="22" y="25" width="2.5" height="5" rx="1.2" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="0.3" />
        </g>
        {/* Back legs — short stubby */}
        <g
          className={isRunning ? 'animate-horse-back-legs' : ''}
          style={{
            transformOrigin: '10px 26px',
            ...(isRunning ? { animationDuration: `${legDuration}s` } : {}),
          }}
        >
          <rect x="7" y="25" width="2.5" height="5" rx="1.2" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="0.3" />
          <rect x="11" y="25" width="2.5" height="5" rx="1.2" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="0.3" />
        </g>

        {/* Tail — flowing curve */}
        <path
          d="M5,17 Q1,12 0,16 Q-1,21 4,19"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function SpeedLines({ speed }: { speed: number }) {
  if (speed <= 0.25) return null;
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute animate-speed-line"
          style={{
            width: `${8 + i * 3}px`,
            height: '1.5px',
            backgroundColor: 'rgba(255,255,255,0.5)',
            top: `${-4 + i * 5}px`,
            left: `${-6 - i * 3}px`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

function DustParticles({ color, isRunning, speed }: { color: string; isRunning: boolean; speed: number }) {
  if (!isRunning) return null;
  const count = speed > 0.4 ? 6 : speed > 0.2 ? 5 : 4;
  const dustColors = [color, '#d4a574', '#c2956b', color, '#b8886a', '#a87d5f'];
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-dust-puff-v2"
          style={{
            width: `${2 + (i % 3) * 1.5}px`,
            height: `${2 + (i % 3) * 1.5}px`,
            backgroundColor: dustColors[i % dustColors.length],
            opacity: 0.5,
            top: `${-3 + i * 2.5}px`,
            left: `${-5 - (i % 3) * 2}px`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function RaceTrack({
  horses,
  raceState,
  isPhotoFinish,
  leader,
  finishFlashLane,
  getFinishRank,
}: RaceTrackProps) {
  const maxProgress = Math.max(...horses.map((h) => h.progress));
  const showFinalStretch = maxProgress > 80 && raceState === 'racing';

  return (
    <div
      className={`flex-1 w-full flex flex-col justify-center rounded-2xl border-4 border-black overflow-hidden relative min-h-[60dvh] md:min-h-0 ${
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

      {/* Final stretch golden pulse on right side */}
      {showFinalStretch && (
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-[1] pointer-events-none animate-final-stretch-pulse"
          style={{
            background: 'linear-gradient(to left, rgba(251,191,36,0.3), transparent)',
          }}
        />
      )}

      {horses.map((horse, idx) => {
        const rank = getFinishRank(horse.name);
        const isFinished = horse.progress >= 100;
        const isLeader = leader?.name === horse.name && raceState === 'racing';
        const isRacing = raceState === 'racing' && !isFinished;
        const isFlashing = finishFlashLane === horse.name;
        const showFinishGlow = horse.progress > 85 && raceState === 'racing';

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
            <div className="relative flex-1 h-full flex items-center" style={{ containerType: 'inline-size' }}>
              {/* Finish line */}
              <div
                className={`absolute right-0 top-0 bottom-0 w-3 md:w-4 z-[1] ${
                  showFinishGlow ? 'animate-finish-line-pulse' : ''
                }`}
                style={{
                  background:
                    'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 8px 8px',
                }}
              />

              {/* Lane progress bar */}
              {raceState === 'racing' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 z-[0]">
                  <div
                    className="h-full rounded-r-full transition-all duration-100"
                    style={{
                      width: `${Math.min(horse.progress, 100)}%`,
                      backgroundColor: `${horse.color}40`,
                    }}
                  />
                </div>
              )}

              {/* Horse position */}
              <div
                className="absolute flex items-center z-[2]"
                style={{
                  left: 0,
                  transform: `translateX(calc(${Math.min(horse.progress, 95)}cqw - 20px))`,
                  willChange: 'transform',
                }}
              >
                {/* Speed lines */}
                {isRacing && <SpeedLines speed={horse.speed} />}

                {/* Dust particles */}
                {isRacing && (
                  <DustParticles color={horse.color} isRunning={isRacing} speed={horse.speed} />
                )}

                {/* SVG Horse */}
                <SvgHorse
                  color={horse.color}
                  isRunning={isRacing}
                  isLeader={isLeader}
                  speed={horse.speed}
                />

                {/* Rank badge */}
                {raceState === 'racing' && !isFinished && (
                  <span
                    className={`absolute -top-5 right-0 font-game text-[9px] md:text-[10px] font-black px-1 rounded ${
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
                  <span className="absolute -top-5 right-0 animate-bounce-in">
                    {rank <= 3 ? (
                      <Medal
                        className="w-4 h-4"
                        style={{
                          color: rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : '#b45309',
                          fill: rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : '#b45309',
                        }}
                      />
                    ) : (
                      <span className="font-game text-[10px] font-black text-white bg-black/50 px-1 rounded">
                        {rank}th
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
