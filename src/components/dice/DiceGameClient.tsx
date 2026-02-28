'use client';

import { useState, useCallback, useEffect } from 'react';
import GameClientLayout from '@/components/layout/GameClientLayout';
import GameSetup from '@/components/dice/GameSetup';
import GameRolling from '@/components/dice/GameRolling';
import GameResult from '@/components/dice/GameResult';
import {
  generateParticipants,
  rollDice,
  calculateDiceConfig,
  determineWinners,
} from '@/utils/dice';
import { useGameURL } from '@/hooks/useGameURL';
import {
  GameState,
  Participant,
  DiceRollConfig,
  DiceResult,
} from '@/types/dice';

export default function DiceGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentRollingIndex, setCurrentRollingIndex] = useState(0);
  const [rollConfig, setRollConfig] = useState<DiceRollConfig | undefined>(
    undefined
  );
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<DiceResult | null>(null);

  const { initialized, sync, clear } = useGameURL(({ gameState: s, participants: p, params }) => {
    const newParticipants = generateParticipants(p);
    setParticipants(newParticipants);
    if (s === 'result') {
      // Dice result is complex (rankings with dice values).
      // Restore participant names and re-enter rolling so user can re-roll.
      setGameState('rolling');
    } else {
      setGameState('rolling');
    }
  });

  useEffect(() => {
    if (!initialized) return;
    const names = participants.map((p) => p.name);
    sync(gameState, names);
  }, [initialized, gameState, participants, sync]);

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
    clear();
    setGameState('setup');
    setParticipants([]);
    setCurrentRollingIndex(0);
    setRollConfig(undefined);
    setIsRolling(false);
    setResult(null);
  }, [clear]);

  return (
    <GameClientLayout
      gameState={gameState}
      setup={<GameSetup onStart={handleStart} />}
      gameplay={
        <GameRolling
          participants={participants}
          currentRollingIndex={currentRollingIndex}
          rollConfig={rollConfig}
          isRolling={isRolling}
          onRollNext={handleRollNext}
          onRollComplete={handleRollComplete}
          onShowResult={handleShowResult}
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
