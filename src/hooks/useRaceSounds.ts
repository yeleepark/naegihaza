'use client';

import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { RaceState, RankingEntry } from '@/types/horse';
import { useSound } from '@/hooks/useSound';
import { RACE_CONFIG } from '@/utils/horse';

type UseRaceSoundsParams = {
  raceState: RaceState;
  countdown: number;
  isPhotoFinish: boolean;
  leadChanges: number;
  finishOrder: RankingEntry[];
  onStart: () => void;
  onRaceFinished: () => void;
};

type UseRaceSoundsReturn = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  showFlash: boolean;
  showPhotoFinishText: boolean;
  finishFlashLane: string | null;
};

export function useRaceSounds({
  raceState,
  countdown,
  isPhotoFinish,
  leadChanges,
  finishOrder,
  onStart,
  onRaceFinished,
}: UseRaceSoundsParams): UseRaceSoundsReturn {
  const {
    enabled,
    setEnabled,
    playBombTick,
    playHorseGallop,
    playHorseStart,
    playHorseFinish,
    playTick,
  } = useSound();

  const gallopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevLeadChangesRef = useRef(0);
  const prevFinishCountRef = useRef(0);
  const onRaceFinishedRef = useRef(onRaceFinished);
  onRaceFinishedRef.current = onRaceFinished;

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

  // Photo finish text
  useEffect(() => {
    if (isPhotoFinish && raceState === 'racing') {
      setShowPhotoFinishText(true);
      setTimeout(() => setShowPhotoFinishText(false), 1500);
    }
  }, [isPhotoFinish, raceState]);

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
      const timer = setTimeout(() => {
        onRaceFinishedRef.current();
      }, RACE_CONFIG.RESULT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [raceState]);

  return {
    enabled,
    setEnabled,
    showFlash,
    showPhotoFinishText,
    finishFlashLane,
  };
}
