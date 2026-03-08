import { useState, useCallback, useRef } from 'react';
import { Horse, RaceState, RankingEntry } from '@/types/horse';
import { getHorseColor, RACE_CONFIG } from '@/utils/horse';

const RC = RACE_CONFIG;

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

// --- Pure helper functions extracted from raceLoop ---

function computePhaseMult(p: number): number {
  if (p < RC.PHASE_START) {
    return 0.8 + (p / RC.PHASE_START) * 0.2;
  } else if (p < RC.PHASE_EARLY) {
    return 0.88 + Math.random() * 0.20;
  } else if (p < RC.PHASE_MID) {
    return 0.80 + Math.random() * 0.35;
  } else if (p < RC.PHASE_SECOND_WIND) {
    return 0.75 + Math.random() * 0.55;
  } else if (p < RC.PHASE_TENSION) {
    return 0.70 + Math.random() * 0.65;
  } else if (p < RC.PHASE_FINAL_APPROACH) {
    // Tension zone: wider variance = more dramatic swings
    return 0.60 + Math.random() * 0.85;
  } else {
    // Final approach: explosive finish
    return 0.65 + Math.random() * 0.90;
  }
}

function computeRubberBand(horseProgress: number, minProgress: number, maxProgress: number, spread: number): number {
  if (spread <= RC.RUBBER_BAND_THRESHOLD) return 0;
  const normalizedPos = (horseProgress - minProgress) / spread;
  // Progressive: rubber-banding intensifies as race progresses
  const progressFactor = 1 + (maxProgress / 100) * RC.RUBBER_BAND_PROGRESS_SCALE;
  return (0.5 - normalizedPos) * RC.RUBBER_BAND_INTENSITY * progressFactor;
}

function computeEvent(p: number, isLeader: boolean): number {
  const roll = Math.random();
  if (p > 20 && p < 95) {
    if (roll < RC.EVENT_BIG_BURST.chance) return RC.EVENT_BIG_BURST.value;
    if (roll < RC.EVENT_SMALL_BURST.chance) return RC.EVENT_SMALL_BURST.value;
    if (roll < RC.EVENT_STUMBLE.chance) return RC.EVENT_STUMBLE.value;
  }
  // Mid-race drama events (40-65%)
  if (p >= 40 && p < 65) {
    const roll3 = Math.random();
    if (!isLeader && roll3 < RC.EVENT_MID_SURGE.chance) return RC.EVENT_MID_SURGE.value;
    if (isLeader && roll3 < RC.EVENT_MID_STUMBLE.chance) return RC.EVENT_MID_STUMBLE.value;
  }
  // Tension zone: dramatic events for catch-up drama
  if (p >= RC.PHASE_TENSION && p < RC.PHASE_FINAL_APPROACH) {
    const roll2 = Math.random();
    if (!isLeader && roll2 < RC.EVENT_DRAMATIC_SURGE.chance) return RC.EVENT_DRAMATIC_SURGE.value;
    if (isLeader && roll2 < RC.EVENT_LEADER_STUMBLE.chance) return RC.EVENT_LEADER_STUMBLE.value;
  }
  if (p >= RC.PHASE_FINAL_APPROACH) {
    if (roll < RC.EVENT_SPRINT.chance) return RC.EVENT_SPRINT.value;
    if (roll < RC.EVENT_FATIGUE.chance) return RC.EVENT_FATIGUE.value;
  }
  return 0;
}

function updateHorseProgress(
  horse: Horse,
  index: number,
  spread: number,
  minProgress: number,
  maxProgress: number,
  cappedDelta: number,
  baseSpeeds: number[],
  smoothedSpeeds: number[],
): Horse {
  if (horse.progress >= 100) return horse;

  const base = baseSpeeds[index];
  const p = horse.progress;
  const isLeader = p >= maxProgress - 0.5;

  const phaseMult = computePhaseMult(p);
  const rubberBand = computeRubberBand(p, minProgress, maxProgress, spread);
  const variation = (Math.random() - 0.5) * RC.RANDOM_VARIATION;
  const event = computeEvent(p, isLeader);

  // Leader drag: slight penalty for being in 1st place
  const leaderDrag = isLeader && p > RC.LEADER_DRAG_PROGRESS_MIN ? -RC.LEADER_DRAG : 0;

  const targetSpeed = Math.max(RC.MIN_SPEED, (base + variation + rubberBand + event + leaderDrag) * phaseMult);

  const prev = smoothedSpeeds[index];
  const speed = prev + (targetSpeed - prev) * RC.SMOOTHING;
  smoothedSpeeds[index] = speed;

  const newProgress = Math.min(100, horse.progress + speed * cappedDelta * RC.PROGRESS_MULTIPLIER);
  return { ...horse, progress: newProgress, speed };
}

function updateRanks(
  horses: Horse[],
  finishOrder: RankingEntry[],
): void {
  const sorted = [...horses]
    .filter((h) => h.progress < 100)
    .sort((a, b) => b.progress - a.progress);
  const finishedCount = finishOrder.length;

  horses.forEach((horse) => {
    if (horse.progress >= 100) {
      const entry = finishOrder.find((f) => f.name === horse.name);
      horse.currentRank = entry?.rank ?? 1;
    } else {
      const idx = sorted.findIndex((s) => s.name === horse.name);
      horse.currentRank = finishedCount + idx + 1;
    }
  });
}

function detectLeaderChange(
  horses: Horse[],
  prevLeaderName: string | null,
): { leader: Horse; changed: boolean } {
  const leader = horses.reduce((best, h) =>
    h.progress > best.progress ? h : best,
  );
  const changed = prevLeaderName !== null && prevLeaderName !== leader.name;
  return { leader, changed };
}

function detectPhotoFinish(horses: Horse[]): boolean {
  const active = horses.filter((h) => h.progress < 100);
  if (active.length < 2) return false;
  const sorted = [...active].sort((a, b) => b.progress - a.progress);
  const top1 = sorted[0];
  const top2 = sorted[1];
  return top1.progress > RC.PHOTO_FINISH_PROGRESS && top1.progress - top2.progress <= RC.PHOTO_FINISH_GAP;
}

// --- Hook ---

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
  const smoothedSpeeds = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);
  const prevLeaderRef = useRef<string | null>(null);
  const leadChangesRef = useRef(0);

  const initRaceState = useCallback((currentHorses: Horse[]) => {
    finishOrderRef.current = [];
    prevLeaderRef.current = null;
    leadChangesRef.current = 0;
    setFinishOrder([]);
    setRaceState('countdown');
    setCountdown(3);
    setIsPhotoFinish(false);
    setLeader(null);
    setLeadChanges(0);

    baseSpeeds.current = currentHorses.map(() => RC.BASE_SPEED + Math.random() * RC.SPEED_VARIATION);
    smoothedSpeeds.current = currentHorses.map(() => RC.BASE_SPEED);
  }, []);

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
    setHorses(newHorses);
    initRaceState(newHorses);
  }, [initRaceState]);

  const raceLoop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
      rafRef.current = requestAnimationFrame(raceLoop);
      return;
    }

    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    const cappedDelta = Math.min(delta, RC.DELTA_CAP);

    const currentHorses = horsesRef.current;
    const finished = finishOrderRef.current;
    let allFinished = true;

    const maxProgress = Math.max(...currentHorses.map((h) => h.progress));
    const minProgress = Math.min(
      ...currentHorses.filter((h) => h.progress < 100).map((h) => h.progress),
    );
    const spread = maxProgress - minProgress;

    const updated = currentHorses.map((horse, i) => {
      if (horse.progress >= 100) return horse;
      allFinished = false;

      const newHorse = updateHorseProgress(
        horse, i, spread, minProgress, maxProgress, cappedDelta,
        baseSpeeds.current, smoothedSpeeds.current,
      );

      // Check if just finished
      if (newHorse.progress >= 100 && horse.progress < 100) {
        const rank = finished.length + 1;
        finishOrderRef.current = [
          ...finished,
          { name: horse.name, color: horse.color, rank },
        ];
      }

      return newHorse;
    });

    updateRanks(updated, finishOrderRef.current);

    const { leader: currentLeader, changed } = detectLeaderChange(updated, prevLeaderRef.current);
    if (changed) {
      leadChangesRef.current++;
      setLeadChanges(leadChangesRef.current);
    }
    prevLeaderRef.current = currentLeader.name;
    setLeader(currentLeader);

    setIsPhotoFinish(detectPhotoFinish(updated));

    horsesRef.current = updated;
    setHorses([...updated]);
    setFinishOrder([...finishOrderRef.current]);

    if (allFinished) {
      setRaceState('finished');
    } else {
      rafRef.current = requestAnimationFrame(raceLoop);
    }
  }, []);

  const startRace = useCallback(() => {
    // Reset horses to start positions
    horsesRef.current = horsesRef.current.map((h, i) => ({
      ...h,
      progress: 0,
      currentRank: i + 1,
      speed: 0,
    }));
    setHorses(horsesRef.current);
    initRaceState(horsesRef.current);

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
    }, RC.COUNTDOWN_INTERVAL);
  }, [initRaceState, raceLoop]);

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
