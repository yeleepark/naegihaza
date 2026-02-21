export type GameState = 'setup' | 'spinning' | 'result';

export interface Participant {
  id: number;
  name: string;
  displayNumber: number; // 1-indexed for fallback
}

export interface WheelSegment {
  id: number;
  color: string;
  startAngle: number;
  endAngle: number;
}

export interface SpinConfig {
  duration: number; // 4000-6000ms
  rotations: number; // 5-8 rotations
  winnerIndex: number;
  easeFunction: (t: number) => number;
}

export interface RouletteResult {
  winnerId: number;
  winnerName: string;
  winnerNumber: number;
  totalParticipants: number;
  timestamp: Date;
}
