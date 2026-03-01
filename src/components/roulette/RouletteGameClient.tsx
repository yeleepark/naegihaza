'use client';

import { useState, useCallback, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/roulette/GameSetup';
import GameSpinning from '@/components/roulette/GameSpinning';
import GameResult from '@/components/roulette/GameResult';
import { useGameURL } from '@/hooks/useGameURL';
import { useRouletteGame } from '@/hooks/useRouletteGame';
import { GameState } from '@/types/roulette';

export default function RouletteGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');

  const {
    participants,
    segments,
    spinConfig,
    isSpinning,
    result,
    handleStart: hookStart,
    handleShuffle,
    handleSpin,
    handleSpinComplete: hookSpinComplete,
    handlePlayAgain: hookPlayAgain,
    resetGame,
    restoreFromURL,
  } = useRouletteGame();

  const { initialized, sync, clear } = useGameURL(({ gameState: s, participants: p, params }) => {
    if (s === 'result') {
      const w = params.get('w');
      const wc = params.get('wc');
      const wn = params.get('wn');
      if (w && wc && wn) {
        restoreFromURL(p, {
          winnerId: 0,
          winnerName: w,
          winnerColor: wc,
          winnerNumber: parseInt(wn, 10),
          totalParticipants: p.length,
          timestamp: new Date(),
        });
        setGameState('result');
      } else {
        restoreFromURL(p);
        setGameState('spinning');
      }
    } else {
      restoreFromURL(p);
      setGameState('spinning');
    }
  });

  useEffect(() => {
    if (!initialized) return;
    const names = participants.map((p) => p.name);
    const extra: Record<string, string> = {};
    if (result && gameState === 'result') {
      extra.w = result.winnerName;
      extra.wc = result.winnerColor;
      extra.wn = String(result.winnerNumber);
    }
    sync(gameState, names, extra);
  }, [initialized, gameState, participants, result, sync]);

  const handleStart = useCallback((names: string[]) => {
    hookStart(names);
    setGameState('spinning');
  }, [hookStart]);

  const handleSpinComplete = useCallback(() => {
    hookSpinComplete();
    setGameState('result');
  }, [hookSpinComplete]);

  const handlePlayAgain = useCallback(() => {
    hookPlayAgain();
    setGameState('spinning');
  }, [hookPlayAgain]);

  const handleReset = useCallback(() => {
    clear();
    resetGame();
    setGameState('setup');
  }, [clear, resetGame]);

  return (
    <GameClientLayout
      gameState={gameState}
      setup={<GameSetup onStart={handleStart} />}
      gameplay={
        <GameSpinning
          segments={segments}
          participants={participants}
          spinConfig={spinConfig}
          isSpinning={isSpinning}
          onSpin={handleSpin}
          onShuffle={handleShuffle}
          onSpinComplete={handleSpinComplete}
        />
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
