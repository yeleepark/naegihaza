'use client';

import { useState, useCallback } from 'react';
import GameSetup from '@/components/bomb/GameSetup';
import GamePlay from '@/components/bomb/GamePlay';
import GameResult from '@/components/bomb/GameResult';
import { generateCards, PARTICIPANT_COLORS } from '@/utils/bomb';
import { GameState, Card, BombResult } from '@/types/bomb';

export default function BombGameClient() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [participants, setParticipants] = useState<string[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [result, setResult] = useState<BombResult | null>(null);
  const [flippingCardId, setFlippingCardId] = useState<number | null>(null);

  const handleStart = useCallback((names: string[]) => {
    setParticipants(names);
    setCards(generateCards(12));
    setCurrentTurnIndex(0);
    setResult(null);
    setFlippingCardId(null);
    setGameState('playing');
  }, []);

  const handleCardFlip = useCallback(
    (cardId: number) => {
      if (flippingCardId !== null) return;

      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped) return;

      setFlippingCardId(cardId);

      // After flip animation completes, update state
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
        );
        setFlippingCardId(null);

        if (card.isBomb) {
          // Show result after a brief pause to see the bomb
          setTimeout(() => {
            const loserName = participants[currentTurnIndex];
            const loserColor =
              PARTICIPANT_COLORS[currentTurnIndex % PARTICIPANT_COLORS.length];
            const winnerNames = participants.filter((_, i) => i !== currentTurnIndex);

            setResult({
              loserName,
              loserColor,
              winnerNames,
              totalCards: 12,
              timestamp: new Date(),
            });
            setGameState('result');
          }, 800);
        } else {
          // Advance to next participant
          setCurrentTurnIndex((prev) => (prev + 1) % participants.length);
        }
      }, 500);
    },
    [cards, flippingCardId, currentTurnIndex, participants]
  );

  const handlePlayAgain = useCallback(() => {
    setCards(generateCards(12));
    setCurrentTurnIndex(0);
    setResult(null);
    setFlippingCardId(null);
    setGameState('playing');
  }, []);

  const handleReset = useCallback(() => {
    setGameState('setup');
    setParticipants([]);
    setCards([]);
    setCurrentTurnIndex(0);
    setResult(null);
    setFlippingCardId(null);
  }, []);

  return (
    <div className="max-w-2xl w-full h-full">
      {gameState === 'setup' && <GameSetup onStart={handleStart} />}

      {gameState === 'playing' && (
        <div className="flex items-start justify-center py-4 md:py-8">
          <GamePlay
            participants={participants}
            cards={cards}
            currentTurnIndex={currentTurnIndex}
            flippingCardId={flippingCardId}
            onCardFlip={handleCardFlip}
          />
        </div>
      )}

      {gameState === 'result' && result && (
        <GameResult
          result={result}
          onPlayAgain={handlePlayAgain}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
