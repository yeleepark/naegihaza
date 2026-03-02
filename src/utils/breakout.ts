const BASE_PALETTE = [
  '#fb923c', // orange-400
  '#f472b6', // pink-400
  '#a78bfa', // violet-400
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#fb7185', // rose-400
  '#38bdf8', // sky-400
];

export const BLOCK_COLORS = Array.from(
  { length: 100 },
  (_, i) => BASE_PALETTE[i % BASE_PALETTE.length],
);

export function parseNames(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

export function validateParticipantNames(
  names: string[],
  max: number = 100,
): {
  valid: boolean;
  error?: string;
} {
  if (names.length < 2) {
    return { valid: false, error: 'common.error.min' };
  }

  if (names.length > max) {
    return { valid: false, error: 'breakout.error.max' };
  }

  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (uniqueNames.size !== names.length) {
    return { valid: false, error: 'common.error.duplicate' };
  }

  return { valid: true };
}
