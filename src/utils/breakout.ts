export const BLOCK_COLORS = [
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
  if (names.length < 2) {
    return { valid: false, error: 'common.error.min' };
  }

  if (names.length > 40) {
    return { valid: false, error: 'breakout.error.max' };
  }

  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (uniqueNames.size !== names.length) {
    return { valid: false, error: 'common.error.duplicate' };
  }

  return { valid: true };
}
