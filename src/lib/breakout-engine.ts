import type { Block, EngineState, Particle } from '@/types/breakout';
import { BLOCK_COLORS } from '@/utils/breakout';

/* ── Constants ────────────────────────────────────────── */

export const BASE_SPEED = 10;
export const SPEED_MIN = 0.5;
export const SPEED_MAX = 2;
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

  // Expand: each participant gets multiple bricks when few participants
  const bricksPerPerson = Math.max(1, Math.ceil(20 / shuffled.length));
  const expanded: { name: string; participantIndex: number }[] = [];
  for (let i = 0; i < shuffled.length; i++) {
    for (let j = 0; j < bricksPerPerson; j++) {
      expanded.push({ name: shuffled[i], participantIndex: i });
    }
  }
  // Shuffle expanded array so same-participant bricks are spread out
  expanded.sort(() => Math.random() - 0.5);

  const total = expanded.length;
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

  const cols = Math.max(1, Math.floor((W - margin) / (blockW + margin)));
  const rows = Math.ceil(total / cols);
  const gridW = cols * (blockW + margin) - margin;
  const gridH = rows * (blockH + margin) - margin;
  const offsetX = (W - gridW) / 2;
  const offsetY = margin;
  for (let i = 0; i < total; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      x: offsetX + col * (blockW + margin),
      y: offsetY + row * (blockH + margin),
    });
  }

  return expanded.map(({ name, participantIndex }, i) => ({
    x: positions[i].x,
    y: positions[i].y,
    w: blockW,
    h: blockH,
    name,
    color: BLOCK_COLORS[participantIndex % BLOCK_COLORS.length],
    alive: true,
  }));
}

/* ── Stars ───────────────────────────────────────────── */

export function initStars(W: number, H: number) {
  const count = 60 + Math.floor(Math.random() * 20);
  return Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.random() * 2 + 0.5,
    brightness: Math.random(),
  }));
}

/* ── Particle system ─────────────────────────────────── */

export function spawnParticles(state: EngineState, block: Block) {
  const count = 8 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 4;
    const p: Particle = {
      x: block.x + block.w / 2,
      y: block.y + block.h / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 4,
      color: block.color,
      life: 1,
      maxLife: 1,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
    };
    state.particles.push(p);
  }
}

export function updateParticles(state: EngineState) {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15; // gravity
    p.rotation += p.rotSpeed;
    p.life -= 0.02;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }
}

/* ── Trail system ────────────────────────────────────── */

export function updateTrail(state: EngineState) {
  state.trail.unshift({ x: state.ball.x, y: state.ball.y, age: 0 });
  for (let i = state.trail.length - 1; i >= 0; i--) {
    state.trail[i].age++;
    if (state.trail[i].age > 12) {
      state.trail.splice(i, 1);
    }
  }
}

/* ── Physics tick ──────────────────────────────────────── */

export interface TickResult {
  blockHit: Block | null;
  wallHit: boolean;
}

export function tick(s: EngineState): TickResult {
  const { W, H, ball, blocks } = s;

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collisions
  let wallHit = false;
  if (ball.x - ball.r < 0) {
    ball.x = ball.r;
    ball.dx = Math.abs(ball.dx);
    wallHit = true;
  }
  if (ball.x + ball.r > W) {
    ball.x = W - ball.r;
    ball.dx = -Math.abs(ball.dx);
    wallHit = true;
  }
  if (ball.y - ball.r < 0) {
    ball.y = ball.r;
    ball.dy = Math.abs(ball.dy);
    wallHit = true;
  }
  if (ball.y + ball.r > H) {
    ball.y = H - ball.r;
    ball.dy = -Math.abs(ball.dy);
    ball.dx += (Math.random() - 0.5) * 0.8;
    wallHit = true;
  }

  // Block collisions
  let hitBlock: Block | null = null;
  for (const b of blocks) {
    if (!b.alive) continue;
    if (
      ball.x + ball.r > b.x &&
      ball.x - ball.r < b.x + b.w &&
      ball.y + ball.r > b.y &&
      ball.y - ball.r < b.y + b.h
    ) {
      b.alive = false;
      hitBlock = b;

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

  return { blockHit: hitBlock, wallHit };
}

/* ── Rendering ────────────────────────────────────────── */

export function render(ctx: CanvasRenderingContext2D, s: EngineState) {
  const { W, H, blocks, ball } = s;
  ctx.clearRect(0, 0, W, H);

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#0a0f2e');
  bgGrad.addColorStop(1, '#16213e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Grid overlay
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx < W; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, H);
    ctx.stroke();
  }
  for (let gy = 0; gy < H; gy += 40) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();
  }

  // Stars
  for (const star of s.stars) {
    const twinkle = 0.4 + 0.6 * Math.sin(s.frameCount * 0.03 + star.brightness * 10);
    ctx.fillStyle = `rgba(255,255,255,${twinkle * 0.7})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Blocks (flat style)
  for (const b of blocks) {
    if (!b.alive) continue;

    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);

    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);

    // Text
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = `bold ${Math.min(13, b.h * 0.45)}px "Jua", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let txt = b.name;
    const maxW = b.w - 8;
    if (ctx.measureText(txt).width > maxW) {
      while (ctx.measureText(txt + '\u2026').width > maxW && txt.length > 1)
        txt = txt.slice(0, -1);
      txt += '\u2026';
    }
    ctx.fillText(txt, b.x + b.w / 2, b.y + b.h / 2 + 1);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // Particles
  for (const p of s.particles) {
    const alpha = p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  }

  // Ball comet trail
  for (let i = s.trail.length - 1; i >= 0; i--) {
    const t = s.trail[i];
    const progress = 1 - t.age / 12;
    const radius = ball.r * progress * 0.8;
    const alpha = progress * 0.5;
    if (radius > 0.5) {
      ctx.fillStyle = `rgba(255,200,100,${alpha})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ball with warm orange glow
  ctx.shadowColor = 'rgba(255,180,50,0.6)';
  ctx.shadowBlur = 16;
  const ballGrad = ctx.createRadialGradient(
    ball.x - ball.r * 0.3,
    ball.y - ball.r * 0.3,
    ball.r * 0.1,
    ball.x,
    ball.y,
    ball.r,
  );
  ballGrad.addColorStop(0, '#fff');
  ballGrad.addColorStop(0.6, '#ffd080');
  ballGrad.addColorStop(1, '#ffb040');
  ctx.fillStyle = ballGrad;
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

  // Pulsing glow based on frameCount
  const pulse = Math.sin(s.frameCount * 0.1) * 0.5 + 0.5;
  const glowSize = 15 + pulse * 15;
  const expand = pulse * 4;

  ctx.shadowColor = block.color;
  ctx.shadowBlur = glowSize;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3 + pulse * 2;
  ctx.strokeRect(
    block.x - 2 - expand,
    block.y - 2 - expand,
    block.w + 4 + expand * 2,
    block.h + 4 + expand * 2,
  );
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

}
