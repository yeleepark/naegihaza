'use client';

import { useCallback } from 'react';
import { Horse, RaceState, RankingEntry } from '@/types/horse';
import { useRaceSounds } from '@/hooks/useRaceSounds';
import { Volume2, VolumeX } from 'lucide-react';
import RaceOverlays from './RaceOverlays';
import RaceTrack from './RaceTrack';
import StatusBar from './StatusBar';

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
  const soundState = useRaceSounds({
    raceState,
    countdown,
    isPhotoFinish,
    leadChanges,
    finishOrder,
    onStart,
    onRaceFinished,
  });

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
        onClick={() => soundState.setEnabled(!soundState.enabled)}
        className="fixed top-[4.5rem] right-6 md:right-8 z-[8] p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-shadow"
      >
        {soundState.enabled ? (
          <Volume2 className="w-5 h-5 text-black" />
        ) : (
          <VolumeX className="w-5 h-5 text-black" />
        )}
      </button>

      <RaceOverlays
        showFlash={soundState.showFlash}
        raceState={raceState}
        countdown={countdown}
        showPhotoFinishText={soundState.showPhotoFinishText}
      />

      <RaceTrack
        horses={horses}
        raceState={raceState}
        isPhotoFinish={isPhotoFinish}
        leader={leader}
        finishFlashLane={soundState.finishFlashLane}
        getFinishRank={getFinishRank}
      />

      <StatusBar raceState={raceState} leader={leader} horses={horses} />
    </div>
  );
}
