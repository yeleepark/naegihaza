export type GameState = 'setup' | 'playing' | 'result';

export interface BreakoutResult {
  winnerName: string;
  winnerColor: string;
  participants: string[];
  timestamp: Date;
}
