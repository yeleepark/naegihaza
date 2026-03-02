'use client';

import { useState, useCallback, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/mine/GameSetup';
import GamePlay from '@/components/mine/GamePlay';
import GameResult from '@/components/mine/GameResult';
import { useGameURL } from '@/hooks/useGameURL';
import { useMineGame } from '@/hooks/useMineGame';
import { GameState, MineResult } from '@/types/mine';

export default function MineGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [names, setNames] = useState<string[]>([]);
  const [result, setResult] = useState<MineResult | null>(null);

  const {
    participants,
    grid,
    currentPlayerIndex,
    phase,
    revealedCell,
    lastRevealWasMine,
    handleSetup,
    handleStart,
    handleCellClick,
    handlePlayAgain: hookPlayAgain,
    handleReset: hookReset,
    restoreFromURL,
  } = useMineGame({
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
        const restoredResult: MineResult = {
          loserName: w,
          loserColor: wc,
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
      extra.w = result.loserName;
      extra.wc = result.loserColor;
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
            grid={grid}
            currentPlayerIndex={currentPlayerIndex}
            phase={phase}
            revealedCell={revealedCell}
            lastRevealWasMine={lastRevealWasMine}
            onStart={handleStart}
            onCellClick={handleCellClick}
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
