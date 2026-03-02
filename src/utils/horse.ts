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
