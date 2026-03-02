import { useEffect, useRef, useState, useCallback } from 'react';
import { WheelSegment, SpinConfig, Participant } from '@/types/roulette';
import { calculateTargetAngle } from '@/utils/roulette';

interface UseRouletteWheelOptions {
  segments: WheelSegment[];
  participants: Participant[];
  spinConfig?: SpinConfig;
  onSpinComplete: () => void;
  onSegmentCross?: () => void;
  onNearStop?: () => void;
}

// Color helper: darken a hex color by factor (0-1)
function darkenColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r * (1 - factor))}, ${Math.round(g * (1 - factor))}, ${Math.round(b * (1 - factor))})`;
}

// Color helper: lighten a hex color by factor (0-1)
function lightenColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, Math.round(r + (255 - r) * factor))}, ${Math.min(255, Math.round(g + (255 - g) * factor))}, ${Math.min(255, Math.round(b + (255 - b) * factor))})`;
}

export function useRouletteWheel({
  segments,
  participants,
  spinConfig,
  onSpinComplete,
  onSegmentCross,
  onNearStop,
}: UseRouletteWheelOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const currentRotationRef = useRef<number>(0);
  const [isSpinActive, setIsSpinActive] = useState(false);
  const [nearStop, setNearStop] = useState(false);
  const nearStopFiredRef = useRef(false);

  // Refs to keep latest values accessible inside animation loop
  const segmentsRef = useRef<WheelSegment[]>(segments);
  const participantsRef = useRef<Participant[]>(participants);
  const onSpinCompleteRef = useRef(onSpinComplete);
  const onSegmentCrossRef = useRef(onSegmentCross);
  const onNearStopRef = useRef(onNearStop);
  const prevSegmentIndexRef = useRef<number>(-1);
  const lastTickTimeRef = useRef<number>(0);

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

  useEffect(() => {
    onSegmentCrossRef.current = onSegmentCross;
  }, [onSegmentCross]);

  useEffect(() => {
    onNearStopRef.current = onNearStop;
  }, [onNearStop]);

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

    nearStopFiredRef.current = false;
    setNearStop(false);
    setIsSpinActive(true);
    prevSegmentIndexRef.current = -1;
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

    // Number of decorative light dots on the outer ring
    const NUM_LIGHTS = 28;

    // Draw wheel directly inside the effect to avoid stale closure
    const drawWheel = (rotation: number, spinning: boolean, isNearStop: boolean) => {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      const segs = segmentsRef.current;
      const parts = participantsRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;
      const outerRingRadius = radius * 1.12;

      if (segs.length === 0) return;

      // === (a) Outer decorative ring ===
      ctx.save();
      ctx.translate(centerX, centerY);

      // Dark ring background
      ctx.beginPath();
      ctx.arc(0, 0, outerRingRadius, 0, Math.PI * 2);
      ctx.arc(0, 0, radius - 2, 0, Math.PI * 2, true);
      ctx.fillStyle = '#1a1a2e';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Light dots on the ring
      const lightRadius = (outerRingRadius + radius - 2) / 2;
      const dotSize = Math.max(3, radius * 0.035);
      const now = Date.now();

      for (let i = 0; i < NUM_LIGHTS; i++) {
        const angle = (i / NUM_LIGHTS) * Math.PI * 2;
        const x = Math.cos(angle) * lightRadius;
        const y = Math.sin(angle) * lightRadius;

        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);

        if (spinning) {
          // Alternating pattern: chase effect
          const phase = Math.floor(now / 100) % 3;
          const isLit = (i % 3) === phase;
          ctx.fillStyle = isLit ? '#fbbf24' : '#555';
          if (isLit) {
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 8;
          } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.fillStyle = '#c9a032';
          ctx.shadowColor = '#c9a032';
          ctx.shadowBlur = 4;
        }

        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      // Save context for wheel rotation
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // === (b) Draw segments with gradient ===
      const anglePerSegment = (Math.PI * 2) / segs.length;

      segs.forEach((segment, index) => {
        const startAngle = index * anglePerSegment;
        const endAngle = (index + 1) * anglePerSegment;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();

        // Radial gradient for segment
        const grad = ctx.createRadialGradient(0, 0, radius * 0.05, 0, 0, radius);
        grad.addColorStop(0, darkenColor(segment.color, 0.2));
        grad.addColorStop(0.2, darkenColor(segment.color, 0.1));
        grad.addColorStop(0.7, segment.color);
        grad.addColorStop(1, lightenColor(segment.color, 0.1));

        ctx.fillStyle = grad;
        ctx.fill();

        // === (c) Improved borders ===
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Subtle highlight border
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw participant name
        const participant = parts[index];
        if (participant) {
          ctx.save();

          const midAngle = (startAngle + endAngle) / 2;
          const textRadius = radius * 0.68;

          ctx.rotate(midAngle);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Text shadow for readability
          const fontSize = Math.max(14, radius / 8);
          ctx.font = `bold ${fontSize}px Jua, sans-serif`;
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillText(participant.name, textRadius + 1, 1);

          ctx.fillStyle = '#000000';
          ctx.fillText(participant.name, textRadius, 0);

          ctx.restore();
        }
      });

      // Outer circle stroke on the wheel edge
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // === (d) Center circle with gradient + glass highlight ===
      const centerRadius = radius * 0.15;

      // Main gradient
      const centerGrad = ctx.createRadialGradient(
        -centerRadius * 0.3, -centerRadius * 0.3, centerRadius * 0.1,
        0, 0, centerRadius
      );
      centerGrad.addColorStop(0, '#ffffff');
      centerGrad.addColorStop(0.6, '#e8e8e8');
      centerGrad.addColorStop(1, '#b0b0b0');

      ctx.beginPath();
      ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
      ctx.fillStyle = centerGrad;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Glass highlight ellipse
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        -centerRadius * 0.15,
        -centerRadius * 0.25,
        centerRadius * 0.45,
        centerRadius * 0.25,
        -Math.PI / 6,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
      ctx.restore();

      // Restore rotation context
      ctx.restore();

      // === (e) Pointer (triangle at top) — upgraded ===
      ctx.save();
      ctx.translate(centerX, centerY);

      const pointerBase = radius + 2;
      const pointerTip = outerRingRadius + 10;
      const pointerWidth = 18;

      // Shadow
      ctx.beginPath();
      ctx.moveTo(2, -pointerBase + 5);
      ctx.lineTo(-pointerWidth + 2, -pointerTip);
      ctx.lineTo(pointerWidth + 2, -pointerTip);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();

      // Main pointer body
      ctx.beginPath();
      ctx.moveTo(0, -pointerBase + 5);
      ctx.lineTo(-pointerWidth, -pointerTip);
      ctx.lineTo(pointerWidth, -pointerTip);
      ctx.closePath();

      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner highlight
      ctx.beginPath();
      ctx.moveTo(0, -pointerBase + 8);
      ctx.lineTo(-pointerWidth * 0.5, -pointerTip + 4);
      ctx.lineTo(pointerWidth * 0.3, -pointerTip + 4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fill();

      ctx.restore();

      // === (f) NearStop sparkles around pointer ===
      if (isNearStop) {
        ctx.save();
        ctx.translate(centerX, centerY);

        for (let i = 0; i < 5; i++) {
          const t = now / 300 + i * 1.2;
          const sparkleAngle = -Math.PI / 2 + Math.sin(t) * 0.15;
          const sparkleR = outerRingRadius + 8 + Math.cos(t * 1.5) * 6;
          const sx = Math.cos(sparkleAngle + (i - 2) * 0.12) * sparkleR;
          const sy = Math.sin(sparkleAngle + (i - 2) * 0.12) * sparkleR;
          const sparkleSize = 2 + Math.sin(t * 2) * 1.5;
          const sparkleAlpha = 0.5 + Math.sin(t * 3) * 0.5;

          ctx.beginPath();
          ctx.arc(sx, sy, sparkleSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${sparkleAlpha})`;
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.restore();
      }
    };

    // Internal state tracking for the animation loop
    let loopSpinActive = false;
    let loopNearStop = false;

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

        // Segment cross detection for tick sound
        const segs = segmentsRef.current;
        if (segs.length > 0) {
          const anglePerSegment = (Math.PI * 2) / segs.length;
          // Pointer at top = -PI/2; normalize rotation
          const pointerAngle = -Math.PI / 2;
          const effectiveAngle = ((pointerAngle - newRotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          const currentSegIndex = Math.floor(effectiveAngle / anglePerSegment) % segs.length;

          if (prevSegmentIndexRef.current !== -1 && currentSegIndex !== prevSegmentIndexRef.current) {
            // Throttle: max 20 ticks per second
            if (now - lastTickTimeRef.current >= 50) {
              lastTickTimeRef.current = now;
              onSegmentCrossRef.current?.();
            }
          }
          prevSegmentIndexRef.current = currentSegIndex;
        }

        // Near stop detection
        if (progress > 0.85 && !nearStopFiredRef.current) {
          nearStopFiredRef.current = true;
          loopNearStop = true;
          setNearStop(true);
          onNearStopRef.current?.();
        }

        if (!loopSpinActive) {
          loopSpinActive = true;
        }

        if (progress >= 1) {
          state.isSpinning = false;
          loopSpinActive = false;
          loopNearStop = false;
          setIsSpinActive(false);
          setNearStop(false);
          // Delay callback for dramatic effect
          setTimeout(() => {
            onSpinCompleteRef.current();
          }, 1000);
        }
      }

      // Draw wheel every frame
      drawWheel(currentRotationRef.current, loopSpinActive, loopNearStop);
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

  return { canvasRef, isSpinActive, nearStop };
}
