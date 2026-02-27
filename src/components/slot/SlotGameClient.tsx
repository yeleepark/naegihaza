'use client';

import { useState, useCallback } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/slot/GameSetup';
import GamePlay from '@/components/slot/GamePlay';
import GameResult from '@/components/slot/GameResult';
import { GameState, SlotResult } from '@/types/slot';

export default function SlotGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<string[]>([]);
  const [result, setResult] = useState<SlotResult | null>(null);

  const handleStart = useCallback((names: string[]) => {
    setParticipants(names);
    setResult(null);
    setGameState('spinning');
  }, []);

  const handleComplete = useCallback((slotResult: SlotResult) => {
    setResult(slotResult);
    setGameState('result');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setResult(null);
    setGameState('spinning');
  }, []);

  const handleReset = useCallback(() => {
    setGameState('setup');
    setParticipants([]);
    setResult(null);
  }, []);

  return (
    <GameClientLayout
      gameState={gameState}
      setup={<GameSetup onStart={handleStart} />}
      gameplay={
        <GamePlay participants={participants} onComplete={handleComplete} />
      }
      result={
        result ? (
          <GameResult
            result={result}
            onPlayAgain={handlePlayAgain}
            onReset={handleReset}
          />
        ) : null
      }
    />
  );
}
