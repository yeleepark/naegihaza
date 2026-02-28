import { useRef, useEffect, useState } from 'react';
import type { EngineState } from '@/types/breakout';
import {
  BASE_SPEED,
  SPEED_DEFAULT,
  buildBlocks,
  tick,
  render,
  highlightWinner,
} from '@/lib/breakout-engine';

export function useBreakoutEngine(
  participants: string[],
  onResult: (name: string, color: string) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [showStart, setShowStart] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(SPEED_DEFAULT);

  const stateRef = useRef<EngineState>({
    blocks: [],
    ball: { x: 0, y: 0, dx: 0, dy: 0, r: 7 },
    W: 0,
    H: 0,
    running: false,
    raf: 0,
    speedMul: SPEED_DEFAULT,
  });

  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

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
      tick(s);
      render(ctx, s);

      const alive = s.blocks.filter((b) => b.alive);
      if (alive.length <= 1) {
        s.running = false;
        if (alive.length === 1) {
          highlightWinner(ctx, alive[0], s);
          setTimeout(
            () => onResultRef.current(alive[0].name, alive[0].color),
            1000,
          );
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
