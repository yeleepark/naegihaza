export type GameState = 'setup' | 'racing' | 'result';
export type RaceState = 'countdown' | 'racing' | 'finished';

export interface Horse {
  name: string;
  color: string;
  progress: number; // 0~100
  currentRank: number; // real-time rank
  speed: number; // current speed (for visual effects)
}

export interface RankingEntry {
  name: string;
  color: string;
  rank: number;
}

export interface HorseResult {
  rankings: RankingEntry[];
  participants: string[];
  timestamp: Date;
}
