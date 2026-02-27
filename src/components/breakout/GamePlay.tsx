'use client';

import { useRef, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { BLOCK_COLORS } from '@/utils/breakout';
import { BreakoutMode } from '@/types/breakout';

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  color: string;
  alive: boolean;
}

type Props = {
  participants: string[];
  onResult: (name: string, color: string) => void;
  mode: BreakoutMode;
};

const BASE_SPEED = 10;
const SPEED_MIN = 0.5;
const SPEED_MAX = 3;
const SPEED_STEP = 0.1;
const SPEED_DEFAULT = 1;

export default function GamePlay({ participants, onResult, mode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [showStart, setShowStart] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(SPEED_DEFAULT);
  const { t } = useTranslation();

  const stateRef = useRef({
    blocks: [] as Block[],
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

    // Shuffle participant order for random grid placement
    const shuffled = [...participants].sort(() => Math.random() - 0.5);

    // Build blocks — size adapts to name length and participant count
    const total = shuffled.length;
    const half = total >= 50 ? 0.8 : 1;
    const blockH = (total <= 10
      ? Math.min(36, Math.max(26, H * 0.06))
      : Math.min(26, Math.max(18, H * 0.04))) * half;
    const fontSize = Math.min(13, blockH * 0.45);
    ctx.font = `bold ${fontSize}px "Jua", sans-serif`;
    const maxTextW = Math.max(...shuffled.map((n) => ctx.measureText(n).width));
    const nameBasedW = maxTextW + 16;
    const blockW = Math.min(W * 0.4, Math.max(50, nameBasedW)) * half;
    const margin = 6;

    const ballY = H - 20;
    const maxBottom = ballY - 100;
    const positions: { x: number; y: number }[] = [];

    if (total <= 20) {
      // Random non-overlapping placement
      const areaX = margin;
      const areaY = margin;
      const areaW = W - margin * 2 - blockW;
      const areaH = maxBottom - margin - blockH;
      for (let i = 0; i < total; i++) {
        let placed = false;
        for (let attempt = 0; attempt < 500; attempt++) {
          const px = areaX + Math.random() * areaW;
          const py = areaY + Math.random() * areaH;
          const overlaps = positions.some(
            (pos) =>
              px < pos.x + blockW + margin &&
              px + blockW + margin > pos.x &&
              py < pos.y + blockH + margin &&
              py + blockH + margin > pos.y,
          );
          if (!overlaps) {
            positions.push({ x: px, y: py });
            placed = true;
            break;
          }
        }
        if (!placed) {
          positions.push({
            x: margin + (i % 3) * (blockW + margin),
            y: margin + Math.floor(i / 3) * (blockH + margin),
          });
        }
      }
    } else {
      // Grid placement
      const cols = Math.max(1, Math.floor((W - margin) / (blockW + margin)));
      const rows = Math.ceil(total / cols);
      const gridW = cols * (blockW + margin) - margin;
      const gridH = rows * (blockH + margin) - margin;
      const offsetX = (W - gridW) / 2;
      const offsetY = Math.max(margin, Math.min((H * 0.5 - gridH) / 2, maxBottom - gridH));
      for (let i = 0; i < total; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        positions.push({
          x: offsetX + col * (blockW + margin),
          y: offsetY + row * (blockH + margin),
        });
      }
    }

    s.blocks = shuffled.map((name, i) => ({
      x: positions[i].x,
      y: positions[i].y,
      w: blockW,
      h: blockH,
      name,
      color: BLOCK_COLORS[i % BLOCK_COLORS.length],
      alive: true,
    }));

    // Ball (stationary at bottom center until start)
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
      // Rescale current velocity to new multiplier
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

    // Launch ball upward from bottom
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
            1000
          );
        }
        return;
      }
      s.raf = requestAnimationFrame(loop);
    })();
  }

  return (
    <div className="flex flex-col w-full max-w-[600px] mx-auto gap-8">
      <p className="font-game text-center text-sm font-bold text-black/60">
        {t(mode === 'penalty' ? 'breakout.notice.penalty' : 'breakout.notice.winner')}
      </p>
      <div
        ref={wrapRef}
        className="h-[70dvh] relative rounded-2xl overflow-hidden border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
        {showStart && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Button
              onClick={handleStart}
              variant="primary"
              className="text-lg px-8 py-4 lowercase"
            >
              {t('breakout.play')}
            </Button>
          </div>
        )}
      </div>

      {/* Speed slider */}
      <div className="flex items-center gap-3 px-1">
        <span className="font-game text-xs text-black/50 flex-shrink-0">
          {t('breakout.speed')}
        </span>
        <input
          type="range"
          min={SPEED_MIN}
          max={SPEED_MAX}
          step={SPEED_STEP}
          value={speedMultiplier}
          onChange={(e) => handleSpeedChange(Number(e.target.value))}
          className="flex-1 h-2 appearance-none rounded-full bg-black/10 accent-black cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
        />
        <span className="font-game text-xs font-bold text-black/70 w-10 text-right flex-shrink-0">
          x{speedMultiplier.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

/* ── Pure helper functions ─────────────────────────────── */

type GameState = {
  blocks: Block[];
  ball: { x: number; y: number; dx: number; dy: number; r: number };
  W: number;
  H: number;
  running: boolean;
  speedMul: number;
};

function tick(s: GameState) {
  const { W, H, ball, blocks } = s;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collisions — all 4 walls (ball bounces off everything)
  if (ball.x - ball.r < 0) {
    ball.x = ball.r;
    ball.dx = Math.abs(ball.dx);
  }
  if (ball.x + ball.r > W) {
    ball.x = W - ball.r;
    ball.dx = -Math.abs(ball.dx);
  }
  if (ball.y - ball.r < 0) {
    ball.y = ball.r;
    ball.dy = Math.abs(ball.dy);
  }
  if (ball.y + ball.r > H) {
    ball.y = H - ball.r;
    ball.dy = -Math.abs(ball.dy);
    // Add slight random angle change on bottom bounce to avoid loops
    ball.dx += (Math.random() - 0.5) * 0.8;
  }

  // Block collisions
  for (const b of blocks) {
    if (!b.alive) continue;
    if (
      ball.x + ball.r > b.x &&
      ball.x - ball.r < b.x + b.w &&
      ball.y + ball.r > b.y &&
      ball.y - ball.r < b.y + b.h
    ) {
      b.alive = false;

      // Bounce direction
      const ol = ball.x + ball.r - b.x;
      const or_ = b.x + b.w - (ball.x - ball.r);
      const ot = ball.y + ball.r - b.y;
      const ob = b.y + b.h - (ball.y - ball.r);
      const m = Math.min(ol, or_, ot, ob);
      if (m === ot || m === ob) ball.dy = -ball.dy;
      else ball.dx = -ball.dx;

      // Add slight randomness to prevent repetitive patterns
      ball.dx += (Math.random() - 0.5) * 0.3;
      ball.dy += (Math.random() - 0.5) * 0.3;

      // Normalize back to target speed (base * multiplier, with small acceleration)
      const cs = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
      const ns = Math.min(cs * 1.02, BASE_SPEED * s.speedMul * 3);
      ball.dx *= ns / cs;
      ball.dy *= ns / cs;
      break;
    }
  }

  // Safety: ensure ball never gets stuck going perfectly horizontal/vertical
  const minComponent = 1.5 * s.speedMul;
  const spd = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
  if (Math.abs(ball.dy) < minComponent && spd > 0) {
    ball.dy = ball.dy >= 0 ? minComponent : -minComponent;
    const newSpd = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
    ball.dx *= spd / newSpd;
    ball.dy *= spd / newSpd;
  }
  if (Math.abs(ball.dx) < minComponent && spd > 0) {
    ball.dx = ball.dx >= 0 ? minComponent : -minComponent;
    const newSpd = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
    ball.dx *= spd / newSpd;
    ball.dy *= spd / newSpd;
  }
}

function render(ctx: CanvasRenderingContext2D, s: GameState) {
  const { W, H, blocks, ball } = s;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, W, H);

  // Blocks
  for (const b of blocks) {
    if (!b.alive) continue;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(b.x + 3, b.y + 3, b.w, b.h);
    // Body
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    // Border
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    // Text
    ctx.fillStyle = '#000';
    ctx.font = `bold ${Math.min(13, b.h * 0.45)}px "Jua", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let txt = b.name;
    const maxW = b.w - 8;
    if (ctx.measureText(txt).width > maxW) {
      while (ctx.measureText(txt + '…').width > maxW && txt.length > 1)
        txt = txt.slice(0, -1);
      txt += '…';
    }
    ctx.fillText(txt, b.x + b.w / 2, b.y + b.h / 2 + 1);
  }

  // Ball
  ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(255,255,255,0.5)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

}

function highlightWinner(
  ctx: CanvasRenderingContext2D,
  block: Block,
  s: GameState
) {
  render(ctx, s);

  // Glow effect on the winning block
  ctx.shadowColor = block.color;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.strokeRect(block.x - 2, block.y - 2, block.w + 4, block.h + 4);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}
