import { useState, useCallback, useRef, useEffect } from 'react';
import { MineParticipant, MineCell, MineResult } from '@/types/mine';
import { generateParticipants, generateGrid } from '@/utils/mine';

export type MinePhase = 'idle' | 'waiting' | 'revealing' | 'transition';

interface MineGameCallbacks {
  onComplete: (result: MineResult) => void;
  onSafe?: () => void;
  onExplode?: () => void;
}

export function useMineGame(callbacks: MineGameCallbacks) {
  const [participants, setParticipants] = useState<MineParticipant[]>([]);
  const [grid, setGrid] = useState<MineCell[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(-1);
  const [phase, setPhase] = useState<MinePhase>('idle');
  const [revealedCell, setRevealedCell] = useState<number | null>(null);
  const [lastRevealWasMine, setLastRevealWasMine] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;
  const participantsRef = useRef<MineParticipant[]>([]);
  const gridRef = useRef<MineCell[]>([]);
  const currentPlayerIndexRef = useRef(-1);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const getNextPlayer = useCallback((fromIndex: number) => {
    const len = participantsRef.current.length;
    return (fromIndex + 1) % len;
  }, []);

  const handleCellClick = useCallback((cellId: number) => {
    if (phase !== 'waiting') return;

    const cell = gridRef.current.find((c) => c.id === cellId);
    if (!cell || cell.revealed) return;

    const playerIdx = currentPlayerIndexRef.current;

    // Reveal the cell
    setPhase('revealing');
    setRevealedCell(cellId);
    setLastRevealWasMine(cell.hasMine);

    const updatedGrid = gridRef.current.map((c) =>
      c.id === cellId ? { ...c, revealed: true, revealedBy: playerIdx } : c,
    );
    gridRef.current = updatedGrid;
    setGrid(updatedGrid);

    if (cell.hasMine) {
      // Hit the mine — this player is the loser
      callbacksRef.current.onExplode?.();
      const loser = participantsRef.current[playerIdx];

      timerRef.current = setTimeout(() => {
        callbacksRef.current.onComplete({
          loserName: loser.name,
          loserColor: loser.color,
          totalParticipants: participantsRef.current.length,
          timestamp: new Date(),
        });
      }, 2000);
    } else {
      // Safe — move to next player
      callbacksRef.current.onSafe?.();

      timerRef.current = setTimeout(() => {
        const nextIdx = getNextPlayer(playerIdx);
        currentPlayerIndexRef.current = nextIdx;
        setCurrentPlayerIndex(nextIdx);
        setPhase('transition');
        timerRef.current = setTimeout(() => {
          setRevealedCell(null);
          setLastRevealWasMine(false);
          setPhase('waiting');
        }, 400);
      }, 600);
    }
  }, [phase, getNextPlayer]);

  const handleSetup = useCallback((names: string[]) => {
    const p = generateParticipants(names);
    setParticipants(p);
    participantsRef.current = p;
    setGrid([]);
    gridRef.current = [];
    setCurrentPlayerIndex(-1);
    currentPlayerIndexRef.current = -1;
    setRevealedCell(null);
    setPhase('idle');
  }, []);

  const handleStart = useCallback(() => {
    cleanup();
    const p = participantsRef.current;
    const newGrid = generateGrid();
    gridRef.current = newGrid;
    setGrid(newGrid);

    const startIndex = Math.floor(Math.random() * p.length);
    currentPlayerIndexRef.current = startIndex;
    setCurrentPlayerIndex(startIndex);
    setRevealedCell(null);
    setLastRevealWasMine(false);
    setPhase('waiting');
  }, [cleanup]);

  const handlePlayAgain = useCallback(() => {
    cleanup();
    setGrid([]);
    gridRef.current = [];
    setCurrentPlayerIndex(-1);
    currentPlayerIndexRef.current = -1;
    setRevealedCell(null);
    setPhase('idle');
  }, [cleanup]);

  const handleReset = useCallback(() => {
    cleanup();
    setParticipants([]);
    participantsRef.current = [];
    setGrid([]);
    gridRef.current = [];
    setCurrentPlayerIndex(-1);
    currentPlayerIndexRef.current = -1;
    setRevealedCell(null);
    setPhase('idle');
  }, [cleanup]);

  const restoreFromURL = useCallback((names: string[], result?: MineResult) => {
    const p = generateParticipants(names);
    setParticipants(p);
    participantsRef.current = p;
    setCurrentPlayerIndex(-1);
    setPhase('idle');
    if (result) {
      // Restored from result state
    }
  }, []);

  return {
    participants,
    grid,
    currentPlayerIndex,
    phase,
    revealedCell,
    lastRevealWasMine,
    handleSetup,
    handleStart,
    handleCellClick,
    handlePlayAgain,
    handleReset,
    restoreFromURL,
  };
}
