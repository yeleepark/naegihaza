'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import GameSetup from '@/components/dice/GameSetup';
import GameRolling from '@/components/dice/GameRolling';
import GameResult from '@/components/dice/GameResult';
import {
  generateParticipants,
  rollDice,
  calculateDiceConfig,
  determineWinners,
} from '@/utils/dice';
import {
  GameState,
  Participant,
  DiceRollConfig,
  DiceResult,
} from '@/types/dice';

export default function DicePage() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentRollingIndex, setCurrentRollingIndex] = useState(0);
  const [rollConfig, setRollConfig] = useState<DiceRollConfig | undefined>(
    undefined
  );
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<DiceResult | null>(null);

  const handleStart = useCallback((names: string[]) => {
    const newParticipants = generateParticipants(names);
    setParticipants(newParticipants);
    setGameState('rolling');
    setCurrentRollingIndex(0);
    setIsRolling(false);
    setRollConfig(undefined);
  }, []);

  const handleRollNext = useCallback(() => {
    if (isRolling) return;

    const targetValue1 = rollDice();
    const targetValue2 = rollDice();
    const config = calculateDiceConfig(targetValue1, targetValue2);
    config.participantId = currentRollingIndex;

    setRollConfig(config);
    setIsRolling(true);
  }, [currentRollingIndex, isRolling]);

  const handleRollComplete = useCallback(
    (value1: number, value2: number) => {
      setIsRolling(false);
      setRollConfig(undefined);

      // Update participant's dice values
      setParticipants((prev) => {
        const updated = [...prev];
        updated[currentRollingIndex] = {
          ...updated[currentRollingIndex],
          diceValue1: value1,
          diceValue2: value2,
          totalValue: value1 + value2,
        };
        return updated;
      });

      // Auto-advance to next participant after a short delay
      // Don't advance past the last participant
      setTimeout(() => {
        setCurrentRollingIndex((prev) => {
          const nextIndex = prev + 1;
          // Only advance if there are more participants
          if (nextIndex < participants.length) {
            return nextIndex;
          }
          return prev; // Stay on current participant if at the end
        });
      }, 500);
    },
    [currentRollingIndex, participants.length]
  );

  const handleShowResult = useCallback(() => {
    const diceResult = determineWinners(participants);
    setResult(diceResult);
    setGameState('result');
  }, [participants]);

  const handlePlayAgain = useCallback(() => {
    // Reset dice values but keep participants
    setParticipants((prev) =>
      prev.map((p) => ({ ...p, diceValue1: undefined, diceValue2: undefined, totalValue: undefined }))
    );
    setCurrentRollingIndex(0);
    setIsRolling(false);
    setRollConfig(undefined);
    setGameState('rolling');
  }, []);

  const handleReset = useCallback(() => {
    setGameState('setup');
    setParticipants([]);
    setCurrentRollingIndex(0);
    setRollConfig(undefined);
    setIsRolling(false);
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

            {gameState === 'rolling' && (
              <GameRolling
                participants={participants}
                currentRollingIndex={currentRollingIndex}
                rollConfig={rollConfig}
                isRolling={isRolling}
                onRollNext={handleRollNext}
                onRollComplete={handleRollComplete}
                onShowResult={handleShowResult}
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
