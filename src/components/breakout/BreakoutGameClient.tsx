'use client';

import { useState, useCallback, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/breakout/GameSetup';
import GamePlay from '@/components/breakout/GamePlay';
import GameResult from '@/components/breakout/GameResult';
import { useGameURL } from '@/hooks/useGameURL';
import { GameState, BreakoutResult } from '@/types/breakout';

export default function BreakoutGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<string[]>([]);
  const [result, setResult] = useState<BreakoutResult | null>(null);

  const { initialized, sync, clear } = useGameURL(({ gameState: s, participants: p, params }) => {
    setParticipants(p);
    if (s === 'result') {
      const w = params.get('w');
      const wc = params.get('wc');
      if (w && wc) {
        setResult({ winnerName: w, winnerColor: wc, participants: p, timestamp: new Date() });
        setGameState('result');
      } else {
        setGameState('playing');
      }
    } else {
      setGameState('playing');
    }
  });

  useEffect(() => {
    if (!initialized) return;
    const extra: Record<string, string> = {};
    if (result) {
      extra.w = result.winnerName;
      extra.wc = result.winnerColor;
    }
    sync(gameState, participants, extra);
  }, [initialized, gameState, participants, result, sync]);

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
    clear();
    setGameState('setup');
    setParticipants([]);
    setResult(null);
  }, [clear]);

  return (
    <GameClientLayout
      gameState={gameState}
      setup={<GameSetup onStart={handleStart} />}
      gameplay={
        <div className="flex flex-col py-2 md:py-4">
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
