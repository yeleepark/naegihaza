import { useState, useCallback } from 'react';
import {
  generateParticipants,
  generateWheelSegments,
  selectWinner,
  calculateSpinConfig,
  createRouletteResult,
} from '@/utils/roulette';
import {
  Participant,
  WheelSegment,
  SpinConfig,
  RouletteResult,
} from '@/types/roulette';

export function useRouletteGame() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [segments, setSegments] = useState<WheelSegment[]>([]);
  const [spinConfig, setSpinConfig] = useState<SpinConfig | undefined>(
    undefined
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<RouletteResult | null>(null);

  const handleStart = useCallback((names: string[]) => {
    const newParticipants = generateParticipants(names);
    setParticipants(newParticipants);
    setSegments(generateWheelSegments(names.length));
    setIsSpinning(false);
    setSpinConfig(undefined);
    setResult(null);
  }, []);

  const handleShuffle = useCallback(() => {
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const reshuffled = shuffled.map((p, i) => ({ ...p, id: i, displayNumber: i + 1 }));
    setParticipants(reshuffled);
    setSegments(generateWheelSegments(reshuffled.length));
    setSpinConfig(undefined);
  }, [participants]);

  const handleSpin = useCallback(() => {
    const winnerIndex = selectWinner(participants.length);
    const config = calculateSpinConfig(winnerIndex, participants.length);

    setSpinConfig(config);
    setIsSpinning(true);

    const newResult = createRouletteResult(winnerIndex, participants);
    setResult(newResult);
  }, [participants]);

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setResult(null);
    setIsSpinning(false);
    setSpinConfig(undefined);
  }, []);

  const resetGame = useCallback(() => {
    setParticipants([]);
    setSegments([]);
    setSpinConfig(undefined);
    setIsSpinning(false);
    setResult(null);
  }, []);

  const restoreFromURL = useCallback((
    names: string[],
    urlResult?: RouletteResult | null,
  ) => {
    const newParticipants = generateParticipants(names);
    setParticipants(newParticipants);
    setSegments(generateWheelSegments(names.length));
    if (urlResult) {
      setResult(urlResult);
    }
  }, []);

  return {
    participants,
    segments,
    spinConfig,
    isSpinning,
    result,
    handleStart,
    handleShuffle,
    handleSpin,
    handleSpinComplete,
    handlePlayAgain,
    resetGame,
    restoreFromURL,
  };
}
