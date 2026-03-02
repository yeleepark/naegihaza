import { useTranslation } from 'react-i18next';
import { RaceState } from '@/types/horse';

type RaceOverlaysProps = {
  waitingForGesture: boolean;
  onTapToStart: () => void;
  showFlash: boolean;
  raceState: RaceState;
  countdown: number;
  showPhotoFinishText: boolean;
};

export default function RaceOverlays({
  waitingForGesture,
  onTapToStart,
  showFlash,
  raceState,
  countdown,
  showPhotoFinishText,
}: RaceOverlaysProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Tap to start overlay */}
      {waitingForGesture && (
        <button
          type="button"
          className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl cursor-pointer"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)',
          }}
          onClick={onTapToStart}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-2 border-white/40">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <p
              className="font-game text-xl md:text-2xl font-bold text-white/90 animate-pulse"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {t('horse.tapToStart')}
            </p>
          </div>
        </button>
      )}

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
    </>
  );
}
