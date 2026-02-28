'use client';

import { useState, useCallback, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/roulette/GameSetup';
import GameSpinning from '@/components/roulette/GameSpinning';
import GameResult from '@/components/roulette/GameResult';
import {
  generateParticipants,
  generateWheelSegments,
  selectWinner,
  calculateSpinConfig,
  createRouletteResult,
} from '@/utils/roulette';
import { useGameURL } from '@/hooks/useGameURL';
import {
  GameState,
  Participant,
  WheelSegment,
  SpinConfig,
  RouletteResult,
} from '@/types/roulette';

export default function RouletteGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [segments, setSegments] = useState<WheelSegment[]>([]);
  const [spinConfig, setSpinConfig] = useState<SpinConfig | undefined>(
    undefined
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<RouletteResult | null>(null);

  const { initialized, sync, clear } = useGameURL(({ gameState: s, participants: p, params }) => {
    const newParticipants = generateParticipants(p);
    setParticipants(newParticipants);
    setSegments(generateWheelSegments(p.length));
    if (s === 'result') {
      const w = params.get('w');
      const wc = params.get('wc');
      const wn = params.get('wn');
      if (w && wc && wn) {
        const winnerId = newParticipants.find((pt) => pt.name === w)?.id ?? 0;
        setResult({
          winnerId,
          winnerName: w,
          winnerColor: wc,
          winnerNumber: parseInt(wn, 10),
          totalParticipants: p.length,
          timestamp: new Date(),
        });
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
    const names = participants.map((p) => p.name);
    const extra: Record<string, string> = {};
    if (result) {
      extra.w = result.winnerName;
      extra.wc = result.winnerColor;
      extra.wn = String(result.winnerNumber);
    }
    sync(gameState, names, extra);
  }, [initialized, gameState, participants, result, sync]);

  const handleStart = useCallback((names: string[]) => {
    const newParticipants = generateParticipants(names);
    setParticipants(newParticipants);
    setSegments(generateWheelSegments(names.length));
    setGameState('spinning');
    setIsSpinning(false);
    setSpinConfig(undefined);
  }, []);

  const handleShuffle = useCallback(() => {
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const reshuffled = shuffled.map((p, i) => ({ ...p, id: i, displayNumber: i + 1 }));
    setParticipants(reshuffled);
    setSegments(generateWheelSegments(reshuffled.length));
    setSpinConfig(undefined);
  }, [participants]);

  const handleSpin = useCallback(() => {
    const winnerIndex = selectWinner(participants.length);
    const config = calculateSpinConfig(winnerIndex, participants.length);

    setSpinConfig(config);
    setIsSpinning(true);

    // Store result for later
    const newResult = createRouletteResult(winnerIndex, participants);
    setResult(newResult);
  }, [participants]);

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);
    setGameState('result');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameState('spinning');
    setIsSpinning(false);
    setSpinConfig(undefined);
  }, []);

  const handleReset = useCallback(() => {
    clear();
    setGameState('setup');
    setParticipants([]);
    setSegments([]);
    setSpinConfig(undefined);
    setIsSpinning(false);
    setResult(null);
  }, [clear]);

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
