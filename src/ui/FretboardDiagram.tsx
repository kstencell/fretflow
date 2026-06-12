import type { PlacedShape, ChordToneRole } from '../theory/types';

// Horizontal layout: nut on the left, string 1 (low E) at the bottom, string 6 (high e) at the top.
// Mirrors looking down at the neck while holding the guitar.
// Open-string notes sit ON the nut bar — no extra "before-nut" zone.

const FRET_SPACING = 30;
const STRING_SPACING = 24;
const NUT_X = 18;      // x of nut line (or first fret wire for non-open shapes)
const PAD_RIGHT = 14;
const PAD_TOP = 10;
const PAD_BOTTOM = 20;
const DOT_R = 8;
const NUT_W = 4;
const FRETS_MIN = 4;

const ROLE_COLORS: Record<ChordToneRole, { fill: string; text: string }> = {
  root:  { fill: '#f59e0b', text: '#1c1917' }, // amber-400 / stone-900
  third: { fill: '#818cf8', text: '#ffffff' }, // indigo-400 / white
  fifth: { fill: '#334155', text: '#cbd5e1' }, // slate-700 / slate-300
};

interface Props {
  placedShape: PlacedShape;
}

export function FretboardDiagram({ placedShape }: Props) {
  const { chord, shape, positions } = placedShape;

  const nonOpenFrets = positions.filter(p => p.fret > 0).map(p => p.fret);
  const hasOpen = positions.some(p => p.fret === 0);

  const displayStart = hasOpen || nonOpenFrets.length === 0
    ? 0
    : Math.min(...nonOpenFrets);
  const maxFret = positions.length > 0 ? Math.max(...positions.map(p => p.fret)) : 0;

  const fretsShown = displayStart === 0
    ? Math.max(FRETS_MIN, maxFret)
    : Math.max(FRETS_MIN, maxFret - displayStart + 1);

  const svgW = NUT_X + fretsShown * FRET_SPACING + PAD_RIGHT;
  const svgH = PAD_TOP + 5 * STRING_SPACING + PAD_BOTTOM;
  const showNut = displayStart === 0;

  // String 6 (high e) at top, string 1 (low E) at bottom
  const sy = (s: number) => PAD_TOP + (6 - s) * STRING_SPACING;

  const fx = (f: number): number => {
    if (f === 0) return NUT_X; // open string — on the nut
    const cell = showNut ? f - 1 : f - displayStart;
    return NUT_X + (cell + 0.5) * FRET_SPACING;
  };

  const positionedStrings = new Set(positions.map(p => p.string));

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm font-semibold text-white tracking-wide">
        {chord.root.name}{' '}
        <span className="text-zinc-400 font-normal">{chord.quality}</span>
      </span>
      <span className="text-[11px] text-zinc-600 font-mono">{shape.name} shape</span>

      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        {/* Fretboard background */}
        <rect
          x={NUT_X}
          y={PAD_TOP}
          width={fretsShown * FRET_SPACING}
          height={5 * STRING_SPACING}
          fill="#1e293b"
          rx={2}
        />

        {/* Nut — vertical bar on the left */}
        {showNut && (
          <rect
            x={NUT_X - NUT_W / 2}
            y={PAD_TOP}
            width={NUT_W}
            height={5 * STRING_SPACING}
            rx={1}
            fill="#94a3b8"
          />
        )}

        {/* Fret wires — vertical lines */}
        {Array.from({ length: fretsShown + 1 }, (_, i) => (
          <line
            key={i}
            x1={NUT_X + i * FRET_SPACING}
            y1={PAD_TOP}
            x2={NUT_X + i * FRET_SPACING}
            y2={PAD_TOP + 5 * STRING_SPACING}
            stroke="#334155"
            strokeWidth={1}
          />
        ))}

        {/* String lines — horizontal, starting at the nut */}
        {Array.from({ length: 6 }, (_, i) => {
          const s = i + 1;
          return (
            <line
              key={s}
              x1={NUT_X}
              y1={sy(s)}
              x2={NUT_X + fretsShown * FRET_SPACING}
              y2={sy(s)}
              stroke="#475569"
              strokeWidth={0.7 + (6 - s) * 0.2} // string 1 (low E) thickest
            />
          );
        })}

        {/* Fret number label for non-open-position shapes */}
        {!showNut && (
          <text
            x={NUT_X + 4}
            y={PAD_TOP + 5 * STRING_SPACING + 13}
            textAnchor="start"
            fill="#64748b"
            fontSize={9}
            fontFamily="monospace"
          >
            {displayStart}fr
          </text>
        )}

        {/* Muted string markers (✕) — small label to the left of the nut */}
        {Array.from({ length: 6 }, (_, i) => i + 1)
          .filter(s => !positionedStrings.has(s))
          .map(s => (
            <text
              key={s}
              x={NUT_X - 6}
              y={sy(s)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#475569"
              fontSize={9}
            >
              ✕
            </text>
          ))}

        {/* Note dots */}
        {positions.map(pos => {
          const cx = fx(pos.fret);
          const cy = sy(pos.string);
          const { fill, text } = ROLE_COLORS[pos.role];
          return (
            <g key={`${pos.string}-${pos.fret}`}>
              <circle cx={cx} cy={cy} r={DOT_R} fill={fill} />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={text}
                fontSize={7}
                fontWeight="700"
                fontFamily="sans-serif"
              >
                {pos.note.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
