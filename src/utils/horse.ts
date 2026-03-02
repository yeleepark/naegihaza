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
  BASE_SPEED: 0.22,
  SPEED_VARIATION: 0.04,
  MIN_SPEED: 0.13,
  SMOOTHING: 0.08,
  PROGRESS_MULTIPLIER: 0.06,
  RANDOM_VARIATION: 0.14,
  // Rubber-banding
  RUBBER_BAND_THRESHOLD: 3,
  RUBBER_BAND_INTENSITY: 0.08,
  // Phase thresholds
  PHASE_START: 3,
  PHASE_EARLY: 40,
  PHASE_MID: 55,
  PHASE_SECOND_WIND: 75,
  PHASE_FINAL_APPROACH: 90,
  // Events
  EVENT_BIG_BURST: { chance: 0.008, value: 0.3 },
  EVENT_SMALL_BURST: { chance: 0.025, value: 0.15 },
  EVENT_STUMBLE: { chance: 0.035, value: -0.05 },
  EVENT_SPRINT: { chance: 0.015, value: 0.35 },
  EVENT_FATIGUE: { chance: 0.03, value: -0.04 },
  // Photo finish
  PHOTO_FINISH_PROGRESS: 75,
  PHOTO_FINISH_GAP: 8,
  // Timing
  COUNTDOWN_INTERVAL: 800,
  DELTA_CAP: 50,
  RESULT_DELAY: 1500,
} as const;
