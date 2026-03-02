import { useRef, useEffect, useState } from 'react';
import type { EngineState } from '@/types/breakout';
import {
  BASE_SPEED,
  SPEED_DEFAULT,
  buildBlocks,
  tick,
  render,
  highlightWinner,
  initStars,
  spawnParticles,
  updateParticles,
  updateTrail,
} from '@/lib/breakout-engine';

interface BreakoutCallbacks {
  onResult: (name: string, color: string) => void;
  onBlockHit?: () => void;
  onWallHit?: () => void;
  onGameEnd?: () => void;
}

export function useBreakoutEngine(
  participants: string[],
  callbacks: BreakoutCallbacks,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [showStart, setShowStart] = useState(true);
  const defaultSpeed =
    typeof window !== 'undefined' && window.innerWidth < 768
      ? SPEED_DEFAULT * 0.6
      : SPEED_DEFAULT;
  const [speedMultiplier, setSpeedMultiplier] = useState(defaultSpeed);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stateRef = useRef<EngineState>({
    blocks: [],
    ball: { x: 0, y: 0, dx: 0, dy: 0, r: 7 },
    W: 0,
    H: 0,
    running: false,
    raf: 0,
    speedMul: defaultSpeed,
    particles: [],
    trail: [],
    frameCount: 0,
    stars: [],
  });

  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  function triggerShake() {
    const wrap = wrapRef.current;
    if (!wrap || shakeTimeoutRef.current) return;
    wrap.classList.add('animate-breakout-shake');
    shakeTimeoutRef.current = setTimeout(() => {
      wrap.classList.remove('animate-breakout-shake');
      shakeTimeoutRef.current = null;
    }, 150);
  }

  useEffect(() => {
    const cvs = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cvs || !wrap) return;

    const dpr = window.devicePixelRatio || 1;
    const { width: cw, height: ch } = wrap.getBoundingClientRect();
    const W = Math.floor(cw);
    const H = Math.floor(ch);
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    cvs.style.width = `${W}px`;
    cvs.style.height = `${H}px`;
    const ctx = cvs.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const s = stateRef.current;
    s.W = W;
    s.H = H;
    s.particles = [];
    s.trail = [];
    s.frameCount = 0;
    s.stars = initStars(W, H);

    s.blocks = buildBlocks(participants, W, H, ctx);
    s.ball = { x: W / 2, y: H - 20, dx: 0, dy: 0, r: 7 };

    render(ctx, s);

    return () => {
      cancelAnimationFrame(s.raf);
      s.running = false;
    };
  }, [participants]);

  function handleSpeedChange(val: number) {
    setSpeedMultiplier(val);
    const s = stateRef.current;
    if (s.running) {
      const curSpd = Math.sqrt(s.ball.dx ** 2 + s.ball.dy ** 2);
      if (curSpd > 0) {
        const newSpd = BASE_SPEED * val;
        const ratio = newSpd / curSpd;
        s.ball.dx *= ratio;
        s.ball.dy *= ratio;
      }
    }
    s.speedMul = val;
  }

  function handleStart() {
    setShowStart(false);
    const s = stateRef.current;
    s.running = true;

    const spd = BASE_SPEED * s.speedMul;
    const ang = ((Math.random() * 60 + 60) * Math.PI) / 180;
    s.ball.x = s.W / 2;
    s.ball.y = s.H - 20;
    s.ball.dx = Math.cos(ang) * spd * (Math.random() > 0.5 ? 1 : -1);
    s.ball.dy = -Math.abs(Math.sin(ang) * spd);

    const cvs = canvasRef.current!;
    const ctx = cvs.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    (function loop() {
      if (!s.running) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      s.frameCount++;
      const { blockHit, wallHit } = tick(s);

      if (blockHit) {
        spawnParticles(s, blockHit);
        triggerShake();
        callbacksRef.current.onBlockHit?.();
      }
      if (wallHit) {
        callbacksRef.current.onWallHit?.();
      }

      updateParticles(s);
      updateTrail(s);
      render(ctx, s);

      const alive = s.blocks.filter((b) => b.alive);
      if (alive.length <= 1) {
        s.running = false;
        if (alive.length === 1) {
          callbacksRef.current.onGameEnd?.();

          // Winner highlight animation loop (60 frames)
          let frame = 0;
          (function highlightLoop() {
            if (frame >= 60) {
              callbacksRef.current.onResult(alive[0].name, alive[0].color);
              return;
            }
            s.frameCount++;
            updateParticles(s);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            highlightWinner(ctx, alive[0], s);
            frame++;
            requestAnimationFrame(highlightLoop);
          })();
        }
        return;
      }
      s.raf = requestAnimationFrame(loop);
    })();
  }

  return {
    canvasRef,
    wrapRef,
    showStart,
    speedMultiplier,
    handleStart,
    handleSpeedChange,
  };
}
