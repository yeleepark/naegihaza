'use client';

import { useState, useCallback, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/bomb/GameSetup';
import GamePlay from '@/components/bomb/GamePlay';
import GameResult from '@/components/bomb/GameResult';
import { useGameURL } from '@/hooks/useGameURL';
import { useBombGame } from '@/hooks/useBombGame';
import { GameState, BombResult } from '@/types/bomb';

export default function BombGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [names, setNames] = useState<string[]>([]);
  const [result, setResult] = useState<BombResult | null>(null);

  const {
    participants,
    currentHolder,
    isRunning,
    exploded,
    preExplosion,
    remainingRatio,
    direction,
    handleSetup,
    handleStart,
    handlePlayAgain: hookPlayAgain,
    handleReset: hookReset,
    restoreFromURL,
  } = useBombGame({
    onComplete: (r) => {
      setResult(r);
      setGameState('result');
    },
  });

  const { initialized, sync, clear } = useGameURL(({ gameState: s, participants: p, params }) => {
    setNames(p);
    if (s === 'result') {
      const w = params.get('w');
      const wc = params.get('wc');
      if (w && wc) {
        const restoredResult: BombResult = {
          winnerName: w,
          winnerColor: wc,
          totalParticipants: p.length,
          timestamp: new Date(),
        };
        setResult(restoredResult);
        restoreFromURL(p, restoredResult);
        setGameState('result');
      } else {
        handleSetup(p);
        setGameState('playing');
      }
    } else {
      handleSetup(p);
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
    sync(gameState, names, extra);
  }, [initialized, gameState, names, result, sync]);

  const handleGameStart = useCallback((inputNames: string[]) => {
    setNames(inputNames);
    setResult(null);
    handleSetup(inputNames);
    setGameState('playing');
  }, [handleSetup]);

  const handlePlayAgain = useCallback(() => {
    setResult(null);
    hookPlayAgain();
    setGameState('playing');
  }, [hookPlayAgain]);

  const handleReset = useCallback(() => {
    clear();
    hookReset();
    setNames([]);
    setResult(null);
    setGameState('setup');
  }, [clear, hookReset]);

  return (
    <GameClientLayout
      gameState={gameState}
      setup={<GameSetup onStart={handleGameStart} />}
      gameplay={
        <div className="flex flex-col py-2 md:py-4">
          <GamePlay
            participants={participants}
            currentHolder={currentHolder}
            isRunning={isRunning}
            exploded={exploded}
            preExplosion={preExplosion}
            remainingRatio={remainingRatio}
            direction={direction}
            onStart={handleStart}
          />
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
