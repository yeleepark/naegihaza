import type { Block, EngineState } from '@/types/breakout';
import { BLOCK_COLORS } from '@/utils/breakout';

/* ── Constants ────────────────────────────────────────── */

export const BASE_SPEED = 10;
export const SPEED_MIN = 0.5;
export const SPEED_MAX = 3;
export const SPEED_STEP = 0.1;
export const SPEED_DEFAULT = 1;

/* ── Block layout ─────────────────────────────────────── */

export function buildBlocks(
  participants: string[],
  W: number,
  H: number,
  ctx: CanvasRenderingContext2D,
): Block[] {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);

  const total = shuffled.length;
  const half = total >= 50 ? 0.8 : 1;
  const blockH =
    (total <= 10
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
    const cols = Math.max(1, Math.floor((W - margin) / (blockW + margin)));
    const rows = Math.ceil(total / cols);
    const gridW = cols * (blockW + margin) - margin;
    const gridH = rows * (blockH + margin) - margin;
    const offsetX = (W - gridW) / 2;
    const offsetY = Math.max(
      margin,
      Math.min((H * 0.5 - gridH) / 2, maxBottom - gridH),
    );
    for (let i = 0; i < total; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions.push({
        x: offsetX + col * (blockW + margin),
        y: offsetY + row * (blockH + margin),
      });
    }
  }

  return shuffled.map((name, i) => ({
    x: positions[i].x,
    y: positions[i].y,
    w: blockW,
    h: blockH,
    name,
    color: BLOCK_COLORS[i % BLOCK_COLORS.length],
    alive: true,
  }));
}

/* ── Physics tick ──────────────────────────────────────── */

export function tick(s: EngineState) {
  const { W, H, ball, blocks } = s;

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collisions
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

      const ol = ball.x + ball.r - b.x;
      const or_ = b.x + b.w - (ball.x - ball.r);
      const ot = ball.y + ball.r - b.y;
      const ob = b.y + b.h - (ball.y - ball.r);
      const m = Math.min(ol, or_, ot, ob);
      if (m === ot || m === ob) ball.dy = -ball.dy;
      else ball.dx = -ball.dx;

      ball.dx += (Math.random() - 0.5) * 0.3;
      ball.dy += (Math.random() - 0.5) * 0.3;

      const cs = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
      const ns = Math.min(cs * 1.02, BASE_SPEED * s.speedMul * 3);
      ball.dx *= ns / cs;
      ball.dy *= ns / cs;
      break;
    }
  }

  // Prevent perfectly horizontal/vertical movement
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

/* ── Rendering ────────────────────────────────────────── */

export function render(ctx: CanvasRenderingContext2D, s: EngineState) {
  const { W, H, blocks, ball } = s;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, W, H);

  // Blocks
  for (const b of blocks) {
    if (!b.alive) continue;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(b.x + 3, b.y + 3, b.w, b.h);
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
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

export function highlightWinner(
  ctx: CanvasRenderingContext2D,
  block: Block,
  s: EngineState,
) {
  render(ctx, s);

  ctx.shadowColor = block.color;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.strokeRect(block.x - 2, block.y - 2, block.w + 4, block.h + 4);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}
