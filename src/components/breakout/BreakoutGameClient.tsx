'use client';

import { useState, useCallback } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/breakout/GameSetup';
import GamePlay from '@/components/breakout/GamePlay';
import GameResult from '@/components/breakout/GameResult';
import { GameState, BreakoutResult } from '@/types/breakout';

export default function BreakoutGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<string[]>([]);
  const [result, setResult] = useState<BreakoutResult | null>(null);
  
  const handleStart = useCallback((names: string[]) => {
    setParticipants(names);
    setResult(null);
    setGameState('playing');
  }, []);

  const handleResult = useCallback(
    (winnerName: string, winnerColor: string) => {
      setResult({
        winnerName,
        winnerColor,
        participants,
        timestamp: new Date(),
      });
      setGameState('result');
    },
    [participants]
  );

  const handlePlayAgain = useCallback(() => {
    setResult(null);
    setGameState('playing');
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
        <div className="h-full min-h-0 flex flex-col py-2 md:py-4">
          <GamePlay participants={participants} onResult={handleResult} />
        </div>
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
