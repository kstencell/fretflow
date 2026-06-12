// Full guitar neck SVG with optional chord dot overlay.
// orientation='landscape': nut left, low E bottom (looking down the neck).
// orientation='portrait':  nut top,  low E left  (chord-chart style).
// Both use the same geometry constants; x/y helpers swap the axes for portrait.

import type { PlacedShape } from '../theory/types';

const STRING_COUNT = 6;

// Gauge index 0 = low E (thickest), index 5 = high e (thinnest)
const STRING_GAUGES = [3.2, 2.6, 2.0, 1.5, 1.1, 0.7];

const INLAY_FRETS = [3, 5, 7, 9];
const DOUBLE_INLAY_FRET = 12;
const LABEL_FRETS = [3, 5, 7, 9, 12];

// Layout (all in viewBox units)
const STRING_SPACING = 26;  // between adjacent strings
const FRET_SPACING = 62;    // between frets (equal spacing — fine for this use case)
const NUT_W = 8;            // nut bar thickness
const SIDE_PAD = 16;        // padding at the nut/head end
const FAR_PAD = 16;         // padding at the high-fret end
const EDGE_PAD = 16;        // padding perpendicular to strings (top/bottom in landscape)
const LABEL_GAP = 22;       // space reserved for fret number labels

const INLAY_R = 4.5;

// Colors
const FRET_COLOR = '#9E9C96';
const STRING_COLOR = '#C8C8C4';
const NUT_COLOR = '#F0E5B8';
const INLAY_COLOR = '#BFA882';
const LABEL_COLOR = '#9A7050';

// Chord dot appearance
const DOT_R = 7;
const ACTIVE_FILL = '#4ade80';    // green-400
const ACTIVE_ROOT_RING = '#3b82f6'; // blue-500
const INACTIVE_FILL = '#64748b';  // slate-500

interface ChordLabel {
  numeral: string;
  name: string;
}

interface Props {
  fretCount?: number;
  orientation?: 'landscape' | 'portrait';
  placements?: (PlacedShape | null)[];
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  chordLabels?: ChordLabel[];
  className?: string;
}

export function FullNeckDiagram({
  fretCount = 12,
  orientation = 'landscape',
  placements = [],
  activeIndex = 0,
  onActiveChange,
  chordLabels = [],
  className,
}: Props) {
  const L = orientation === 'landscape';

  const stringArea = (STRING_COUNT - 1) * STRING_SPACING; // 130 — distance from low E to high e
  const fretArea = fretCount * FRET_SPACING;              // 744

  // viewBox dimensions
  const mainTotal = SIDE_PAD + NUT_W + fretArea + FAR_PAD;       // 784 — along the neck
  const crossTotal = EDGE_PAD + stringArea + EDGE_PAD + LABEL_GAP; // 184 — across the neck

  const vw = L ? mainTotal : crossTotal;
  const vh = L ? crossTotal : mainTotal;

  // Project (main, cross) → SVG (x, y).
  // "main" = position along the neck (fret direction).
  // "cross" = position across the neck (string direction).
  const px = (main: number, cross: number) => (L ? main : cross);
  const py = (main: number, cross: number) => (L ? cross : main);

  // Main-axis coordinate of fret line i (i=1 = first fret wire after nut)
  const fretMain = (i: number) => SIDE_PAD + NUT_W + i * FRET_SPACING;

  // Cross-axis coordinate of string i.
  // i=0 = low E: at bottom in landscape (large cross) or left in portrait (small cross).
  const stringCross = (i: number) =>
    EDGE_PAD + (L ? (STRING_COUNT - 1 - i) : i) * STRING_SPACING;

  const nutStartMain = SIDE_PAD;
  const neckEndMain = SIDE_PAD + NUT_W + fretArea; // right/bottom edge of last fret

  // Label sits past the far edge of the string area
  const labelCross = EDGE_PAD + stringArea + EDGE_PAD + 10;

  // Dot coordinate helpers.
  // Fret 0 = open: dot sits at the centre of the nut bar.
  // Fret n > 0: dot sits at the centre of fret cell n (between wire n-1 and wire n).
  const dotMain = (fret: number) =>
    fret === 0
      ? SIDE_PAD + NUT_W / 2
      : SIDE_PAD + NUT_W + (fret - 0.5) * FRET_SPACING;

  // Strings in PlacedShape are 1-indexed (1 = low E); convert to 0-indexed for stringCross.
  const dotCross = (string: number) => stringCross(string - 1);

  // Gradient crosses the neck (perpendicular to strings) for a subtle edge-lighting effect.
  // Need separate IDs because objectBoundingBox direction differs per orientation.
  const gradId = L ? 'fboard-wood-ls' : 'fboard-wood-pt';
  const gradX2 = L ? '0' : '1';
  const gradY2 = L ? '1' : '0';

  // Fretboard rect coords
  const fbX = px(nutStartMain, EDGE_PAD);
  const fbY = py(nutStartMain, EDGE_PAD);
  const fbW = L ? NUT_W + fretArea + FAR_PAD : stringArea;
  const fbH = L ? stringArea : NUT_W + fretArea + FAR_PAD;

  // Nut rect coords (sits at the head end of the fretboard rect)
  const nutW = L ? NUT_W : stringArea;
  const nutH = L ? stringArea : NUT_W;

  return (
  <div className={`flex flex-col ${L ? '' : 'items-center'} ${className ?? ''}`}>
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      style={L
        ? { width: '100%', display: 'block' }
        : { maxHeight: '72vh', width: 'auto', display: 'block' }}
      aria-label={`Guitar neck — ${orientation}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2={gradX2} y2={gradY2}>
          <stop offset="0%"   stopColor="#7A4828" />
          <stop offset="30%"  stopColor="#4E2810" />
          <stop offset="70%"  stopColor="#4E2810" />
          <stop offset="100%" stopColor="#7A4828" />
        </linearGradient>
      </defs>

      {/* Fretboard wood — includes the nut zone and extends to FAR_PAD */}
      <rect
        x={fbX} y={fbY}
        width={fbW} height={fbH}
        fill={`url(#${gradId})`}
        rx={4}
      />

      {/* Single inlay dots (frets 3, 5, 7, 9) */}
      {INLAY_FRETS.filter(f => f <= fretCount).map(f => {
        const main = SIDE_PAD + NUT_W + (f - 0.5) * FRET_SPACING;
        const cross = EDGE_PAD + stringArea / 2;
        return (
          <circle
            key={f}
            cx={px(main, cross)} cy={py(main, cross)}
            r={INLAY_R}
            fill={INLAY_COLOR}
            opacity={0.75}
          />
        );
      })}

      {/* Double inlay at fret 12 */}
      {DOUBLE_INLAY_FRET <= fretCount && [1 / 3, 2 / 3].map((t, i) => {
        const main = SIDE_PAD + NUT_W + (DOUBLE_INLAY_FRET - 0.5) * FRET_SPACING;
        const cross = EDGE_PAD + t * stringArea;
        return (
          <circle
            key={i}
            cx={px(main, cross)} cy={py(main, cross)}
            r={INLAY_R}
            fill={INLAY_COLOR}
            opacity={0.75}
          />
        );
      })}

      {/* Fret wires */}
      {Array.from({ length: fretCount }, (_, i) => {
        const main = fretMain(i + 1);
        return (
          <line
            key={i}
            x1={px(main, EDGE_PAD)}     y1={py(main, EDGE_PAD)}
            x2={px(main, EDGE_PAD + stringArea)} y2={py(main, EDGE_PAD + stringArea)}
            stroke={FRET_COLOR}
            strokeWidth={1.5}
          />
        );
      })}

      {/* Nut bar — drawn over the wood so it reads as a distinct material */}
      <rect
        x={px(nutStartMain, EDGE_PAD)}
        y={py(nutStartMain, EDGE_PAD)}
        width={nutW} height={nutH}
        fill={NUT_COLOR}
        rx={1}
      />

      {/* Strings — varying gauge, low E thickest */}
      {STRING_GAUGES.map((gauge, i) => {
        const cross = stringCross(i);
        return (
          <line
            key={i}
            x1={px(nutStartMain, cross)} y1={py(nutStartMain, cross)}
            x2={px(neckEndMain,  cross)} y2={py(neckEndMain,  cross)}
            stroke={STRING_COLOR}
            strokeWidth={gauge}
          />
        );
      })}

      {/* Chord dots — inactive chords first so active chord renders on top */}
      {placements.map((ps, chordIdx) => {
        if (!ps || chordIdx === activeIndex) return null;
        return ps.positions
          .filter(pos => pos.fret <= fretCount)
          .map(pos => {
            const main = dotMain(pos.fret);
            const cross = dotCross(pos.string);
            return (
              <circle
                key={`inactive-${chordIdx}-${pos.string}-${pos.fret}`}
                cx={px(main, cross)} cy={py(main, cross)}
                r={DOT_R}
                fill={INACTIVE_FILL}
                opacity={0.45}
              />
            );
          });
      })}

      {/* Active chord dots — green fill, blue ring on roots */}
      {(() => {
        const ps = placements[activeIndex];
        if (!ps) return null;
        return ps.positions
          .filter(pos => pos.fret <= fretCount)
          .map(pos => {
            const main = dotMain(pos.fret);
            const cross = dotCross(pos.string);
            return (
              <g key={`active-${pos.string}-${pos.fret}`}>
                <circle
                  cx={px(main, cross)} cy={py(main, cross)}
                  r={DOT_R}
                  fill={ACTIVE_FILL}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth={1}
                />
                {pos.role === 'root' && (
                  <circle
                    cx={px(main, cross)} cy={py(main, cross)}
                    r={DOT_R + 3.5}
                    fill="none"
                    stroke={ACTIVE_ROOT_RING}
                    strokeWidth={2.5}
                  />
                )}
              </g>
            );
          });
      })()}

      {/* Fret position labels */}
      {LABEL_FRETS.filter(f => f <= fretCount).map(f => {
        const main = SIDE_PAD + NUT_W + (f - 0.5) * FRET_SPACING;
        return (
          <text
            key={f}
            x={px(main, labelCross)}
            y={py(main, labelCross)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill={LABEL_COLOR}
            fontFamily="sans-serif"
          >
            {f}
          </text>
        );
      })}
    </svg>

    {/* Chord selector buttons */}
    {chordLabels.length > 0 && (
      <div className="flex gap-2 justify-center flex-wrap mt-4">
        {chordLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => onActiveChange?.(i)}
            className={[
              'px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150',
              i === activeIndex
                ? 'bg-green-400 text-slate-900 shadow-md shadow-green-400/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200',
            ].join(' ')}
          >
            <span className="font-mono text-xs mr-2 opacity-70">{label.numeral}</span>
            {label.name}
          </button>
        ))}
      </div>
    )}
  </div>
  );
}
