'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ScratchCard } from '@/types/scratch';
import { useTranslation } from 'react-i18next';

type ScratchCardItemProps = {
  card: ScratchCard;
  onScratched: (id: number) => void;
};

const SCRATCH_THRESHOLD = 0.5;

export default function ScratchCardItem({ card, onScratched }: ScratchCardItemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const revealedRef = useRef(false);
  const { t } = useTranslation();

  const getPointerPos = (canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: ((e as MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as MouseEvent).clientY - rect.top) * scaleY,
    };
  };

  const checkReveal = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      if (revealedRef.current) return;
      const { width, height } = canvas;
      const data = ctx.getImageData(0, 0, width, height).data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) transparent++;
      }
      const ratio = transparent / (width * height);
      if (ratio >= SCRATCH_THRESHOLD) {
        revealedRef.current = true;
        ctx.clearRect(0, 0, width, height);
        onScratched(card.id);
      }
    },
    [card.id, onScratched]
  );

  const scratch = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      checkReveal(canvas, ctx);
    },
    [checkReveal]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw scratch coating
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6b7280';
    ctx.font = `bold ${Math.floor(canvas.height * 0.12)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👆 scratch', canvas.width / 2, canvas.height / 2);

    const onMouseDown = (e: MouseEvent) => {
      if (card.isScratched) return;
      isDrawingRef.current = true;
      const pos = getPointerPos(canvas, e);
      scratch(canvas, ctx, pos.x, pos.y);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current || card.isScratched) return;
      const pos = getPointerPos(canvas, e);
      scratch(canvas, ctx, pos.x, pos.y);
    };
    const onMouseUp = () => { isDrawingRef.current = false; };

    const onTouchStart = (e: TouchEvent) => {
      if (card.isScratched) return;
      e.preventDefault();
      isDrawingRef.current = true;
      const pos = getPointerPos(canvas, e);
      scratch(canvas, ctx, pos.x, pos.y);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDrawingRef.current || card.isScratched) return;
      e.preventDefault();
      const pos = getPointerPos(canvas, e);
      scratch(canvas, ctx, pos.x, pos.y);
    };
    const onTouchEnd = () => { isDrawingRef.current = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [card.isScratched, scratch]);

  useEffect(() => {
    if (card.isScratched) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [card.isScratched]);

  return (
    <div
      className="relative w-full rounded-xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      style={{ aspectRatio: '3/4' }}
    >
      {/* Result layer */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-1 ${
          card.isWinner ? 'bg-yellow-300' : 'bg-gray-200'
        }`}
      >
        <span className="text-3xl md:text-4xl select-none">
          {card.isWinner ? '🎊' : '😢'}
        </span>
        <span
          className={`font-game text-sm md:text-base font-black ${
            card.isWinner ? 'text-black' : 'text-gray-500'
          }`}
        >
          {card.isWinner ? t('scratch.win') : t('scratch.lose')}
        </span>
      </div>

      {/* Name label */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1 px-2 text-center z-10">
        <span className="font-game text-white text-xs font-bold truncate block">
          {card.participantName}
        </span>
      </div>

      {/* Scratch canvas overlay */}
      {!card.isScratched && (
        <canvas
          ref={canvasRef}
          width={300}
          height={400}
          className="absolute inset-0 w-full h-full cursor-crosshair z-20"
          style={{ touchAction: 'none' }}
        />
      )}
    </div>
  );
}
