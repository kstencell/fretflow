import type { PlacedShape, ChordToneRole } from '../theory/types';

const FRET_SPACING = 30;
const STRING_SPACING = 24;
const NUT_X = 18;
const PAD_RIGHT = 14;
const PAD_TOP = 10;
const PAD_BOTTOM = 28;
const DOT_R = 9;
const NUT_W = 4;
const FRETS_MIN = 4;

// Scaled-down gauge from FullNeckDiagram's [3.2,2.6,2.0,1.5,1.1,0.7]
// Index 0 = string 1 (low E, thickest), index 5 = string 6 (high e, thinnest)
const STRING_GAUGES = [1.6, 1.3, 1.0, 0.75, 0.55, 0.35];

// Match FullNeckDiagram colour constants exactly
const FRET_COLOR = '#9E9C96';
const STRING_COLOR = '#C8C8C4';
const NUT_COLOR = '#F0E5B8';

const ROLE_COLORS: Record<ChordToneRole, { fill: string; stroke: string; strokeWidth: number; text: string }> = {
  root:  { fill: '#5896a8', stroke: '#f59e0b',          strokeWidth: 2.5, text: '#ffffff' },
  third: { fill: '#c8b888', stroke: 'rgba(0,0,0,0.15)', strokeWidth: 1,   text: '#3d2010' },
  fifth: { fill: '#d4862a', stroke: 'rgba(0,0,0,0.2)',  strokeWidth: 1,   text: '#1c0f06' },
};

interface Props {
  placedShape: PlacedShape;
  showLabel?: boolean;
}

export function FretboardDiagram({ placedShape, showLabel = true }: Props) {
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
    if (f === 0) return NUT_X;
    const cell = showNut ? f - 1 : f - displayStart;
    return NUT_X + (cell + 0.5) * FRET_SPACING;
  };

  const positionedStrings = new Set(positions.map(p => p.string));

  return (
    <div className="flex flex-col items-center gap-1">
      {showLabel && (
        <>
          <span className="text-sm font-semibold tracking-wide" style={{ color: '#f0e0c0' }}>
            {chord.root.name}{' '}
            <span style={{ color: '#b89070', fontWeight: 400 }}>{chord.quality}</span>
          </span>
          <span className="text-[11px] font-mono" style={{ color: '#7a5a3a' }}>{shape.name} shape</span>
        </>
      )}

      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        <defs>
          {/* Rosewood gradient — matches FullNeckDiagram: lighter edges, darker centre */}
          <linearGradient id="fb-chord-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7A4828" />
            <stop offset="30%"  stopColor="#4E2810" />
            <stop offset="70%"  stopColor="#4E2810" />
            <stop offset="100%" stopColor="#7A4828" />
          </linearGradient>
        </defs>

        {/* Fretboard — rosewood gradient */}
        <rect
          x={NUT_X} y={PAD_TOP}
          width={fretsShown * FRET_SPACING} height={5 * STRING_SPACING}
          fill="url(#fb-chord-wood)" rx={2}
        />

        {/* Nut — ivory, matches FullNeckDiagram */}
        {showNut && (
          <rect
            x={NUT_X - NUT_W / 2} y={PAD_TOP}
            width={NUT_W} height={5 * STRING_SPACING}
            rx={1} fill={NUT_COLOR}
          />
        )}

        {/* Fret wires — silver-grey, matches FullNeckDiagram */}
        {Array.from({ length: fretsShown + 1 }, (_, i) => (
          <line
            key={i}
            x1={NUT_X + i * FRET_SPACING} y1={PAD_TOP}
            x2={NUT_X + i * FRET_SPACING} y2={PAD_TOP + 5 * STRING_SPACING}
            stroke={FRET_COLOR} strokeWidth={1}
          />
        ))}

        {/* Strings — silver with proper gauge, matches FullNeckDiagram */}
        {Array.from({ length: 6 }, (_, i) => {
          const s = i + 1; // s=1 low E, s=6 high e
          const gauge = STRING_GAUGES[s - 1]; // index 0 = low E = thickest
          return (
            <line
              key={s}
              x1={NUT_X} y1={sy(s)}
              x2={NUT_X + fretsShown * FRET_SPACING} y2={sy(s)}
              stroke={STRING_COLOR}
              strokeWidth={gauge}
            />
          );
        })}

        {/* Fret number for non-open shapes */}
        {!showNut && (
          <text
            x={NUT_X + 4} y={PAD_TOP + 5 * STRING_SPACING + DOT_R + 12}
            textAnchor="start" fill="#9a7a58" fontSize={9} fontFamily="monospace"
          >
            {displayStart}fr
          </text>
        )}

        {/* Muted string markers */}
        {Array.from({ length: 6 }, (_, i) => i + 1)
          .filter(s => !positionedStrings.has(s))
          .map(s => (
            <text
              key={s} x={NUT_X - 6} y={sy(s)}
              textAnchor="middle" dominantBaseline="middle"
              fill="#7a5a3a" fontSize={9}
            >
              ✕
            </text>
          ))}

        {/* Note dots with role colours */}
        {positions.map(pos => {
          const cx = fx(pos.fret);
          const cy = sy(pos.string);
          const { fill, stroke, strokeWidth, text } = ROLE_COLORS[pos.role];
          return (
            <g key={`${pos.string}-${pos.fret}`}>
              <circle cx={cx} cy={cy} r={DOT_R} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
              <text
                x={cx} y={cy}
                textAnchor="middle" dominantBaseline="middle"
                fill={text} fontSize={7} fontWeight="700" fontFamily="sans-serif"
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
