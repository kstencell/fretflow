import type { Key, Mode } from "../theory/types";

// Standard guitar-idiomatic spellings for each pitch class.
// The theory core re-spells scale *degrees* from this tonic; the tonic name
// just needs to be conventional (e.g. "Eb" not "D#" for major, etc.).
const ROOTS = [
  { name: "C",  pitchClass: 0  },
  { name: "C#", pitchClass: 1  },
  { name: "D",  pitchClass: 2  },
  { name: "Eb", pitchClass: 3  },
  { name: "E",  pitchClass: 4  },
  { name: "F",  pitchClass: 5  },
  { name: "F#", pitchClass: 6  },
  { name: "G",  pitchClass: 7  },
  { name: "Ab", pitchClass: 8  },
  { name: "A",  pitchClass: 9  },
  { name: "Bb", pitchClass: 10 },
  { name: "B",  pitchClass: 11 },
] as const;

const MODES: { label: string; value: Mode }[] = [
  { label: "Major", value: "major" },
  { label: "minor", value: "natural-minor" },
];

interface Props {
  value: Key;
  onChange: (key: Key) => void;
}

export function KeySelector({ value, onChange }: Props) {
  const setRoot = (name: string, pitchClass: number) =>
    onChange({ tonic: { name, pitchClass }, mode: value.mode });

  const setMode = (mode: Mode) =>
    onChange({ tonic: value.tonic, mode });

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Key</span>

      {/* Root note buttons */}
      <div className="flex flex-wrap gap-1.5">
        {ROOTS.map(r => {
          const active = r.pitchClass === value.tonic.pitchClass;
          return (
            <button
              key={r.pitchClass}
              onClick={() => setRoot(r.name, r.pitchClass)}
              className={`
                w-10 h-10 rounded-xl text-sm font-medium transition-all duration-150
                ${active
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                  : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                }
              `}
            >
              {r.name}
            </button>
          );
        })}
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 w-fit">
        {MODES.map(m => {
          const active = m.value === value.mode;
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`
                px-5 py-2 text-sm font-medium transition-all duration-150
                ${active
                  ? "bg-blue-500 text-white"
                  : "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
