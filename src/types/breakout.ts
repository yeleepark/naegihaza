export type GameState = 'setup' | 'playing' | 'result';

export interface BreakoutResult {
  winnerName: string;
  winnerColor: string;
  participants: string[];
  timestamp: Date;
}

export interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  color: string;
  alive: boolean;
}

export interface EngineState {
  blocks: Block[];
  ball: { x: number; y: number; dx: number; dy: number; r: number };
  W: number;
  H: number;
  running: boolean;
  raf: number;
  speedMul: number;
}
