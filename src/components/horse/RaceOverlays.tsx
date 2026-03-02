import { useTranslation } from 'react-i18next';
import { RaceState } from '@/types/horse';

type RaceOverlaysProps = {
  showFlash: boolean;
  raceState: RaceState;
  countdown: number;
  showPhotoFinishText: boolean;
};

function getCountdownSubtitle(countdown: number, t: (key: string) => string): string {
  if (countdown === 3) return t('horse.ready');
  if (countdown === 2) return t('horse.set');
  if (countdown === 1) return t('horse.almost');
  return '';
}

export default function RaceOverlays({
  showFlash,
  raceState,
  countdown,
  showPhotoFinishText,
}: RaceOverlaysProps) {
  const { t } = useTranslation();

  const countdownColor = countdown === 1 ? '#fb923c' : countdown > 0 ? 'white' : '#fbbf24';
  const countdownShadow =
    countdown === 1
      ? '0 0 20px rgba(251,146,60,0.8), 0 0 40px rgba(251,146,60,0.4)'
      : countdown > 0
        ? '0 4px 8px rgba(0,0,0,0.5)'
        : '0 0 20px rgba(251,191,36,0.8), 0 0 40px rgba(251,191,36,0.4)';

  return (
    <>
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
          <div className="text-center relative">
            {/* Expanding ring */}
            {countdown > 0 && (
              <div
                key={`ring-${countdown}`}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div
                  className="w-20 h-20 rounded-full animate-countdown-ring"
                  style={{
                    borderColor: countdownColor,
                    borderStyle: 'solid',
                  }}
                />
              </div>
            )}

            <p
              key={countdown}
              className="font-game text-7xl md:text-9xl font-black animate-countdown-pop"
              style={{
                color: countdownColor,
                textShadow: countdownShadow,
              }}
            >
              {countdown > 0 ? countdown : t('horse.go')}
            </p>

            {/* Subtitle */}
            {countdown > 0 && (
              <p
                className="font-game text-lg md:text-xl font-bold mt-2 animate-countdown-pop"
                style={{
                  color: countdownColor,
                  opacity: 0.8,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {getCountdownSubtitle(countdown, t)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Photo Finish Text Overlay */}
      {showPhotoFinishText && raceState === 'racing' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div
            className="animate-photo-finish-flash rounded-lg px-4 py-2"
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: '2px solid rgba(251,191,36,0.6)',
            }}
          >
            <p
              className="font-game text-xl md:text-2xl font-black"
              style={{
                color: '#fbbf24',
                textShadow: '0 0 15px rgba(251,191,36,0.8), 0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {t('horse.photoFinish')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
