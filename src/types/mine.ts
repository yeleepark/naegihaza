export type GameState = 'setup' | 'playing' | 'result';

export interface MineCell {
  id: number;
  row: number;
  col: number;
  hasMine: boolean;
  revealed: boolean;
  revealedBy?: number;
}

export interface MineParticipant {
  id: number;
  name: string;
  color: string;
}

export interface MineResult {
  loserName: string;
  loserColor: string;
  totalParticipants: number;
  timestamp: Date;
}
