export type GameState = 'setup' | 'playing' | 'result';

export interface BombParticipant {
  id: number;
  name: string;
  color: string;
}

export interface BombResult {
  winnerName: string;
  winnerColor: string;
  totalParticipants: number;
  timestamp: Date;
}
