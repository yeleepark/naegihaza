export const BLOCK_COLORS = Array.from({ length: 100 }, (_, i) => {
  const h = Math.round((i * 137.508) % 360);
  return `hsl(${h}, 75%, 65%)`;
});

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
