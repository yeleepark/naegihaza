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
}: {
  color: string;
  isRunning: boolean;
  isLeader: boolean;
}) {
  return (
    <div className={`relative ${isRunning ? 'animate-horse-gallop' : ''}`}>
      {isLeader && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 animate-leader-pulse">
          <Crown className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
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

export default function RaceTrack({
  horses,
  raceState,
  isPhotoFinish,
  leader,
  finishFlashLane,
  getFinishRank,
}: RaceTrackProps) {
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
                  <span className="absolute -top-4 right-0 animate-bounce-in">
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
