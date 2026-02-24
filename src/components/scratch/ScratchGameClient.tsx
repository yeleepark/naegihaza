'use client';

import { useState, useCallback } from 'react';
import GameSetup from '@/components/scratch/GameSetup';
import GamePlay from '@/components/scratch/GamePlay';
import GameResult from '@/components/scratch/GameResult';
import { generateScratchCards } from '@/utils/scratch';
import { ScratchGameState, ScratchCard, ScratchResult } from '@/types/scratch';

export default function ScratchGameClient() {
  const [gameState, setGameState] = useState<ScratchGameState>('setup');
  const [participants, setParticipants] = useState<string[]>([]);
  const [winnerCount, setWinnerCount] = useState(1);
  const [cards, setCards] = useState<ScratchCard[]>([]);
  const [result, setResult] = useState<ScratchResult | null>(null);

  const handleStart = useCallback((names: string[], winners: number) => {
    setParticipants(names);
    setWinnerCount(winners);
    setCards(generateScratchCards(names, winners));
    setResult(null);
    setGameState('playing');
  }, []);

  const handleScratched = useCallback((id: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isScratched: true } : c)));
  }, []);

  const handleShowResult = useCallback(() => {
    setCards((prev) => {
      const winners = prev.filter((c) => c.isWinner).map((c) => c.participantName);
      const losers = prev.filter((c) => !c.isWinner).map((c) => c.participantName);
      setResult({ winners, losers, timestamp: new Date() });
      return prev;
    });
    setGameState('result');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setCards(generateScratchCards(participants, winnerCount));
    setResult(null);
    setGameState('playing');
  }, [participants, winnerCount]);

  const handleReset = useCallback(() => {
    setGameState('setup');
    setParticipants([]);
    setCards([]);
    setResult(null);
  }, []);

  return (
    <div className="w-full h-full min-h-0 flex flex-col max-w-2xl mx-auto">
      {gameState === 'setup' && <GameSetup onStart={handleStart} />}

      {gameState === 'playing' && (
        <div className="flex-1 min-h-0 flex flex-col py-2 md:py-4">
          <GamePlay
            cards={cards}
            winnerCount={winnerCount}
            onScratched={handleScratched}
            onShowResult={handleShowResult}
          />
        </div>
      )}

      {gameState === 'result' && result && (
        <GameResult result={result} onPlayAgain={handlePlayAgain} onReset={handleReset} />
      )}
    </div>
  );
}
