export type ScratchCard = {
  id: number;
  participantName: string;
  isWinner: boolean;
  isScratched: boolean;
};

export type ScratchGameState = 'setup' | 'playing' | 'result';

export type ScratchResult = {
  winners: string[];
  losers: string[];
  timestamp: Date;
};
