'use client';

import { useState, useCallback, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/slot/GameSetup';
import GamePlay from '@/components/slot/GamePlay';
import GameResult from '@/components/slot/GameResult';
import { useGameURL } from '@/hooks/useGameURL';
import { GameState, SlotResult, SlotMode } from '@/types/slot';

export default function SlotGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<string[]>([]);
  const [result, setResult] = useState<SlotResult | null>(null);
  const [mode, setMode] = useState<SlotMode>('penalty');

  const { initialized, sync, clear } = useGameURL(({ gameState: s, participants: p, params }) => {
    const m = (params.get('m') as SlotMode) || 'penalty';
    setParticipants(p);
    setMode(m);
    if (s === 'result') {
      const w = params.get('w');
      const wc = params.get('wc');
      if (w && wc) {
        setResult({ winnerName: w, winnerColor: wc, totalParticipants: p.length, timestamp: new Date(), mode: m });
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
    const extra: Record<string, string> = { m: mode };
    if (result) {
      extra.w = result.winnerName;
      extra.wc = result.winnerColor;
    }
    sync(gameState, participants, extra);
  }, [initialized, gameState, participants, mode, result, sync]);

  const handleStart = useCallback((names: string[], selectedMode: SlotMode) => {
    setParticipants(names);
    setMode(selectedMode);
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
        <GamePlay participants={participants} mode={mode} onComplete={handleComplete} />
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
