export const MIN_PARTICIPANTS = 2;
export const MAX_PARTICIPANTS = 10;

export const HORSE_COLORS = [
  '#fb923c', // orange-400
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#f472b6', // pink-400
  '#a78bfa', // violet-400
  '#fbbf24', // amber-400
  '#fb7185', // rose-400
  '#38bdf8', // sky-400
  '#4ade80', // green-400
  '#e879f9', // fuchsia-400
];

export function parseNames(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

export function validateParticipantNames(names: string[]): {
  valid: boolean;
  error?: string;
} {
  if (names.length < MIN_PARTICIPANTS) {
    return { valid: false, error: 'min' };
  }

  if (names.length > MAX_PARTICIPANTS) {
    return { valid: false, error: 'max' };
  }

  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (uniqueNames.size !== names.length) {
    return { valid: false, error: 'duplicate' };
  }

  return { valid: true };
}

export function getHorseColor(index: number): string {
  return HORSE_COLORS[index % HORSE_COLORS.length];
}

export const RACE_CONFIG = {
  // Speed
  BASE_SPEED: 0.20,
  SPEED_VARIATION: 0.12,
  MIN_SPEED: 0.10,
  SMOOTHING: 0.10,
  PROGRESS_MULTIPLIER: 0.035,
  RANDOM_VARIATION: 0.24,
  // Rubber-banding (progressive — intensifies with race progress)
  RUBBER_BAND_THRESHOLD: 5,
  RUBBER_BAND_INTENSITY: 0.08,
  RUBBER_BAND_PROGRESS_SCALE: 2.5, // max multiplier at 100% progress
  // Leader drag — slight penalty for being in 1st
  LEADER_DRAG: 0.022,
  LEADER_DRAG_PROGRESS_MIN: 10, // only applies after this % progress
  // Phase thresholds
  PHASE_START: 3,
  PHASE_EARLY: 35,
  PHASE_MID: 55,
  PHASE_SECOND_WIND: 70,
  PHASE_TENSION: 75,
  PHASE_FINAL_APPROACH: 90,
  // Events — more frequent and impactful
  EVENT_BIG_BURST: { chance: 0.02, value: 0.4 },
  EVENT_SMALL_BURST: { chance: 0.04, value: 0.2 },
  EVENT_STUMBLE: { chance: 0.04, value: -0.08 },
  EVENT_SPRINT: { chance: 0.025, value: 0.5 },
  EVENT_FATIGUE: { chance: 0.045, value: -0.07 },
  // Mid-race drama events (40-65% progress)
  EVENT_MID_SURGE: { chance: 0.025, value: 0.35 },
  EVENT_MID_STUMBLE: { chance: 0.025, value: -0.10 },
  // Tension zone events (75-90% progress)
  EVENT_DRAMATIC_SURGE: { chance: 0.05, value: 0.65 },
  EVENT_LEADER_STUMBLE: { chance: 0.06, value: -0.16 },
  // Photo finish
  PHOTO_FINISH_PROGRESS: 70,
  PHOTO_FINISH_GAP: 15,
  // Timing
  COUNTDOWN_INTERVAL: 800,
  DELTA_CAP: 50,
  RESULT_DELAY: 1500,
} as const;
