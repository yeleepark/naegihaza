import { useState, useCallback, useRef, useEffect } from 'react';
import {
  selectWinner,
  generateReelStrip,
  PARTICIPANT_COLORS,
  CELL_HEIGHT,
  SPIN_DURATION,
  REPEATS,
  RESULT_DELAY,
} from '@/utils/slot';
import { SlotResult, SlotMode } from '@/types/slot';

export function useSlotMachine(
  participants: string[],
  mode: SlotMode,
  onComplete: (result: SlotResult) => void,
) {
  const [spinning, setSpinning] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [strip, setStrip] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const winnerRef = useRef<string | null>(null);

  const handleSpin = useCallback(() => {
    const selectedWinner = selectWinner(participants);
    winnerRef.current = selectedWinner;

    const newStrip = generateReelStrip(participants, selectedWinner, REPEATS);
    setStrip(newStrip);
    setStopped(false);
    setOffset(0);
    setTransitioning(false);
    setSpinning(true);
  }, [participants]);

  useEffect(() => {
    if (!spinning || strip.length === 0) return;

    const raf = requestAnimationFrame(() => {
      const targetIndex = strip.length - 1;
      const targetOffset = targetIndex * CELL_HEIGHT;
      setTransitioning(true);
      setOffset(targetOffset);
    });

    const timer = setTimeout(() => {
      setStopped(true);
      setSpinning(false);

      const winner = winnerRef.current!;
      const winnerIndex = participants.indexOf(winner);
      const winnerColor =
        PARTICIPANT_COLORS[winnerIndex % PARTICIPANT_COLORS.length];

      setTimeout(() => {
        onComplete({
          winnerName: winner,
          winnerColor,
          totalParticipants: participants.length,
          timestamp: new Date(),
          mode,
        });
      }, RESULT_DELAY);
    }, SPIN_DURATION + 300);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [spinning, strip]); // eslint-disable-line react-hooks/exhaustive-deps

  return { spinning, stopped, strip, offset, transitioning, handleSpin };
}
