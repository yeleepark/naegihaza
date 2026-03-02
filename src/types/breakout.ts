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

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  rotation: number;
  rotSpeed: number;
}

export interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export interface EngineState {
  blocks: Block[];
  ball: { x: number; y: number; dx: number; dy: number; r: number };
  W: number;
  H: number;
  running: boolean;
  raf: number;
  speedMul: number;
  particles: Particle[];
  trail: TrailPoint[];
  frameCount: number;
  stars: { x: number; y: number; size: number; brightness: number }[];
}
