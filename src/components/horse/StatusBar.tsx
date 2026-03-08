import { useTranslation } from 'react-i18next';
import { Horse, RaceState } from '@/types/horse';
import { Zap } from 'lucide-react';

type StatusBarProps = {
  raceState: RaceState;
  leader: Horse | null;
  horses: Horse[];
  leadChanges: number;
};

export default function StatusBar({ raceState, horses }: StatusBarProps) {
  const { t } = useTranslation();

  const maxProgress = horses.length > 0 ? Math.max(...horses.map((h) => h.progress)) : 0;

  return (
    <div className="shrink-0 pb-1">
      {raceState === 'racing' && (
        <div className="bg-emerald-900 border-4 border-black rounded-xl px-4 md:px-6 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="flex items-center gap-2 font-game font-black text-white text-sm md:text-base">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400 shrink-0" />
            <span>{t('horse.racing')}</span>
            <span className="ml-auto text-sm text-white/70 font-bold shrink-0">
              {Math.round(maxProgress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div
              className="h-full transition-all duration-150 rounded-r-full"
              style={{
                width: `${Math.min(maxProgress, 100)}%`,
                backgroundColor: '#34d399',
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
