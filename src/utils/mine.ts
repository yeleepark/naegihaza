import { MineParticipant, MineCell } from '@/types/mine';

export const MIN_PARTICIPANTS = 2;
export const MAX_PARTICIPANTS = 10;
export const GRID_COLS = 5;
export const GRID_ROWS = 5;
export const GRID_SIZE = GRID_COLS * GRID_ROWS;
export const MINE_COUNT = 1;

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
    return { valid: false, error: 'mine.error.max' };
  }

  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (uniqueNames.size !== names.length) {
    return { valid: false, error: 'common.error.duplicate' };
  }

  return { valid: true };
}

export function generateParticipants(names: string[]): MineParticipant[] {
  return names.map((name, i) => ({
    id: i,
    name,
    color: PARTICIPANT_COLORS[i % PARTICIPANT_COLORS.length],
  }));
}

export function generateGrid(): MineCell[] {
  const cells: MineCell[] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    cells.push({
      id: i,
      row: Math.floor(i / GRID_COLS),
      col: i % GRID_COLS,
      hasMine: false,
      revealed: false,
    });
  }

  // Place exactly 1 mine at a random position
  const mineIndex = Math.floor(Math.random() * GRID_SIZE);
  cells[mineIndex].hasMine = true;

  return cells;
}
