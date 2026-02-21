'use client';

import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { LADDER_COLORS, LADDER_ROWS, getPathPoints } from '@/utils/ladder';
import type { LadderData } from '@/types/ladder';

// ── Layout constants (SVG coordinate space) ───────────────────────
const PADDING_X   = 56;
const CELL_WIDTH  = 88;
const PADDING_TOP = 72;
const ROW_HEIGHT  = 50;
const PADDING_BOT = 72;

// ── Label constants ───────────────────────────────────────────────
const LBL_W      = 76;
const LBL_H      = 36;
const LBL_RX     = 4;
const LBL_SHADOW = 4;

// ── Line weights ──────────────────────────────────────────────────
const RAIL_W     = 5;
const BAR_W      = 5;
const PATH_OUTER = 13;
const PATH_INNER = 7;

const SVG_HEIGHT = PADDING_TOP + LADDER_ROWS * ROW_HEIGHT + PADDING_BOT;

type LadderSceneProps = {
  participants: string[];
  resultItems:  string[];
  ladder:        LadderData;
  revealedPaths: Set<number>;
  onReveal:      (startCol: number) => void;
  onRevealAll:   () => void;
  onShowResult:  () => void;
};

function truncate(name: string, max = 6) {
  return name.length > max ? name.slice(0, max) + '…' : name;
}

function Label({
  cx, cy, label, fill, textFill = 'black', onClick, cursor = 'default',
}: {
  cx: number; cy: number; label: string; fill: string;
  textFill?: string; onClick?: () => void; cursor?: string;
}) {
  const x = cx - LBL_W / 2;
  const y = cy - LBL_H / 2;
  return (
    <g onClick={onClick} style={{ cursor }}>
      <rect
        x={x + LBL_SHADOW} y={y + LBL_SHADOW}
        width={LBL_W} height={LBL_H} rx={LBL_RX}
        fill="black"
      />
      <rect
        x={x} y={y}
        width={LBL_W} height={LBL_H} rx={LBL_RX}
        fill={fill} stroke="black" strokeWidth="2.5"
      />
      <text
        x={cx} y={cy}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="12" fontWeight="900"
        fill={textFill} fontFamily="inherit"
      >
        {truncate(label)}
      </text>
    </g>
  );
}

export default function LadderScene({
  participants, resultItems, ladder,
  revealedPaths, onReveal, onRevealAll, onShowResult,
}: LadderSceneProps) {
  const { t } = useTranslation();
  const { n, bars, resultMap } = ladder;
  const allRevealed = revealedPaths.size === n;

  const invertedMap: Record<number, number> = {};
  resultMap.forEach((endCol, startCol) => { invertedMap[endCol] = startCol; });

  const svgWidth  = PADDING_X * 2 + (n - 1) * CELL_WIDTH;
  const colX      = (c: number) => PADDING_X + c * CELL_WIDTH;
  const barY      = (r: number) => PADDING_TOP + r * ROW_HEIGHT + ROW_HEIGHT / 2;
  const ladderTop = PADDING_TOP;
  const ladderBot = PADDING_TOP + LADDER_ROWS * ROW_HEIGHT;

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {!allRevealed && (
        <p className="font-game text-sm font-black text-black/50 tracking-wide">
          {t('ladder.game.clickHint')}
        </p>
      )}

      {/* SVG 카드: 가로 스크롤 허용, 세로는 뷰포트에 맞게 스케일 */}
      <div className="overflow-x-auto w-full">
        <div className="w-fit mx-auto bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <style>{`
            @keyframes drawLadderPath {
              from { stroke-dashoffset: 1; }
              to   { stroke-dashoffset: 0; }
            }
          `}</style>
          {/*
            viewBox로 내부 좌표계를 유지하면서,
            CSS height를 뷰포트 기반으로 제한 → width는 auto로 비율 유지
          */}
          <svg
            viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT}`}
            style={{
              display: 'block',
              height: `min(${SVG_HEIGHT}px, calc(100vh - 280px))`,
              width: 'auto',
              minWidth: 160,
            }}
          >

            {/* ── Vertical rails ── */}
            {Array.from({ length: n }, (_, i) => (
              <line
                key={`vline-${i}`}
                x1={colX(i)} y1={ladderTop}
                x2={colX(i)} y2={ladderBot}
                stroke="#111" strokeWidth={RAIL_W} strokeLinecap="round"
              />
            ))}

            {/* ── Horizontal bars ── */}
            {bars.map((bar, idx) => (
              <line
                key={`bar-${idx}`}
                x1={colX(bar.col)}     y1={barY(bar.row)}
                x2={colX(bar.col + 1)} y2={barY(bar.row)}
                stroke="#111" strokeWidth={BAR_W} strokeLinecap="round"
              />
            ))}

            {/* ── Paths: black outline + colour ── */}
            {Array.from(revealedPaths).map((startCol) => {
              const pts = getPathPoints(
                startCol, bars, LADDER_ROWS,
                CELL_WIDTH, ROW_HEIGHT, PADDING_X, PADDING_TOP,
              );
              const ptStr = pts.map((p) => `${p.x},${p.y}`).join(' ');
              const anim  = 'drawLadderPath 1.4s ease-in-out forwards';
              return (
                <g key={`path-${startCol}`}>
                  <polyline
                    points={ptStr} pathLength="1"
                    stroke="black" strokeWidth={PATH_OUTER}
                    fill="none" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="1" strokeDashoffset="1"
                    style={{ animation: anim }}
                  />
                  <polyline
                    points={ptStr} pathLength="1"
                    stroke={LADDER_COLORS[startCol]} strokeWidth={PATH_INNER}
                    fill="none" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="1" strokeDashoffset="1"
                    style={{ animation: anim }}
                  />
                </g>
              );
            })}

            {/* ── Name labels (top) ── */}
            {participants.map((name, i) => {
              const revealed = revealedPaths.has(i);
              return (
                <Label
                  key={`name-${i}`}
                  cx={colX(i)}
                  cy={ladderTop - LBL_H / 2 - 4}
                  label={name}
                  fill={revealed ? LADDER_COLORS[i] : 'white'}
                  onClick={() => !revealed && onReveal(i)}
                  cursor={revealed ? 'default' : 'pointer'}
                />
              );
            })}

            {/* ── Result labels (bottom) ── */}
            {Array.from({ length: n }, (_, endCol) => {
              const startCol = invertedMap[endCol];
              const revealed = revealedPaths.has(startCol);
              return (
                <Label
                  key={`result-${endCol}`}
                  cx={colX(endCol)}
                  cy={ladderBot + LBL_H / 2 + 4}
                  label={revealed ? (resultItems[endCol] ?? '') : '?'}
                  fill={revealed ? LADDER_COLORS[startCol] : '#111'}
                  textFill={revealed ? 'black' : '#555'}
                />
              );
            })}

          </svg>
        </div>
      </div>

      {/* ── Buttons ── */}
      <div className="flex gap-3 flex-wrap justify-center">
        {!allRevealed && (
          <Button onClick={onRevealAll} variant="primary">
            {t('ladder.game.revealAll')}
          </Button>
        )}
        {allRevealed && (
          <Button onClick={onShowResult} variant="primary">
            {t('ladder.game.seeResult')}
          </Button>
        )}
      </div>

    </div>
  );
}
