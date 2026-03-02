import { BombParticipant } from '@/types/bomb';

export const MIN_PARTICIPANTS = 2;
export const MAX_PARTICIPANTS = 20;
export const TIMER_MIN = 5000;
export const TIMER_MAX = 15000;
export const INITIAL_INTERVAL = 1000;
export const FINAL_INTERVAL = 50;

const PARTICIPANT_COLORS = [
  '#fb923c', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa',
  '#34d399', '#fde047', '#fb7185', '#4ade80', '#38bdf8',
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
    return { valid: false, error: 'common.error.min' };
  }

  if (names.length > MAX_PARTICIPANTS) {
    return { valid: false, error: 'bomb.error.max' };
  }

  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (uniqueNames.size !== names.length) {
    return { valid: false, error: 'common.error.duplicate' };
  }

  return { valid: true };
}

export function generateParticipants(names: string[]): BombParticipant[] {
  return names.map((name, i) => ({
    id: i,
    name,
    color: PARTICIPANT_COLORS[i % PARTICIPANT_COLORS.length],
  }));
}

export function generateTimerDuration(): number {
  return TIMER_MIN + Math.random() * (TIMER_MAX - TIMER_MIN);
}

export function selectStartingIndex(total: number): number {
  return Math.floor(Math.random() * total);
}
