export type GameState = 'setup' | 'spinning' | 'result';

export interface SlotResult {
  winnerName: string;
  winnerColor: string;
  totalParticipants: number;
  timestamp: Date;
}
