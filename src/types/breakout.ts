export type GameState = 'setup' | 'playing' | 'result';

export type BreakoutMode = 'penalty' | 'winner';

export interface BreakoutResult {
  winnerName: string;
  winnerColor: string;
  participants: string[];
  timestamp: Date;
  mode: BreakoutMode;
}
