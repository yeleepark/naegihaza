import { Participant, DiceRollConfig, DiceResult } from '@/types/dice';

// Super Hello color palette for participant colors (reused from roulette)
export const SEGMENT_COLORS = [
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
 * Validates participant names
 */
export function validateParticipantNames(names: string[]): {
  valid: boolean;
  error?: string;
} {
  if (names.length < 2) {
    return {
      valid: false,
      error: '최소 2명 이상 입력해주세요',
    };
  }

  if (names.length > 100) {
    return {
      valid: false,
      error: '최대 100명까지 가능합니다',
    };
  }

  // Check for duplicates
  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (uniqueNames.size !== names.length) {
    return {
      valid: false,
      error: '중복된 이름이 있습니다',
    };
  }

  return { valid: true };
}

/**
 * Rolls a dice and returns a random value between 1-6
 */
export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Ease-out-quad function for smooth deceleration (faster than cubic for dice)
 */
export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

/**
 * Generates dice roll configuration with randomized duration for two dice
 */
export function calculateDiceConfig(targetValue1: number, targetValue2: number): DiceRollConfig {
  // Random duration between 800-1200ms
  const duration = 800 + Math.random() * 400;

  return {
    participantId: -1, // Will be set by caller
    targetValue1,
    targetValue2,
    duration,
    easeFunction: easeOutQuad,
  };
}

/**
 * Determines the winner(s) from all participants who have rolled
 */
export function determineWinners(participants: Participant[]): DiceResult {
  const rolledParticipants = participants.filter((p) => p.totalValue !== undefined);

  if (rolledParticipants.length === 0) {
    throw new Error('No participants have rolled dice yet');
  }

  const maxValue = Math.max(...rolledParticipants.map((p) => p.totalValue!));
  const winners = rolledParticipants.filter((p) => p.totalValue === maxValue);

  return {
    winners,
    winningValue: maxValue,
    allRolls: [...rolledParticipants],
    timestamp: new Date(),
  };
}

/**
 * Returns pip positions for a given dice value (1-6)
 * Positions are relative to a 100x100 unit square
 */
export function getPipPositions(value: number): { x: number; y: number }[] {
  const center = 50;
  const edge = 25;
  const nearEdge = 35;

  switch (value) {
    case 1:
      return [{ x: center, y: center }];
    case 2:
      return [
        { x: edge, y: edge },
        { x: 100 - edge, y: 100 - edge },
      ];
    case 3:
      return [
        { x: edge, y: edge },
        { x: center, y: center },
        { x: 100 - edge, y: 100 - edge },
      ];
    case 4:
      return [
        { x: edge, y: edge },
        { x: 100 - edge, y: edge },
        { x: edge, y: 100 - edge },
        { x: 100 - edge, y: 100 - edge },
      ];
    case 5:
      return [
        { x: edge, y: edge },
        { x: 100 - edge, y: edge },
        { x: center, y: center },
        { x: edge, y: 100 - edge },
        { x: 100 - edge, y: 100 - edge },
      ];
    case 6:
      return [
        { x: edge, y: edge },
        { x: 100 - edge, y: edge },
        { x: edge, y: center },
        { x: 100 - edge, y: center },
        { x: edge, y: 100 - edge },
        { x: 100 - edge, y: 100 - edge },
      ];
    default:
      return [];
  }
}
