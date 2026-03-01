import {
  Participant,
  WheelSegment,
  SpinConfig,
  RouletteResult,
} from '@/types/roulette';

// Super Hello color palette for wheel segments
const SEGMENT_COLORS = [
  '#fb923c', // orange-400
  '#fbbf24', // amber-400
  '#f472b6', // pink-400
  '#a78bfa', // violet-400
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#fde047', // yellow-300
  '#fb7185', // rose-400
];

/**
 * Generates an array of participants from names
 */
export function generateParticipants(names: string[]): Participant[] {
  return names.map((name, i) => ({
    id: i,
    name: name.trim(),
    displayNumber: i + 1,
  }));
}

/**
 * Parses comma or newline separated names
 */
export function parseNames(input: string): string[] {
  // Split by comma or newline
  const names = input
    .split(/[,\n]/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  return names;
}

/**
 * Generates wheel segments with colors and angle ranges
 */
export function generateWheelSegments(count: number): WheelSegment[] {
  const anglePerSegment = (Math.PI * 2) / count;

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
    startAngle: i * anglePerSegment,
    endAngle: (i + 1) * anglePerSegment,
  }));
}

/**
 * Selects a random winner from participants
 */
export function selectWinner(count: number): number {
  return Math.floor(Math.random() * count);
}

/**
 * Ease-out-cubic function for smooth deceleration
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Calculates the target angle to stop at the winner segment
 */
export function calculateTargetAngle(
  winnerIndex: number,
  participantCount: number,
  rotations: number
): number {
  const anglePerSegment = (Math.PI * 2) / participantCount;

  // Calculate the center angle of the winner segment
  const winnerCenterAngle = winnerIndex * anglePerSegment + anglePerSegment / 2;

  // Pointer is at the top (12 o'clock = -PI/2 in canvas coordinates)
  // Canvas: 0 = 3 o'clock, PI/2 = 6 o'clock, -PI/2 = 12 o'clock
  const pointerAngle = -Math.PI / 2;
  const targetAngle = pointerAngle - winnerCenterAngle;

  // Add full rotations for dramatic effect
  const baseRotations = rotations * Math.PI * 2;

  return baseRotations + targetAngle;
}

/**
 * Generates spin configuration with randomized duration and rotations
 */
export function calculateSpinConfig(
  winnerIndex: number,
  participantCount: number
): SpinConfig {
  // Random duration between 4-6 seconds
  const duration = 4000 + Math.random() * 2000;

  // Random rotations between 5-8
  const rotations = 5 + Math.floor(Math.random() * 4);

  return {
    duration,
    rotations,
    winnerIndex,
    easeFunction: easeOutCubic,
  };
}

/**
 * Validates participant names
 */
export function validateParticipantNames(names: string[]): {
  valid: boolean;
  error?: string;
} {
  if (names.length < 2) {
    return {
      valid: false,
      error: 'min',
    };
  }

  if (names.length > 12) {
    return {
      valid: false,
      error: 'max',
    };
  }

  // Check for duplicates
  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (uniqueNames.size !== names.length) {
    return {
      valid: false,
      error: 'duplicate',
    };
  }

  return { valid: true };
}

/**
 * Creates a roulette result object
 */
export function createRouletteResult(
  winnerIndex: number,
  participants: Participant[]
): RouletteResult {
  const winner = participants[winnerIndex];
  const winnerColor = SEGMENT_COLORS[winnerIndex % SEGMENT_COLORS.length];
  return {
    winnerId: winnerIndex,
    winnerName: winner.name,
    winnerColor,
    winnerNumber: winnerIndex + 1,
    totalParticipants: participants.length,
    timestamp: new Date(),
  };
}
