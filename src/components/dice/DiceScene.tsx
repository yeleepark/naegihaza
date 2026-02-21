'use client';

import { useEffect, useRef } from 'react';
import { DiceRollConfig } from '@/types/dice';
import { getPipPositions } from '@/utils/dice';

type DiceSceneProps = {
  rollConfig?: DiceRollConfig;
  onRollComplete?: (value1: number, value2: number) => void;
  currentValue1?: number;
  currentValue2?: number;
  isActive: boolean;
};

export default function DiceScene({
  rollConfig,
  onRollComplete,
  currentValue1,
  currentValue2,
  isActive,
}: DiceSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rollConfigRef = useRef<DiceRollConfig | undefined>(rollConfig);
  const onRollCompleteRef = useRef<((v1: number, v2: number) => void) | undefined>(
    onRollComplete
  );
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  // Keep refs in sync with props
  useEffect(() => {
    rollConfigRef.current = rollConfig;
  }, [rollConfig]);

  useEffect(() => {
    onRollCompleteRef.current = onRollComplete;
  }, [onRollComplete]);

  // Draw a single 3D dice
  const drawDice = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    value: number,
    rotation: number,
    isRolling: boolean
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const depth = size * 0.25;

    // Draw 3D effect - back faces (darker)
    ctx.fillStyle = '#d0d0d0';

    // Right face
    ctx.beginPath();
    ctx.moveTo(size / 2, -size / 2);
    ctx.lineTo(size / 2 + depth, -size / 2 - depth);
    ctx.lineTo(size / 2 + depth, size / 2 - depth);
    ctx.lineTo(size / 2, size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Top face
    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath();
    ctx.moveTo(-size / 2, -size / 2);
    ctx.lineTo(-size / 2 + depth, -size / 2 - depth);
    ctx.lineTo(size / 2 + depth, -size / 2 - depth);
    ctx.lineTo(size / 2, -size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Front face (white with pips)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;

    const halfSize = size / 2;
    ctx.fillRect(-halfSize, -halfSize, size, size);
    ctx.strokeRect(-halfSize, -halfSize, size, size);

    // Add blur effect while rolling
    if (isRolling) {
      ctx.globalAlpha = 0.7;
    }

    // Draw pips
    const pipRadius = size * 0.08;
    const pipPositions = getPipPositions(value);

    ctx.fillStyle = '#000000';
    pipPositions.forEach((pos) => {
      const pipX = (pos.x / 100) * size - halfSize;
      const pipY = (pos.y / 100) * size - halfSize;

      ctx.beginPath();
      ctx.arc(pipX, pipY, pipRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  // Draw static dice
  const drawStaticDice = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const displayValue1 = currentValue1 || 1;
    const displayValue2 = currentValue2 || 1;
    const diceSize = Math.min(canvas.width, canvas.height) * 0.35;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDice(ctx, canvas.width * 0.3, canvas.height * 0.5, diceSize, displayValue1, 0, false);
    drawDice(ctx, canvas.width * 0.7, canvas.height * 0.5, diceSize, displayValue2, 0, false);
  };

  // Animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clean up any existing animation/timeout
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const config = rollConfigRef.current;

    if (!config) {
      // No roll in progress - show static dice
      isAnimatingRef.current = false;
      drawStaticDice(ctx, canvas);
      return;
    }

    // Start animation only if not already animating
    if (isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const currentConfig = rollConfigRef.current;
      if (!currentConfig) {
        // Config was cleared, stop animation
        isAnimatingRef.current = false;
        drawStaticDice(ctx, canvas);
        return;
      }

      const progress = Math.min(elapsed / currentConfig.duration, 1);
      const easedProgress = currentConfig.easeFunction(progress);

      // Different rotation speeds for each die
      const rotation1 = easedProgress * Math.PI * 8;
      const rotation2 = easedProgress * Math.PI * 10;

      // Show random values during roll, settle to target
      const displayValue1 =
        progress < 0.95
          ? Math.floor(Math.random() * 6) + 1
          : currentConfig.targetValue1;
      const displayValue2 =
        progress < 0.95
          ? Math.floor(Math.random() * 6) + 1
          : currentConfig.targetValue2;

      const diceSize = Math.min(canvas.width, canvas.height) * 0.35;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDice(ctx, canvas.width * 0.3, canvas.height * 0.5, diceSize, displayValue1, rotation1, progress < 1);
      drawDice(ctx, canvas.width * 0.7, canvas.height * 0.5, diceSize, displayValue2, rotation2, progress < 1);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        animationFrameRef.current = null;
        isAnimatingRef.current = false;

        timeoutRef.current = setTimeout(() => {
          const finalConfig = rollConfigRef.current;
          if (finalConfig) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const finalDiceSize = Math.min(canvas.width, canvas.height) * 0.35;
            drawDice(ctx, canvas.width * 0.3, canvas.height * 0.5, finalDiceSize, finalConfig.targetValue1, 0, false);
            drawDice(ctx, canvas.width * 0.7, canvas.height * 0.5, finalDiceSize, finalConfig.targetValue2, 0, false);

            if (onRollCompleteRef.current) {
              onRollCompleteRef.current(finalConfig.targetValue1, finalConfig.targetValue2);
            }
          }
          timeoutRef.current = null;
        }, 300);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isAnimatingRef.current = false;
    };
  }, [rollConfig, currentValue1, currentValue2]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const size = Math.min(container.clientWidth, container.clientHeight, 250);
      canvas.width = size;
      canvas.height = size;

      // Redraw after resize
      const ctx = canvas.getContext('2d');
      if (ctx && !isAnimatingRef.current) {
        drawStaticDice(ctx, canvas);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [currentValue1, currentValue2]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <canvas
        ref={canvasRef}
        className="rounded-lg"
      />
    </div>
  );
}
