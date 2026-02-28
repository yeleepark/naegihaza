export type GameState = 'setup' | 'playing' | 'result';

export type BreakoutMode = 'penalty' | 'winner';

export interface BreakoutResult {
  winnerName: string;
  winnerColor: string;
  participants: string[];
  timestamp: Date;
  mode: BreakoutMode;
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
