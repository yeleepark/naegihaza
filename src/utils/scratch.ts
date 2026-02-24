import { ScratchCard } from '@/types/scratch';

export function generateScratchCards(participants: string[], winnerCount: number): ScratchCard[] {
  const count = participants.length;
  const isWinnerFlags = Array(count).fill(false);
  for (let i = 0; i < winnerCount; i++) {
    isWinnerFlags[i] = true;
  }
  // Fisher-Yates shuffle
  for (let i = isWinnerFlags.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [isWinnerFlags[i], isWinnerFlags[j]] = [isWinnerFlags[j], isWinnerFlags[i]];
  }

  return participants.map((name, idx) => ({
    id: idx,
    participantName: name,
    isWinner: isWinnerFlags[idx],
    isScratched: false,
  }));
}

export function parseParticipantNames(input: string): string[] {
  return input
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function validateScratchSetup(
  participants: string[],
  winnerCount: number
): { valid: boolean; error?: string } {
  if (participants.length < 2) return { valid: false, error: 'common.error.min' };
  if (participants.length > 100) return { valid: false, error: 'common.error.max' };
  const unique = new Set(participants);
  if (unique.size !== participants.length) return { valid: false, error: 'common.error.duplicate' };
  if (winnerCount < 1) return { valid: false, error: 'scratch.error.winnerMin' };
  if (winnerCount >= participants.length)
    return { valid: false, error: 'scratch.error.winnerMax' };
  return { valid: true };
}
