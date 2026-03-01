import { useState, useCallback, useRef, useEffect } from 'react';
import { BombParticipant, BombResult } from '@/types/bomb';
import {
  generateParticipants,
  generateTimerDuration,
  selectStartingIndex,
  INITIAL_INTERVAL,
  FINAL_INTERVAL,
} from '@/utils/bomb';

interface BombGameCallbacks {
  onComplete: (result: BombResult) => void;
  onMove?: () => void;
  onExplode?: () => void;
}

export function useBombGame(callbacks: BombGameCallbacks) {
  const [participants, setParticipants] = useState<BombParticipant[]>([]);
  const [currentHolder, setCurrentHolder] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [preExplosion, setPreExplosion] = useState(false);
  const [remainingRatio, setRemainingRatio] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);
  const totalDurationRef = useRef(0);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;
  const participantsRef = useRef<BombParticipant[]>([]);
  const directionRef = useRef<1 | -1>(1);
  const moveCountRef = useRef(0);
  const totalMovesRef = useRef(0);
  const fakeOutCountRef = useRef(0);
  const fakeOutMovesLeftRef = useRef(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const scheduleNext = useCallback((holderIndex: number) => {
    const elapsed = performance.now() - startTimeRef.current;
    const total = totalDurationRef.current;

    if (elapsed >= total) {
      // Pre-explosion freeze — bomb swells for 800ms before detonation
      setPreExplosion(true);
      setIsRunning(false);

      setTimeout(() => {
        setPreExplosion(false);
        setExploded(true);
        callbacksRef.current.onExplode?.();

        const p = participantsRef.current;
        const loser = p[holderIndex];

        setTimeout(() => {
          callbacksRef.current.onComplete({
            winnerName: loser.name,
            winnerColor: loser.color,
            totalParticipants: p.length,
            timestamp: new Date(),
          });
        }, 2000);
      }, 800);
      return;
    }

    // Linear acceleration: 1000ms → 50ms
    const progress = Math.min(elapsed / total, 1);
    const interval = INITIAL_INTERVAL + (FINAL_INTERVAL - INITIAL_INTERVAL) * progress;

    timerRef.current = setTimeout(() => {
      const p = participantsRef.current;
      const len = p.length;
      const nextIndex = ((holderIndex + directionRef.current) % len + len) % len;
      moveCountRef.current++;
      setCurrentHolder(nextIndex);
      callbacksRef.current.onMove?.();
      scheduleNext(nextIndex);
    }, interval);
  }, []);

  const updateRemainingRatio = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current;
    const total = totalDurationRef.current;
    const ratio = Math.max(0, 1 - elapsed / total);
    setRemainingRatio(ratio);
    if (ratio > 0) {
      rafRef.current = requestAnimationFrame(updateRemainingRatio);
    }
  }, []);

  const handleSetup = useCallback((names: string[]) => {
    const p = generateParticipants(names);
    setParticipants(p);
    participantsRef.current = p;
    setCurrentHolder(-1);
    setExploded(false);
    setIsRunning(false);
  }, []);

  const handleStart = useCallback(() => {
    cleanup();
    const p = participantsRef.current;
    const startIndex = selectStartingIndex(p.length);
    const duration = generateTimerDuration();

    // Estimate total moves: sum intervals until they fill the duration
    // average interval ≈ (INITIAL + FINAL) / 2
    const avgInterval = (INITIAL_INTERVAL + FINAL_INTERVAL) / 2;
    totalMovesRef.current = Math.max(10, Math.round(duration / avgInterval));

    startTimeRef.current = performance.now();
    totalDurationRef.current = duration;
    directionRef.current = 1;
    moveCountRef.current = 0;
    fakeOutCountRef.current = 0;
    fakeOutMovesLeftRef.current = 0;

    setCurrentHolder(startIndex);
    setExploded(false);
    setPreExplosion(false);
    setIsRunning(true);
    setRemainingRatio(1);
    setDirection(1);

    // Start remaining ratio updates
    rafRef.current = requestAnimationFrame(updateRemainingRatio);

    // Schedule first move after initial interval
    scheduleNext(startIndex);
  }, [cleanup, scheduleNext, updateRemainingRatio]);

  const handlePlayAgain = useCallback(() => {
    cleanup();
    setCurrentHolder(-1);
    setExploded(false);
    setPreExplosion(false);
    setIsRunning(false);
  }, [cleanup]);

  const handleReset = useCallback(() => {
    cleanup();
    setParticipants([]);
    participantsRef.current = [];
    setCurrentHolder(-1);
    setExploded(false);
    setPreExplosion(false);
    setIsRunning(false);
  }, [cleanup]);

  const restoreFromURL = useCallback((names: string[], result?: BombResult) => {
    const p = generateParticipants(names);
    setParticipants(p);
    participantsRef.current = p;
    setCurrentHolder(-1);
    setExploded(false);
    setPreExplosion(false);
    setIsRunning(false);
    if (result) {
      setExploded(false);
    }
  }, []);

  return {
    participants,
    currentHolder,
    isRunning,
    exploded,
    preExplosion,
    remainingRatio,
    direction,
    handleSetup,
    handleStart,
    handlePlayAgain,
    handleReset,
    restoreFromURL,
  };
}
