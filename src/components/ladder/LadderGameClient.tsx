'use client';

import { useState, useCallback, useRef } from 'react';
import GameSetup from '@/components/ladder/GameSetup';
import LadderScene from '@/components/ladder/LadderScene';
import GameResult from '@/components/ladder/GameResult';
import { generateLadder } from '@/utils/ladder';
import type { LadderData, GameState } from '@/types/ladder';

export default function LadderGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<string[]>([]);
  const [resultItems, setResultItems] = useState<string[]>([]);
  const [ladder, setLadder] = useState<LadderData | null>(null);
  const [revealedPaths, setRevealedPaths] = useState<Set<number>>(new Set());
  const revealTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    revealTimers.current.forEach(clearTimeout);
    revealTimers.current = [];
  };

  const handleStart = useCallback((names: string[], results: string[]) => {
    clearTimers();
    setParticipants(names);
    setResultItems(results);
    setLadder(generateLadder(names.length));
    setRevealedPaths(new Set());
    setGameState('game');
  }, []);

  const handleReveal = useCallback((startCol: number) => {
    setRevealedPaths((prev) => new Set([...prev, startCol]));
  }, []);

  const handleRevealAll = useCallback(() => {
    clearTimers();
    const n = participants.length;
    for (let i = 0; i < n; i++) {
      const timer = setTimeout(() => {
        setRevealedPaths((prev) => new Set([...prev, i]));
      }, i * 400);
      revealTimers.current.push(timer);
    }
  }, [participants.length]);

  const handleShowResult = useCallback(() => {
    setGameState('result');
  }, []);

  const handlePlayAgain = useCallback(() => {
    clearTimers();
    setLadder(generateLadder(participants.length));
    setRevealedPaths(new Set());
    setGameState('game');
  }, [participants.length]);

  const handleReset = useCallback(() => {
    clearTimers();
    setGameState('setup');
    setParticipants([]);
    setResultItems([]);
    setLadder(null);
    setRevealedPaths(new Set());
  }, []);

  return (
    <div className="max-w-4xl w-full">
      {gameState === 'setup' && <GameSetup onStart={handleStart} />}

      {gameState === 'game' && ladder && (
        <LadderScene
          participants={participants}
          resultItems={resultItems}
          ladder={ladder}
          revealedPaths={revealedPaths}
          onReveal={handleReveal}
          onRevealAll={handleRevealAll}
          onShowResult={handleShowResult}
        />
      )}

      {gameState === 'result' && ladder && (
        <GameResult
          participants={participants}
          resultItems={resultItems}
          resultMap={ladder.resultMap}
          onPlayAgain={handlePlayAgain}
          onReset={handleReset}
        />
      )}

    </div>
  );
}
