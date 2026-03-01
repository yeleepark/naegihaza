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
import { SlotResult } from '@/types/slot';

export interface SlotCallbacks {
  onComplete: (result: SlotResult) => void;
  onTick?: () => void;
  onResult?: () => void;
}

/** Power-6 ease-out: fast start, dramatically slow end */
function dramaticEase(t: number): number {
  return 1 - Math.pow(1 - t, 6);
}

export function useSlotMachine(
  participants: string[],
  callbacks: SlotCallbacks,
) {
  const [spinning, setSpinning] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [strip, setStrip] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef(0);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleSpin = useCallback(() => {
    const selectedWinner = selectWinner(participants);

    const newStrip = generateReelStrip(participants, selectedWinner, REPEATS);
    setStrip(newStrip);
    setStopped(false);
    setOffset(0);
    setSpinning(true);

    const targetOffset = (newStrip.length - 1) * CELL_HEIGHT;
    const startTime = performance.now();
    let lastCellIndex = 0;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);
      const eased = dramaticEase(progress);

      const currentOffset = eased * targetOffset;
      setOffset(currentOffset);

      // Detect cell crossing for tick sound
      const currentCellIndex = Math.floor(currentOffset / CELL_HEIGHT);
      if (currentCellIndex > lastCellIndex) {
        callbacksRef.current.onTick?.();
        lastCellIndex = currentCellIndex;
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setOffset(targetOffset);
        setStopped(true);
        setSpinning(false);
        callbacksRef.current.onResult?.();

        const winnerIndex = participants.indexOf(selectedWinner);
        const winnerColor =
          PARTICIPANT_COLORS[winnerIndex % PARTICIPANT_COLORS.length];

        setTimeout(() => {
          callbacksRef.current.onComplete({
            winnerName: selectedWinner,
            winnerColor,
            totalParticipants: participants.length,
            timestamp: new Date(),
          });
        }, RESULT_DELAY);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [participants]);

  return { spinning, stopped, strip, offset, handleSpin };
}
