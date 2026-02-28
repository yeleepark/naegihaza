// Animation constants
export const CELL_HEIGHT = 64;
export const SPIN_DURATION = 5000;
export const REPEATS = 20;
export const RESULT_DELAY = 800;

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
 * Validates participant names (2-100 people)
 */
export function validateParticipantNames(names: string[]): {
  valid: boolean;
  error?: string;
} {
  if (names.length < 2) {
    return { valid: false, error: 'common.error.min' };
  }

  if (names.length > 100) {
    return { valid: false, error: 'common.error.max' };
  }

  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (uniqueNames.size !== names.length) {
    return { valid: false, error: 'common.error.duplicate' };
  }

  return { valid: true };
}

/**
 * Selects a random winner from the list of names
 */
export function selectWinner(names: string[]): string {
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * Generates a reel strip: names repeated `repeats` times, with winner placed at the end.
 */
export function generateReelStrip(
  names: string[],
  winner: string,
  repeats: number = 8
): string[] {
  const strip: string[] = [];

  for (let i = 0; i < repeats; i++) {
    // Shuffle names for each repeat to add visual variety
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    strip.push(...shuffled);
  }

  // Place winner at the end
  strip.push(winner);

  return strip;
}
