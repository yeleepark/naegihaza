'use client';

import { useEffect, useRef } from 'react';
import { WheelSegment, SpinConfig, Participant } from '@/types/roulette';
import { calculateTargetAngle } from '@/utils/roulette';

type RouletteSceneProps = {
  segments: WheelSegment[];
  participants: Participant[];
  spinConfig?: SpinConfig;
  onSpinComplete: () => void;
};

export default function RouletteScene({
  segments,
  participants,
  spinConfig,
  onSpinComplete,
}: RouletteSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const currentRotationRef = useRef<number>(0);

  // Refs to keep latest values accessible inside animation loop
  const segmentsRef = useRef<WheelSegment[]>(segments);
  const participantsRef = useRef<Participant[]>(participants);
  const onSpinCompleteRef = useRef(onSpinComplete);

  const spinStateRef = useRef<{
    isSpinning: boolean;
    startTime: number;
    startRotation: number;
    targetRotation: number;
    duration: number;
    easeFunction: (t: number) => number;
  } | null>(null);

  // Sync refs with latest props
  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
  }, [onSpinComplete]);

  // Reset rotation when segments change
  useEffect(() => {
    if (segments.length === 0 || participants.length === 0) return;
    currentRotationRef.current = 0;
  }, [segments, participants]);

  // Handle spin config changes
  useEffect(() => {
    if (!spinConfig) return;

    const targetAngle = calculateTargetAngle(
      spinConfig.winnerIndex,
      segments.length,
      spinConfig.rotations
    );

    spinStateRef.current = {
      isSpinning: true,
      startTime: Date.now(),
      startRotation: currentRotationRef.current,
      targetRotation: currentRotationRef.current + targetAngle,
      duration: spinConfig.duration,
      easeFunction: spinConfig.easeFunction,
    };
  }, [spinConfig, segments.length]);

  // Canvas animation loop — runs once on mount, reads latest values via refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const size = Math.min(container.clientWidth, container.clientHeight);
      if (size > 0) {
        canvas.width = size;
        canvas.height = size;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw wheel directly inside the effect to avoid stale closure
    const drawWheel = (rotation: number) => {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      const segs = segmentsRef.current;
      const parts = participantsRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.4;

      if (segs.length === 0) return;

      // Save context
      ctx.save();

      // Translate and rotate
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Draw segments
      const anglePerSegment = (Math.PI * 2) / segs.length;

      segs.forEach((segment, index) => {
        const startAngle = index * anglePerSegment;
        const endAngle = (index + 1) * anglePerSegment;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = segment.color;
        ctx.fill();

        // Draw border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw participant name
        const participant = parts[index];
        if (participant) {
          ctx.save();

          const midAngle = (startAngle + endAngle) / 2;
          const textRadius = radius * 0.7;

          ctx.rotate(midAngle);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#000000';
          ctx.font = `bold ${Math.max(14, radius / 8)}px Jua, sans-serif`;

          // Draw text
          ctx.fillText(participant.name, textRadius, 0);

          ctx.restore();
        }
      });

      // Draw center circle
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Restore context
      ctx.restore();

      // Draw pointer (triangle at top)
      ctx.save();
      ctx.translate(centerX, centerY);

      ctx.beginPath();
      ctx.moveTo(0, -radius + 5);
      ctx.lineTo(-15, -radius - 20);
      ctx.lineTo(15, -radius - 20);
      ctx.closePath();

      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Update spin animation
      const state = spinStateRef.current;
      if (state?.isSpinning) {
        const now = Date.now();
        const elapsed = now - state.startTime;
        const progress = Math.min(elapsed / state.duration, 1);

        const easedProgress = state.easeFunction(progress);
        const newRotation =
          state.startRotation +
          (state.targetRotation - state.startRotation) * easedProgress;

        currentRotationRef.current = newRotation;

        if (progress >= 1) {
          state.isSpinning = false;
          // Delay callback for dramatic effect
          setTimeout(() => {
            onSpinCompleteRef.current();
          }, 500);
        }
      }

      // Draw wheel every frame
      drawWheel(currentRotationRef.current);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []); // Stable deps — reads latest values via refs

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      style={{ backgroundColor: '#fef9c3' }}
    />
  );
}
