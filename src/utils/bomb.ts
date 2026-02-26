import { Card } from '@/types/bomb';

export const PARTICIPANT_COLORS = [
  '#fb923c', // orange-400
  '#fbbf24', // amber-400
  '#f472b6', // pink-400
  '#a78bfa', // violet-400
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#fde047', // yellow-300
  '#fb7185', // rose-400
  '#4ade80', // green-400
  '#38bdf8', // sky-400
];

/**
 * Parses comma or newline separated names
 */
export function parseNames(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

/**
 * Validates participant names (2–10 people)
 */
export function validateParticipantNames(names: string[]): {
  valid: boolean;
  error?: string;
} {
  if (names.length < 2) {
    return { valid: false, error: 'common.error.min' };
  }

  if (names.length > 10) {
    return { valid: false, error: 'common.error.max' };
  }

  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (uniqueNames.size !== names.length) {
    return { valid: false, error: 'common.error.duplicate' };
  }

  return { valid: true };
}

/**
 * Generates `count` cards with one bomb, then shuffles the visual order (Fisher-Yates).
 * Typically count = participants.length * 2 so each participant flips exactly 2 cards.
 */
export function generateCards(count: number): Card[] {
  const bombIndex = Math.floor(Math.random() * count);

  const cards: Card[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    isBomb: i === bombIndex,
    isFlipped: false,
  }));

  // Shuffle so the bomb's grid position is independent of its id
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
