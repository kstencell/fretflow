import { useEffect, useState } from "react";

function useIsNarrow() {
  const [narrow, setNarrow] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setNarrow(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return narrow;
}
import { KeySelector } from "./KeySelector";
import { ProgressionSelector } from "./ProgressionSelector";
import { PROGRESSION_TEMPLATES, realizeProgression } from "../theory/progressions";
import { placeShape } from "../theory/placement";
import { CAGED_SHAPES } from "../theory/shapes";
import { FretboardDiagram } from "./FretboardDiagram";
import { FullNeckDiagram } from "./FullNeckDiagram";
import type { CagedShapeName, Chord, Key, PlacedShape, Progression, ProgressionTemplate } from "../theory/types";

// Collect all valid placements for a chord and pick one at random.
function pickShape(chord: Chord): PlacedShape | null {
  const candidates = CAGED_SHAPES
    .filter(s => s.quality === chord.quality)
    .flatMap(s => { const p = placeShape(chord, s); return p ? [p] : []; });
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function chordLabel(chord: Chord): string {
  if (chord.quality === "major") return chord.root.name;
  if (chord.quality === "minor") return chord.root.name + "m";
  return chord.root.name + "°";
}

// Canonical open-position form of each CAGED shape, computed once at load time
const CANON_PLACED: PlacedShape[] = (
  [
    { shapeName: "C" as CagedShapeName, root: { name: "C", pitchClass: 0 } },
    { shapeName: "A" as CagedShapeName, root: { name: "A", pitchClass: 9 } },
    { shapeName: "G" as CagedShapeName, root: { name: "G", pitchClass: 7 } },
    { shapeName: "E" as CagedShapeName, root: { name: "E", pitchClass: 4 } },
    { shapeName: "D" as CagedShapeName, root: { name: "D", pitchClass: 2 } },
  ] as const
).flatMap(({ shapeName, root }) => {
  const shape = CAGED_SHAPES.find(s => s.name === shapeName && s.quality === "major");
  if (!shape) return [];
  const placed = placeShape({ root, quality: "major" }, shape);
  return placed ? [placed] : [];
});

const STRINGS = [
  { y: 450, w: 0.6, o: 0.18 },
  { y: 470, w: 0.9, o: 0.22 },
  { y: 492, w: 1.2, o: 0.26 },
  { y: 514, w: 1.6, o: 0.30 },
  { y: 534, w: 2.1, o: 0.34 },
  { y: 552, w: 2.8, o: 0.38 },
];

const FRET_XS = [160, 330, 490, 640, 780, 912, 1036, 1152, 1260, 1360];

const MARKER_DOTS = [
  { x: 490, y: 502 },
  { x: 640, y: 502 },
  { x: 780, y: 502 },
  { x: 912, y: 480 },
  { x: 912, y: 524 },
];

export function HomePage() {
  const isNarrow = useIsNarrow();
  const [key, setKey] = useState<Key>({
    tonic: { name: "C", pitchClass: 0 },
    mode: "major",
  });
  const [template, setTemplate] = useState<ProgressionTemplate>(PROGRESSION_TEMPLATES[0]);
  const [progression, setProgression] = useState<Progression | null>(null);
  const [placements, setPlacements] = useState<(PlacedShape | null)[]>([]);
  const [activeChord, setActiveChord] = useState(0);

  // When mode switches, reset to the first template that fits the new mode.
  const handleKeyChange = (newKey: Key) => {
    setKey(newKey);
    if (newKey.mode !== key.mode) {
      const first = PROGRESSION_TEMPLATES.find(t => {
        const f = t.numerals[0];
        return newKey.mode === "major" ? f !== f.toLowerCase() : f === f.toLowerCase();
      });
      if (first) setTemplate(first);
    }
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="bg-[#f0f5ff] text-slate-900">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Subtle blue radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 48%, rgba(59,130,246,0.10) 0%, transparent 70%)",
          }}
        />

        {/* Fretboard background decoration */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* Nut */}
          <line x1={130} y1={434} x2={130} y2={572} stroke="#2563eb" strokeWidth={3.5} opacity={0.12} />

          {/* Fret lines */}
          {FRET_XS.map((x, i) => (
            <line key={i} x1={x} y1={434} x2={x} y2={572} stroke="#2563eb" strokeWidth={1} opacity={0.07} />
          ))}

          {/* Strings — high e at top, low E at bottom */}
          {STRINGS.map((s, i) => (
            <line
              key={i}
              x1={0}
              y1={s.y}
              x2={1440}
              y2={s.y}
              stroke="#3b82f6"
              strokeWidth={s.w}
              opacity={s.o}
            />
          ))}

          {/* Fret position markers */}
          {MARKER_DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={5.5} fill="#3b82f6" opacity={0.25} />
          ))}
        </svg>

        {/* Hero content */}
        <div className="relative z-10 text-center w-full px-8">

          <h1
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-[clamp(4.5rem,13vw,9.5rem)] font-black leading-none tracking-tight mb-12 text-slate-900"
          >
            Fret
            <span className="text-blue-500">Flow</span>
          </h1>

          <p className="text-lg text-slate-500 font-light mb-20 max-w-md mx-auto leading-relaxed">
            Pick a key. Pick a vibe. See every chord, exactly where it lives on the neck.
          </p>

          <a
            href="#app"
            className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl text-sm font-medium tracking-wide transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-600/30"
          >
            Start Practicing
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-25">
          <div className="w-px h-14 bg-blue-400" />
        </div>
      </section>

      {/* ── How CAGED Works ────────────────────────────────── */}
      <section id="how-caged" className="bg-slate-900 py-24 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-4xl font-black tracking-tight text-white mb-4"
          >
            The CAGED System
          </h2>
          <p className="text-slate-400 text-base mb-16 max-w-xl mx-auto leading-relaxed">
            Five open-chord shapes that tile the entire neck. Move any one up the
            fretboard and you have any key — no position left uncovered.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {CANON_PLACED.map(ps => (
              <div
                key={ps.shape.name}
                className="bg-slate-800 rounded-2xl p-5 flex flex-col items-center border border-slate-700/50"
              >
                <FretboardDiagram placedShape={ps} />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-8 mt-12">
            {[
              { color: "bg-amber-400", label: "root" },
              { color: "bg-indigo-400", label: "third" },
              { color: "bg-slate-600", label: "fifth" },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-2 text-xs text-slate-500">
                <span className={`w-2.5 h-2.5 rounded-full ${color} inline-block`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── App ────────────────────────────────────────────── */}
      <section id="app" className="py-24 px-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <h2
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-4xl font-black tracking-tight text-slate-900"
          >
            Generate a Progression
          </h2>

          {/* Controls */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col gap-8">
            <KeySelector value={key} onChange={handleKeyChange} />
            <ProgressionSelector value={template} onChange={setTemplate} mode={key.mode} />
            <button
              onClick={() => {
                const prog = realizeProgression(template, key);
                setProgression(prog);
                setPlacements(prog.chords.map(pickShape));
                setActiveChord(0);
              }}
              className="self-start bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-8 py-3 rounded-2xl text-sm font-medium tracking-wide transition-all duration-150 shadow-md shadow-blue-500/25"
            >
              Generate
            </button>
          </div>

          {/* Full neck — appears after generating */}
          {progression && (
            <div className="bg-slate-900 rounded-3xl p-6">
              <FullNeckDiagram
                orientation={isNarrow ? 'portrait' : 'landscape'}
                placements={placements}
                activeIndex={activeChord}
                onActiveChange={setActiveChord}
                chordLabels={progression.chords.map((chord, i) => ({
                  numeral: progression.template.numerals[i],
                  name: chordLabel(chord),
                }))}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10 px-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-lg font-black text-white tracking-tight"
          >
            Fret<span className="text-blue-500">Flow</span>
          </span>
          <p className="text-xs text-slate-500 text-center sm:text-right leading-relaxed">
            Deterministic CAGED practice tool.
            <br />
            Built with React + Vite. All music theory runs client-side — no server, no data sent anywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
