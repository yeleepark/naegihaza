import { useTranslation } from 'react-i18next';
import { Horse, RaceState } from '@/types/horse';
import { Crown, Zap } from 'lucide-react';

type StatusBarProps = {
  raceState: RaceState;
  leader: Horse | null;
};

export default function StatusBar({ raceState, leader }: StatusBarProps) {
  const { t } = useTranslation();

  return (
    <div className="shrink-0 pb-1">
      {raceState === 'racing' && (
        <div className="bg-emerald-900 border-4 border-black rounded-xl px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-game font-black text-white text-base md:text-lg animate-pulse flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span>{t('horse.racing')}</span>
            {leader && (
              <span className="text-yellow-400 text-sm flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-yellow-400" /> {leader.name}
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
  );
}
