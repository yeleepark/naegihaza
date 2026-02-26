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
  const FLIPS_PER_PERSON = 2;
  const getCardCount = (participantCount: number) => participantCount * FLIPS_PER_PERSON;

  const handleStart = useCallback((names: string[]) => {
    const count = getCardCount(names.length);
    setParticipants(names);
    setCards(generateCards(count));
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
            const totalCards = getCardCount(participants.length);

            setResult({
              loserName,
              loserColor,
              winnerNames,
              totalCards,
              timestamp: new Date(),
            });
            setGameState('result');
          }, 800);
        } else {
          // Round-robin: next participant flips one card
          setCurrentTurnIndex((prev) => (prev + 1) % participants.length);
        }
      }, 500);
    },
    [cards, flippingCardId, currentTurnIndex, participants]
  );

  const handlePlayAgain = useCallback(() => {
    const count = getCardCount(participants.length);
    setCards(generateCards(count));
    setCurrentTurnIndex(0);
    setResult(null);
    setFlippingCardId(null);
    setGameState('playing');
  }, [participants.length]);

  const handleReset = useCallback(() => {
    setGameState('setup');
    setParticipants([]);
    setCards([]);
    setCurrentTurnIndex(0);
    setResult(null);
    setFlippingCardId(null);
  }, []);

  return (
    <div className="w-full h-full min-h-0 flex flex-col max-w-2xl mx-auto">
      {gameState === 'setup' && <GameSetup onStart={handleStart} />}

      {gameState === 'playing' && (
        <div className="flex-1 min-h-0 flex flex-col py-2 md:py-4">
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
