'use client';

import { useState, useCallback, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/horse/GameSetup';
import GamePlay from '@/components/horse/GamePlay';
import GameResult from '@/components/horse/GameResult';
import { useGameURL } from '@/hooks/useGameURL';
import { useHorseRace } from '@/hooks/useHorseRace';
import { GameState, HorseResult } from '@/types/horse';

export default function HorseGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [names, setNames] = useState<string[]>([]);
  const [result, setResult] = useState<HorseResult | null>(null);

  const {
    horses,
    finishOrder,
    raceState,
    countdown,
    isPhotoFinish,
    leader,
    leadChanges,
    startRace,
    resetRace,
  } = useHorseRace();

  const { initialized, sync, clear } = useGameURL(({ gameState: s, participants: p, params }) => {
    setNames(p);
    if (s === 'result') {
      // Try to restore rankings from URL
      const r = params.get('r'); // rankings: name1:rank1,name2:rank2,...
      const c = params.get('c'); // colors: color1,color2,...
      if (r && c) {
        const rankPairs = r.split(',').map((pair) => {
          const [name, rank] = pair.split(':');
          return { name, rank: parseInt(rank, 10) };
        });
        const colors = c.split(',');
        const rankings = rankPairs.map((pair, i) => ({
          name: pair.name,
          color: colors[i] || '#ccc',
          rank: pair.rank,
        }));
        const restoredResult: HorseResult = {
          rankings,
          participants: p,
          timestamp: new Date(),
        };
        setResult(restoredResult);
        resetRace(p);
        setGameState('result');
      } else {
        resetRace(p);
        setGameState('racing');
      }
    } else {
      resetRace(p);
      setGameState('racing');
    }
  });

  useEffect(() => {
    if (!initialized) return;
    const extra: Record<string, string> = {};
    if (result && gameState === 'result') {
      extra.r = result.rankings
        .map((e) => `${e.name}:${e.rank}`)
        .join(',');
      extra.c = result.rankings.map((e) => e.color).join(',');
    }
    sync(gameState, names, extra);
  }, [initialized, gameState, names, result, sync]);

  const handleStart = useCallback((inputNames: string[]) => {
    setNames(inputNames);
    setResult(null);
    resetRace(inputNames);
    setGameState('racing');
  }, [resetRace]);

  const handleRaceFinished = useCallback(() => {
    const horseResult: HorseResult = {
      rankings: [...finishOrder].sort((a, b) => a.rank - b.rank),
      participants: names,
      timestamp: new Date(),
    };
    setResult(horseResult);
    setGameState('result');
  }, [finishOrder, names]);

  const handlePlayAgain = useCallback(() => {
    setResult(null);
    resetRace(names);
    setGameState('racing');
  }, [names, resetRace]);

  const handleReset = useCallback(() => {
    clear();
    setNames([]);
    setResult(null);
    resetRace([]);
    setGameState('setup');
  }, [clear, resetRace]);

  return (
    <GameClientLayout
      gameState={gameState}
      setup={<GameSetup onStart={handleStart} />}
      gameplay={
        <div className="flex flex-col py-2 md:py-4 h-full min-h-[70dvh] md:min-h-0">
          <GamePlay
            horses={horses}
            finishOrder={finishOrder}
            raceState={raceState}
            countdown={countdown}
            isPhotoFinish={isPhotoFinish}
            leader={leader}
            leadChanges={leadChanges}
            onStart={startRace}
            onRaceFinished={handleRaceFinished}
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
