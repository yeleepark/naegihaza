'use client';

import { useState, useCallback, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/slot/GameSetup';
import GamePlay from '@/components/slot/GamePlay';
import GameResult from '@/components/slot/GameResult';
import { useGameURL } from '@/hooks/useGameURL';
import { GameState, SlotResult } from '@/types/slot';

export default function SlotGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<string[]>([]);
  const [result, setResult] = useState<SlotResult | null>(null);

  const { initialized, sync, clear } = useGameURL(({ gameState: s, participants: p, params }) => {
    setParticipants(p);
    if (s === 'result') {
      const w = params.get('w');
      const wc = params.get('wc');
      if (w && wc) {
        setResult({ winnerName: w, winnerColor: wc, totalParticipants: p.length, timestamp: new Date() });
        setGameState('result');
      } else {
        setGameState('spinning');
      }
    } else {
      setGameState('spinning');
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
