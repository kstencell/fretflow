// Shared legend for root / third / fifth dot colours.
// Dots are rendered as SVG circles at the same radius used on the fretboard,
// with the root's amber-gold border matching its in-diagram treatment exactly.

const DOT_R = 9;
const PAD = 3;              // extra space so the root's stroke doesn't clip
const SIZE = (DOT_R + PAD) * 2;
const C = DOT_R + PAD;      // circle centre within the SVG

const ROLES = [
  { label: 'root',  fill: '#5896a8', stroke: '#f59e0b',          strokeWidth: 2.5 },
  { label: 'third', fill: '#c8b888', stroke: 'rgba(0,0,0,0.15)', strokeWidth: 1   },
  { label: 'fifth', fill: '#d4862a', stroke: 'rgba(0,0,0,0.2)',  strokeWidth: 1   },
] as const;

interface Props {
  labelColor?: string;
  className?: string;
}

export function RoleLegend({ labelColor = '#7a5a3a', className = '' }: Props) {
  return (
    <div className={`flex justify-center gap-8 ${className}`}>
      {ROLES.map(({ label, fill, stroke, strokeWidth }) => (
        <span key={label} className="flex items-center gap-2">
          <svg width={SIZE} height={SIZE} style={{ display: 'block', flexShrink: 0 }}>
            <circle
              cx={C} cy={C} r={DOT_R}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </svg>
          <span style={{ fontSize: '0.75rem', color: labelColor, fontFamily: "'Lora', serif", letterSpacing: '0.05em' }}>
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}
