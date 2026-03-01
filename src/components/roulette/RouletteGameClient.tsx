'use client';

import { useState, useCallback, useEffect } from 'react';
import GameSetup from '@/components/roulette/GameSetup';
import GameSpinning from '@/components/roulette/GameSpinning';
import ResultOverlay from '@/components/roulette/ResultOverlay';
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
    showResult,
    handleStart: hookStart,
    handleShuffle,
    handleSpin,
    handleSpinComplete,
    handlePlayAgain,
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
        }, true);
      } else {
        restoreFromURL(p);
      }
    } else {
      restoreFromURL(p);
    }
    setGameState('spinning');
  });

  useEffect(() => {
    if (!initialized) return;
    const names = participants.map((p) => p.name);
    const extra: Record<string, string> = {};
    const urlState = showResult ? 'result' : gameState;
    if (result && showResult) {
      extra.w = result.winnerName;
      extra.wc = result.winnerColor;
      extra.wn = String(result.winnerNumber);
    }
    sync(urlState as GameState, names, extra);
  }, [initialized, gameState, showResult, participants, result, sync]);

  const handleStart = useCallback((names: string[]) => {
    hookStart(names);
    setGameState('spinning');
  }, [hookStart]);

  const handleReset = useCallback(() => {
    clear();
    resetGame();
    setGameState('setup');
  }, [clear, resetGame]);

  return (
    <div className="w-full h-full overflow-y-auto">
      {gameState === 'setup' && <GameSetup onStart={handleStart} />}
      {gameState === 'spinning' && !showResult && (
        <GameSpinning
          segments={segments}
          participants={participants}
          spinConfig={spinConfig}
          isSpinning={isSpinning}
          onSpin={handleSpin}
          onShuffle={handleShuffle}
          onSpinComplete={handleSpinComplete}
        />
      )}
      {showResult && result && (
        <ResultOverlay
          result={result}
          onPlayAgain={handlePlayAgain}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
