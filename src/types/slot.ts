export type GameState = 'setup' | 'spinning' | 'result';

export type SlotMode = 'penalty' | 'winner';

export interface SlotResult {
  winnerName: string;
  winnerColor: string;
  totalParticipants: number;
  timestamp: Date;
  mode: SlotMode;
}
