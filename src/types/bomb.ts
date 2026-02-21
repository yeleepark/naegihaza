export type GameState = 'setup' | 'playing' | 'result';

export interface Card {
  id: number;
  isBomb: boolean;
  isFlipped: boolean;
  safeIcon: string;
}

export interface BombResult {
  loserName: string;
  loserColor: string;
  winnerNames: string[];
  totalCards: number;
  timestamp: Date;
}
