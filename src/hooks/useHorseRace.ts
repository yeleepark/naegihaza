import { useState, useCallback, useRef } from 'react';
import { Horse, RaceState, RankingEntry } from '@/types/horse';
import { getHorseColor } from '@/utils/horse';

interface UseHorseRaceReturn {
  horses: Horse[];
  finishOrder: RankingEntry[];
  raceState: RaceState;
  countdown: number;
  isPhotoFinish: boolean;
  leader: Horse | null;
  leadChanges: number;
  startRace: () => void;
  resetRace: (names: string[]) => void;
}

export function useHorseRace(): UseHorseRaceReturn {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [finishOrder, setFinishOrder] = useState<RankingEntry[]>([]);
  const [raceState, setRaceState] = useState<RaceState>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [isPhotoFinish, setIsPhotoFinish] = useState(false);
  const [leader, setLeader] = useState<Horse | null>(null);
  const [leadChanges, setLeadChanges] = useState(0);

  const rafRef = useRef<number>(0);
  const horsesRef = useRef<Horse[]>([]);
  const finishOrderRef = useRef<RankingEntry[]>([]);
  const baseSpeeds = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);
  const prevLeaderRef = useRef<string | null>(null);
  const leadChangesRef = useRef(0);

  const resetRace = useCallback((names: string[]) => {
    cancelAnimationFrame(rafRef.current);
    const newHorses = names.map((name, i) => ({
      name,
      color: getHorseColor(i),
      progress: 0,
      currentRank: i + 1,
      speed: 0,
    }));
    horsesRef.current = newHorses;
    finishOrderRef.current = [];
    prevLeaderRef.current = null;
    leadChangesRef.current = 0;
    setHorses(newHorses);
    setFinishOrder([]);
    setRaceState('countdown');
    setCountdown(3);
    setIsPhotoFinish(false);
    setLeader(null);
    setLeadChanges(0);

    // Assign base speeds — tight range for fairness, drama comes from variation
    baseSpeeds.current = names.map(() => 0.22 + Math.random() * 0.04);
  }, []);

  const startRace = useCallback(() => {
    setRaceState('countdown');
    setCountdown(3);
    setIsPhotoFinish(false);
    setLeader(null);
    setLeadChanges(0);
    prevLeaderRef.current = null;
    leadChangesRef.current = 0;

    // Reset all horses to start
    horsesRef.current = horsesRef.current.map((h, i) => ({
      ...h,
      progress: 0,
      currentRank: i + 1,
      speed: 0,
    }));
    finishOrderRef.current = [];
    setFinishOrder([]);
    setHorses(horsesRef.current);

    // Re-randomize base speeds
    baseSpeeds.current = horsesRef.current.map(() => 0.22 + Math.random() * 0.04);

    // Countdown: 3, 2, 1, GO!
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownInterval);
        setCountdown(0);
        setRaceState('racing');
        lastTimeRef.current = 0;
        rafRef.current = requestAnimationFrame(raceLoop);
      }
    }, 800);
  }, []);

  const raceLoop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
      rafRef.current = requestAnimationFrame(raceLoop);
      return;
    }

    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Cap delta to avoid jumps when tab is inactive
    const cappedDelta = Math.min(delta, 50);

    const currentHorses = horsesRef.current;
    const finished = finishOrderRef.current;
    let allFinished = true;

    // Find current leader progress for rubber-banding
    const maxProgress = Math.max(...currentHorses.map((h) => h.progress));
    const minProgress = Math.min(
      ...currentHorses.filter((h) => h.progress < 100).map((h) => h.progress),
    );
    const spread = maxProgress - minProgress;

    const updated = currentHorses.map((horse, i) => {
      if (horse.progress >= 100) return horse;

      allFinished = false;

      const base = baseSpeeds.current[i];
      const p = horse.progress;

      // === Phase-based multiplier ===
      let phaseMult: number;
      if (p < 3) {
        // Start: brief acceleration (0.75 → 1.0)
        phaseMult = 0.75 + (p / 3) * 0.25;
      } else if (p < 40) {
        // Early race: normal
        phaseMult = 1.0;
      } else if (p < 55) {
        // Mid-race pack-up: slight slowdown to bunch horses together
        phaseMult = 0.8 + Math.random() * 0.15;
      } else if (p < 75) {
        // Second wind: back to normal with bigger swings
        phaseMult = 0.9 + Math.random() * 0.4;
      } else if (p < 90) {
        // Final approach: tension builds, volatile speed
        phaseMult = 0.7 + Math.random() * 0.6;
      } else {
        // Final stretch: dramatic — can stall or sprint
        phaseMult = 0.5 + Math.random() * 0.9;
      }

      // === Rubber-banding: trailing horses catch up, leaders slow slightly ===
      let rubberBand = 0;
      if (spread > 3) {
        const normalizedPos = (horse.progress - minProgress) / spread; // 0=last, 1=first
        rubberBand = (0.5 - normalizedPos) * 0.08; // trailing: +0.04, leading: -0.04
      }

      // === Random variation ===
      const variation = (Math.random() - 0.5) * 0.18;

      // === Burst / stall events ===
      let event = 0;
      const roll = Math.random();
      if (p > 20 && p < 95) {
        if (roll < 0.008) event = 0.35; // big burst (0.8%)
        else if (roll < 0.025) event = 0.18; // small burst (1.7%)
        else if (roll < 0.035) event = -0.1; // stumble (1.0%)
      }
      // Final stretch special events
      if (p >= 90) {
        if (roll < 0.015) event = 0.4; // dramatic sprint
        else if (roll < 0.03) event = -0.08; // dramatic stall
      }

      const speed = Math.max(0.06, (base + variation + rubberBand + event) * phaseMult);
      const newProgress = Math.min(100, horse.progress + speed * cappedDelta * 0.06);

      // Check if just finished
      if (newProgress >= 100 && horse.progress < 100) {
        const rank = finished.length + 1;
        finishOrderRef.current = [
          ...finished,
          { name: horse.name, color: horse.color, rank },
        ];
      }

      return { ...horse, progress: newProgress, speed };
    });

    // Calculate real-time ranks based on progress
    const sorted = [...updated]
      .filter((h) => h.progress < 100)
      .sort((a, b) => b.progress - a.progress);
    const finishedCount = finishOrderRef.current.length;

    updated.forEach((horse) => {
      if (horse.progress >= 100) {
        const entry = finishOrderRef.current.find((f) => f.name === horse.name);
        horse.currentRank = entry?.rank ?? 1;
      } else {
        const idx = sorted.findIndex((s) => s.name === horse.name);
        horse.currentRank = finishedCount + idx + 1;
      }
    });

    // Track leader changes
    const currentLeader = updated.reduce((best, h) =>
      h.progress > best.progress ? h : best
    );
    if (prevLeaderRef.current && prevLeaderRef.current !== currentLeader.name) {
      leadChangesRef.current++;
      setLeadChanges(leadChangesRef.current);
    }
    prevLeaderRef.current = currentLeader.name;
    setLeader(currentLeader);

    // Photo finish detection: top 2 within 8% gap at 75%+ progress
    const activeHorses = updated.filter((h) => h.progress < 100);
    if (activeHorses.length >= 2) {
      const sortedActive = [...activeHorses].sort((a, b) => b.progress - a.progress);
      const top1 = sortedActive[0];
      const top2 = sortedActive[1];
      if (top1.progress > 75 && top1.progress - top2.progress <= 8) {
        setIsPhotoFinish(true);
      } else {
        setIsPhotoFinish(false);
      }
    }

    horsesRef.current = updated;
    setHorses([...updated]);
    setFinishOrder([...finishOrderRef.current]);

    if (allFinished) {
      setRaceState('finished');
    } else {
      rafRef.current = requestAnimationFrame(raceLoop);
    }
  }, []);

  return {
    horses,
    finishOrder,
    raceState,
    countdown,
    isPhotoFinish,
    leader,
    leadChanges,
    startRace,
    resetRace,
  };
}
