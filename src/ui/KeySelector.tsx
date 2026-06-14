import type { Key, Mode } from "../theory/types";

// Two rows: natural notes on top, accidentals below.
// Mirrors how guitarists think about the chromatic scale — not a keyboard.
const NATURALS = [
  { name: "C",  pitchClass: 0  },
  { name: "D",  pitchClass: 2  },
  { name: "E",  pitchClass: 4  },
  { name: "F",  pitchClass: 5  },
  { name: "G",  pitchClass: 7  },
  { name: "A",  pitchClass: 9  },
  { name: "B",  pitchClass: 11 },
] as const;

const ACCIDENTALS = [
  { name: "C#", pitchClass: 1  },
  { name: "Eb", pitchClass: 3  },
  { name: "F#", pitchClass: 6  },
  { name: "Ab", pitchClass: 8  },
  { name: "Bb", pitchClass: 10 },
] as const;

const MODES: { label: string; value: Mode }[] = [
  { label: "Major", value: "major" },
  { label: "minor", value: "natural-minor" },
];

interface Props {
  value: Key;
  onChange: (key: Key) => void;
  compact?: boolean;
}

function NoteButton({
  name, active, natural, compact, onClick,
}: {
  name: string; pitchClass?: number; active: boolean; natural: boolean; compact: boolean; onClick: () => void;
}) {
  const size = compact ? (natural ? 40 : 36) : (natural ? 44 : 40);
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: active
          ? 'linear-gradient(145deg, #e8b86d 0%, #c4882a 100%)'
          : natural
            ? '#f5ede2'
            : '#e2d4be',
        border: active
          ? '2px solid #a8731f'
          : `1px solid ${natural ? '#d9cbb0' : '#c8b09a'}`,
        boxShadow: active
          ? '0 0 0 3px rgba(196,136,42,0.2), 0 3px 12px rgba(196,136,42,0.4), inset 0 1px 0 rgba(255,255,255,0.25)'
          : natural
            ? '0 1px 3px rgba(45,26,14,0.1), inset 0 1px 0 rgba(255,255,255,0.7)'
            : '0 1px 2px rgba(45,26,14,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
        cursor: 'pointer',
        transition: 'all 0.12s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: compact ? (natural ? 11 : 10) : (natural ? 13 : 11),
        fontWeight: active ? 700 : 500,
        color: active ? '#1c0f06' : natural ? '#7a5030' : '#8a6040',
        fontFamily: "'Lora', serif",
        letterSpacing: natural ? '0' : '-0.02em',
        flexShrink: 0,
      }}
    >
      {name}
    </button>
  );
}

export function KeySelector({ value, onChange, compact = false }: Props) {
  const setRoot = (name: string, pitchClass: number) =>
    onChange({ tonic: { name, pitchClass }, mode: value.mode });
  const setMode = (mode: Mode) =>
    onChange({ tonic: value.tonic, mode });

  const isMinor = value.mode === "natural-minor";

  return (
    <div className="flex flex-col gap-4">
      <span
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: '#9a7a58', fontFamily: "'Lora', serif", fontSize: '0.875rem' }}
      >
        Key
      </span>

      <div className="flex flex-col gap-2.5">
        {/* Natural notes */}
        <div className={`flex ${compact ? 'gap-1.5' : 'gap-2'}`}>
          {NATURALS.map(n => (
            <NoteButton
              key={n.pitchClass}
              name={n.name}
              pitchClass={n.pitchClass}
              active={n.pitchClass === value.tonic.pitchClass}
              natural={true}
              compact={compact}
              onClick={() => setRoot(n.name, n.pitchClass)}
            />
          ))}
        </div>

        {/* Accidentals */}
        <div className={`flex ${compact ? 'gap-1.5' : 'gap-2'}`}>
          {ACCIDENTALS.map(a => (
            <NoteButton
              key={a.pitchClass}
              name={a.name}
              pitchClass={a.pitchClass}
              active={a.pitchClass === value.tonic.pitchClass}
              natural={false}
              compact={compact}
              onClick={() => setRoot(a.name, a.pitchClass)}
            />
          ))}
        </div>
      </div>

      {/* Animated mode toggle */}
      <div
        className="relative flex rounded-xl w-fit"
        style={{ background: '#2d1a0d', padding: 3 }}
      >
        {/* Sliding pill */}
        <div
          style={{
            position: 'absolute',
            top: 3, left: 3, bottom: 3,
            width: 'calc(50% - 3px)',
            background: 'linear-gradient(135deg, #e8b86d 0%, #c4882a 100%)',
            borderRadius: 9,
            transform: isMinor ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 2px 8px rgba(196,136,42,0.45)',
            pointerEvents: 'none',
          }}
        />
        {MODES.map(m => {
          const active = m.value === value.mode;
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              style={{
                position: 'relative', zIndex: 1,
                padding: '0.5rem 1.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: active ? 700 : 400,
                color: active ? '#1c0f06' : '#7a5a3a',
                transition: 'color 0.2s',
                fontFamily: "'Lora', serif",
                minWidth: 80,
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
