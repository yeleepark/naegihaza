import { useTranslation } from 'react-i18next';
import { Horse, RaceState } from '@/types/horse';
import { Crown, Zap } from 'lucide-react';

type StatusBarProps = {
  raceState: RaceState;
  leader: Horse | null;
  horses: Horse[];
};

function getStatusStyle(progress: number) {
  if (progress >= 90) return { bg: 'bg-red-900', anim: 'animate-status-urgent' };
  if (progress >= 70) return { bg: 'bg-amber-900', anim: 'animate-pulse' };
  return { bg: 'bg-emerald-900', anim: 'animate-pulse' };
}

export default function StatusBar({ raceState, leader, horses }: StatusBarProps) {
  const { t } = useTranslation();

  const maxProgress = horses.length > 0 ? Math.max(...horses.map((h) => h.progress)) : 0;
  const style = getStatusStyle(maxProgress);

  return (
    <div className="shrink-0 pb-1">
      {raceState === 'racing' && (
        <div className={`${style.bg} border-4 border-black rounded-xl px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden`}>
          <p className={`font-game font-black text-white text-base md:text-lg ${style.anim} flex items-center gap-2`}>
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span>{t('horse.racing')}</span>
            {leader && (
              <span className="text-yellow-400 text-sm flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-yellow-400" /> {leader.name}
              </span>
            )}
            <span className="ml-auto text-sm text-white/70 font-bold">
              {Math.round(maxProgress)}%
            </span>
          </p>
          {/* Built-in progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div
              className="h-full transition-all duration-150 rounded-r-full"
              style={{
                width: `${Math.min(maxProgress, 100)}%`,
                backgroundColor: maxProgress >= 90 ? '#fbbf24' : maxProgress >= 70 ? '#fb923c' : '#34d399',
              }}
            />
          </div>
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
  );
}
