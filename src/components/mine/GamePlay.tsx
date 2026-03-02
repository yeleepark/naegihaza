'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { MineParticipant, MineCell } from '@/types/mine';
import { MinePhase } from '@/hooks/useMineGame';
import { GRID_COLS, GRID_ROWS, GRID_SIZE, MINE_COUNT } from '@/utils/mine';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';
import { Volume2, VolumeX } from 'lucide-react';

type Props = {
  participants: MineParticipant[];
  grid: MineCell[];
  currentPlayerIndex: number;
  phase: MinePhase;
  revealedCell: number | null;
  lastRevealWasMine: boolean;
  onStart: () => void;
  onCellClick: (cellId: number) => void;
};

export default function GamePlay({
  participants,
  grid,
  currentPlayerIndex,
  phase,
  revealedCell,
  lastRevealWasMine,
  onStart,
  onCellClick,
}: Props) {
  const { t } = useTranslation();
  const { enabled, setEnabled, playMineSafe, playBombExplode } = useSound();
  const [showDangerOverlay, setShowDangerOverlay] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [explodedPlayerName, setExplodedPlayerName] = useState('');
  const [explodedPlayerColor, setExplodedPlayerColor] = useState('');

  const turnCount = grid.filter((c) => c.revealed).length;
  const remainingCells = grid.filter((c) => !c.revealed).length;
  const isExploded = phase === 'revealing' && lastRevealWasMine;

  // Safe reveal sound
  useEffect(() => {
    if (phase === 'revealing' && revealedCell !== null && !lastRevealWasMine) {
      playMineSafe();
    }
  }, [phase, revealedCell, lastRevealWasMine, playMineSafe]);

  // Explosion effects
  useEffect(() => {
    if (phase === 'revealing' && revealedCell !== null && lastRevealWasMine) {
      playBombExplode();

      const player = currentPlayerIndex >= 0 ? participants[currentPlayerIndex] : null;
      setExplodedPlayerName(player?.name ?? '');
      setExplodedPlayerColor(player?.color ?? '#ef4444');

      setShowDangerOverlay(true);
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);
    }
  }, [phase, revealedCell, lastRevealWasMine, playBombExplode, currentPlayerIndex, participants]);

  const showStart = phase === 'idle' && grid.length === 0 && currentPlayerIndex < 0;
  const currentPlayer = currentPlayerIndex >= 0 ? participants[currentPlayerIndex] : null;
  const canClick = phase === 'waiting';

  // Preview grid for start screen
  const previewGrid: MineCell[] = grid.length > 0
    ? grid
    : Array.from({ length: GRID_SIZE }, (_, i) => ({
        id: i,
        row: Math.floor(i / GRID_COLS),
        col: i % GRID_COLS,
        hasMine: false,
        revealed: false,
      }));

  return (
    <div className={`flex flex-col items-center w-full max-w-[500px] mx-auto gap-4 md:gap-6 ${shakeScreen ? 'animate-screen-shake' : ''}`}>
      {/* Sound Toggle */}
      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className="fixed top-[4.5rem] right-6 md:right-8 z-[8] p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-shadow"
      >
        {enabled ? (
          <Volume2 className="w-5 h-5 text-black" />
        ) : (
          <VolumeX className="w-5 h-5 text-black/40" />
        )}
      </button>

      {/* Danger overlay on mine explosion */}
      {showDangerOverlay && (
        <div className="fixed inset-0 z-[20] flex items-center justify-center animate-danger-overlay pointer-events-none">
          <div className="absolute inset-0 bg-red-500/70" />
          <div className="relative flex flex-col items-center gap-4">
            <span className="text-7xl md:text-8xl animate-pulse">💥</span>
            <div
              className="px-8 py-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: explodedPlayerColor }}
            >
              <p className="font-game text-3xl md:text-4xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] break-words text-center">
                {explodedPlayerName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Player cards */}
      <div className="flex flex-wrap justify-center gap-2 w-full px-2">
        {participants.map((p) => {
          const isCurrent = currentPlayerIndex === p.id && phase !== 'idle';
          return (
            <div
              key={p.id}
              className={`
                px-3 py-1.5 rounded-lg border-2 border-black font-game text-xs md:text-sm font-bold
                transition-all duration-200
                ${isCurrent ? 'scale-110 ring-2 ring-purple-500 ring-offset-1 animate-bounce' : 'opacity-40'}
                ${!isCurrent && phase === 'idle' ? 'opacity-100' : ''}
              `}
              style={{
                backgroundColor: p.color,
                boxShadow: isCurrent
                  ? '0 0 12px rgba(168, 85, 247, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)'
                  : '2px 2px 0px 0px rgba(0,0,0,1)',
              }}
            >
              <span className="truncate max-w-[60px] inline-block align-bottom">
                {p.name}
              </span>
            </div>
          );
        })}
      </div>

      {currentPlayer && phase !== 'idle' && (
        <p className="font-game text-xs text-black/50 font-bold">
          {t('mine.selectCell')}
        </p>
      )}

      {/* Classic Minesweeper Container */}
      <div className="relative w-full max-w-[320px] md:max-w-[360px] mx-auto">
        {/* Outer 3D sunken frame */}
        <div
          className="bg-[#c0c0c0] p-1.5 md:p-2"
          style={{
            borderWidth: '3px',
            borderStyle: 'solid',
            borderTopColor: '#808080',
            borderLeftColor: '#808080',
            borderBottomColor: '#fff',
            borderRightColor: '#fff',
          }}
        >
          {/* Status bar */}
          <div
            className="flex items-center justify-between mb-1.5 md:mb-2 px-1"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderTopColor: '#808080',
              borderLeftColor: '#808080',
              borderBottomColor: '#fff',
              borderRightColor: '#fff',
            }}
          >
            {/* Mine count (left) */}
            <div
              className="bg-black px-2 py-1 min-w-[52px] text-center"
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderTopColor: '#808080',
                borderLeftColor: '#808080',
                borderBottomColor: '#c0c0c0',
                borderRightColor: '#c0c0c0',
              }}
            >
              <span className="font-mono text-base md:text-lg font-bold text-red-500 tracking-wider">
                💣 {String(MINE_COUNT).padStart(2, '0')}
              </span>
            </div>

            {/* Smiley (center) */}
            <button
              type="button"
              className="text-xl md:text-2xl leading-none select-none px-1 py-0.5"
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderTopColor: '#fff',
                borderLeftColor: '#fff',
                borderBottomColor: '#808080',
                borderRightColor: '#808080',
                backgroundColor: '#c0c0c0',
              }}
            >
              {isExploded ? '😵' : '😊'}
            </button>

            {/* Turn count (right) */}
            <div
              className="bg-black px-2 py-1 min-w-[52px] text-center"
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderTopColor: '#808080',
                borderLeftColor: '#808080',
                borderBottomColor: '#c0c0c0',
                borderRightColor: '#c0c0c0',
              }}
            >
              <span className="font-mono text-base md:text-lg font-bold text-red-500 tracking-wider">
                {String(turnCount).padStart(3, '0')}
              </span>
            </div>
          </div>

          {/* Grid area with inset border */}
          <div
            style={{
              borderWidth: '3px',
              borderStyle: 'solid',
              borderTopColor: '#808080',
              borderLeftColor: '#808080',
              borderBottomColor: '#fff',
              borderRightColor: '#fff',
            }}
          >
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
              }}
            >
              {previewGrid.map((cell) => {
                const isRevealing = revealedCell === cell.id && phase === 'revealing';
                const isSafe = cell.revealed && !cell.hasMine;
                const isMine = cell.revealed && cell.hasMine;
                const isClickable = canClick && !cell.revealed;

                // Unrevealed cell: 3D raised button
                if (!cell.revealed) {
                  return (
                    <button
                      key={cell.id}
                      type="button"
                      disabled={!isClickable}
                      onClick={() => isClickable && onCellClick(cell.id)}
                      className={`
                        aspect-square flex items-center justify-center
                        transition-all duration-150
                        ${isClickable ? 'hover:brightness-110 cursor-pointer active:brightness-95' : 'cursor-not-allowed'}
                      `}
                      style={{
                        backgroundColor: '#c0c0c0',
                        borderWidth: '3px',
                        borderStyle: 'solid',
                        borderTopColor: '#fff',
                        borderLeftColor: '#fff',
                        borderBottomColor: '#808080',
                        borderRightColor: '#808080',
                      }}
                    />
                  );
                }

                // Revealed cell: flat/sunken
                return (
                  <div
                    key={cell.id}
                    className={`
                      aspect-square flex items-center justify-center
                      text-lg md:text-xl font-bold
                      ${isRevealing && !cell.hasMine ? 'animate-bounce-in' : ''}
                      ${isRevealing && cell.hasMine ? 'animate-explode-pulse' : ''}
                    `}
                    style={{
                      backgroundColor: isMine ? '#ef4444' : '#c0c0c0',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: '#808080',
                    }}
                  >
                    {isSafe && (
                      <span className="text-[#808080] text-xs">·</span>
                    )}
                    {isMine && (
                      <span>💣</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start overlay — positioned over the grid */}
        {showStart && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-[7] rounded-sm">
            <Button
              onClick={onStart}
              variant="primary"
              className="text-lg px-8 py-4 lowercase"
            >
              {t('mine.play')}
            </Button>
          </div>
        )}
      </div>

      {/* Remaining cells count */}
      {grid.length > 0 && (
        <div className="font-game text-xs md:text-sm text-black/60 font-bold">
          <span>{t('mine.remaining', { count: remainingCells })}</span>
        </div>
      )}
    </div>
  );
}
