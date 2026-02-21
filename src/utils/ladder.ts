import type { LadderBar, LadderData } from '@/types/ladder';

export const LADDER_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96E6A1',
  '#FFBE0B',
  '#FF006E',
  '#FB5607',
  '#8338EC',
  '#2EC4B6',
  '#E71D36',
];

export const LADDER_ROWS = 8;

export function generateLadder(n: number): LadderData {
  const rowCount = LADDER_ROWS;
  const bars: LadderBar[] = [];

  for (let row = 0; row < rowCount; row++) {
    const used = new Set<number>();
    for (let col = 0; col < n - 1; col++) {
      if (!used.has(col) && !used.has(col + 1) && Math.random() < 0.42) {
        bars.push({ row, col });
        used.add(col);
        used.add(col + 1);
      }
    }
  }

  const resultMap = calculateResultMap(n, bars, rowCount);
  return { n, rowCount, bars, resultMap };
}

function calculateResultMap(
  n: number,
  bars: LadderBar[],
  rowCount: number,
): number[] {
  return Array.from({ length: n }, (_, startCol) => {
    let col = startCol;
    for (let row = 0; row < rowCount; row++) {
      const rightBar = bars.find((b) => b.row === row && b.col === col);
      const leftBar = bars.find((b) => b.row === row && b.col === col - 1);
      if (rightBar) col++;
      else if (leftBar) col--;
    }
    return col;
  });
}

export type PathPoint = { x: number; y: number };

export function getPathPoints(
  startCol: number,
  bars: LadderBar[],
  rowCount: number,
  cellWidth: number,
  rowHeight: number,
  paddingX: number,
  paddingTop: number,
): PathPoint[] {
  const colX = (c: number) => paddingX + c * cellWidth;
  const barY = (r: number) => paddingTop + r * rowHeight + rowHeight / 2;

  let col = startCol;
  const points: PathPoint[] = [{ x: colX(col), y: paddingTop }];

  for (let row = 0; row < rowCount; row++) {
    const yEnd = paddingTop + (row + 1) * rowHeight;
    const rightBar = bars.find((b) => b.row === row && b.col === col);
    const leftBar = bars.find((b) => b.row === row && b.col === col - 1);

    if (rightBar) {
      points.push({ x: colX(col), y: barY(row) });
      points.push({ x: colX(col + 1), y: barY(row) });
      col++;
      points.push({ x: colX(col), y: yEnd });
    } else if (leftBar) {
      points.push({ x: colX(col), y: barY(row) });
      points.push({ x: colX(col - 1), y: barY(row) });
      col--;
      points.push({ x: colX(col), y: yEnd });
    } else {
      points.push({ x: colX(col), y: yEnd });
    }
  }

  return points;
}

export function parseNames(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export type LadderValidationError = 'min' | 'max' | 'mismatch';

export function validateLadderInput(
  participants: string[],
  results: string[],
): { valid: boolean; error?: LadderValidationError } {
  if (participants.length < 2 || results.length < 2) {
    return { valid: false, error: 'min' };
  }
  if (participants.length > 10 || results.length > 10) {
    return { valid: false, error: 'max' };
  }
  if (participants.length !== results.length) {
    return { valid: false, error: 'mismatch' };
  }
  return { valid: true };
}
