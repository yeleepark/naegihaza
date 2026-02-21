export type LadderBar = {
  row: number;
  col: number; // left column index (connects col and col+1)
};

export type LadderData = {
  n: number;
  rowCount: number;
  bars: LadderBar[];
  resultMap: number[]; // resultMap[startCol] = endCol
};

export type GameState = 'setup' | 'game' | 'result';
