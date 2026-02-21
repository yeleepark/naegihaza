export type GameState = 'setup' | 'rolling' | 'result';

export interface Participant {
  id: number;
  name: string;
  diceValue1?: number; // 1-6, undefined until rolled
  diceValue2?: number; // 1-6, undefined until rolled
  totalValue?: number; // Sum of both dice
}

export interface DiceRollConfig {
  participantId: number;
  targetValue1: number; // 1-6
  targetValue2: number; // 1-6
  duration: number; // 800-1200ms
  easeFunction: (t: number) => number;
}

export interface DiceResult {
  winners: Participant[]; // Array to handle ties
  winningValue: number;
  allRolls: Participant[];
  timestamp: Date;
}
