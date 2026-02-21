'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
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
import {
  GameState,
  Participant,
  WheelSegment,
  SpinConfig,
  RouletteResult,
} from '@/types/roulette';

export default function RoulettePage() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [segments, setSegments] = useState<WheelSegment[]>([]);
  const [spinConfig, setSpinConfig] = useState<SpinConfig | undefined>(
    undefined
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<RouletteResult | null>(null);

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
    setGameState('setup');
    setParticipants([]);
    setSegments([]);
    setSpinConfig(undefined);
    setIsSpinning(false);
    setResult(null);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#fef3e2] overflow-hidden">
      <Header />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <WaveCurtain />

        <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4 md:p-8">
          <div className="max-w-5xl w-full h-full">
            {gameState === 'setup' && <GameSetup onStart={handleStart} />}

            {gameState === 'spinning' && (
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

            {gameState === 'result' && result && (
              <GameResult
                result={result}
                onPlayAgain={handlePlayAgain}
                onReset={handleReset}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
