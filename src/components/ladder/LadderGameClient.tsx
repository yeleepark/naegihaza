'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/ladder/GameSetup';
import LadderScene from '@/components/ladder/LadderScene';
import GameResult from '@/components/ladder/GameResult';
import { generateLadder } from '@/utils/ladder';
import { useGameURL } from '@/hooks/useGameURL';
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

  const { initialized, sync, clear } = useGameURL(({ gameState: s, participants: p, params }) => {
    setParticipants(p);
    const ri = params.get('ri');
    if (ri) {
      setResultItems(ri.split(','));
    }
    // Ladder layout is random — regenerate and restart from game state
    setLadder(generateLadder(p.length));
    setRevealedPaths(new Set());
    setGameState('game');
  });

  useEffect(() => {
    if (!initialized) return;
    const extra: Record<string, string> = {};
    if (resultItems.length > 0) {
      extra.ri = resultItems.join(',');
    }
    sync(gameState, participants, extra);
  }, [initialized, gameState, participants, resultItems, sync]);

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
    clear();
    setGameState('setup');
    setParticipants([]);
    setResultItems([]);
    setLadder(null);
    setRevealedPaths(new Set());
  }, [clear]);

  return (
    <GameClientLayout
      gameState={gameState}
      setup={<GameSetup onStart={handleStart} />}
      gameplay={
        ladder ? (
          <LadderScene
            participants={participants}
            resultItems={resultItems}
            ladder={ladder}
            revealedPaths={revealedPaths}
            onReveal={handleReveal}
            onRevealAll={handleRevealAll}
            onShowResult={handleShowResult}
          />
        ) : null
      }
      result={
        ladder ? (
          <GameResult
            participants={participants}
            resultItems={resultItems}
            resultMap={ladder.resultMap}
            onPlayAgain={handlePlayAgain}
            onReset={handleReset}
          />
        ) : null
      }
    />
  );
}
