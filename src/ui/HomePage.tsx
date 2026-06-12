import { useEffect, useState } from "react";

function useIsNarrow() {
  const [narrow, setNarrow] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setNarrow(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return narrow;
}

import { KeySelector } from "./KeySelector";
import { ProgressionSelector } from "./ProgressionSelector";
import {
  PROGRESSION_TEMPLATES,
  realizeProgression,
} from "../theory/progressions";
import { placeShape } from "../theory/placement";
import { CAGED_SHAPES } from "../theory/shapes";
import { FretboardDiagram } from "./FretboardDiagram";
import { FullNeckDiagram } from "./FullNeckDiagram";
import { RoleLegend } from "./RoleLegend";
import type {
  CagedShapeName,
  Chord,
  Key,
  PlacedShape,
  Progression,
  ProgressionTemplate,
} from "../theory/types";

function pickShape(chord: Chord): PlacedShape | null {
  const candidates = CAGED_SHAPES.filter(
    (s) => s.quality === chord.quality,
  ).flatMap((s) => {
    const p = placeShape(chord, s);
    return p ? [p] : [];
  });
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function chordLabel(chord: Chord): string {
  if (chord.quality === "major") return chord.root.name;
  if (chord.quality === "minor") return chord.root.name + "m";
  return chord.root.name + "°";
}

const CANON_PLACED: PlacedShape[] = (
  [
    { shapeName: "C" as CagedShapeName, root: { name: "C", pitchClass: 0 } },
    { shapeName: "A" as CagedShapeName, root: { name: "A", pitchClass: 9 } },
    { shapeName: "G" as CagedShapeName, root: { name: "G", pitchClass: 7 } },
    { shapeName: "E" as CagedShapeName, root: { name: "E", pitchClass: 4 } },
    { shapeName: "D" as CagedShapeName, root: { name: "D", pitchClass: 2 } },
  ] as const
).flatMap(({ shapeName, root }) => {
  const shape = CAGED_SHAPES.find(
    (s) => s.name === shapeName && s.quality === "major",
  );
  if (!shape) return [];
  const placed = placeShape({ root, quality: "major" }, shape);
  return placed ? [placed] : [];
});

// Decorative fretboard geometry (hero background)
const STRINGS = [
  { y: 450, w: 0.6, o: 0.18 },
  { y: 470, w: 0.9, o: 0.22 },
  { y: 492, w: 1.2, o: 0.26 },
  { y: 514, w: 1.6, o: 0.3 },
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
  const [template, setTemplate] = useState<ProgressionTemplate>(
    PROGRESSION_TEMPLATES[0],
  );
  const [progression, setProgression] = useState<Progression | null>(null);
  const [placements, setPlacements] = useState<(PlacedShape | null)[]>([]);
  const [activeChord, setActiveChord] = useState(0);

  const handleKeyChange = (newKey: Key) => {
    setKey(newKey);
    if (newKey.mode !== key.mode) {
      const first = PROGRESSION_TEMPLATES.find((t) => {
        const f = t.numerals[0];
        return newKey.mode === "major"
          ? f !== f.toLowerCase()
          : f === f.toLowerCase();
      });
      if (first) setTemplate(first);
    }
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700;9..144,900&family=Lora:ital,wght@0,400;0,500;1,400&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Lora', Georgia, serif",
        background: "#f4ede0",
        color: "#2d1a0e",
      }}
    >
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Warm cream base */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(160deg, #f5ede2 0%, #ede0c8 55%, #f0e8d5 100%)",
          }}
        />

        {/* Wood grain via feTurbulence */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          aria-hidden="true"
          style={{ mixBlendMode: "multiply" }}
        >
          <defs>
            <filter
              id="wood-grain-hero"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.62"
                numOctaves="5"
                seed="12"
              />
              <feColorMatrix
                type="matrix"
                values="
                0.35 0 0 0 0.48
                0.22 0 0 0 0.27
                0.08 0 0 0 0.07
                0    0 0 0.15 0
              "
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#wood-grain-hero)" />
        </svg>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(100,50,10,0.06) 100%)",
          }}
        />

        {/* Decorative fretboard lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <line
            x1={130}
            y1={434}
            x2={130}
            y2={572}
            stroke="#8b5e3c"
            strokeWidth={3.5}
            opacity={0.12}
          />
          {FRET_XS.map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={434}
              x2={x}
              y2={572}
              stroke="#8b5e3c"
              strokeWidth={1}
              opacity={0.08}
            />
          ))}
          {STRINGS.map((s, i) => (
            <line
              key={i}
              x1={0}
              y1={s.y}
              x2={1440}
              y2={s.y}
              stroke="#c4882a"
              strokeWidth={s.w}
              opacity={s.o}
            />
          ))}
          {MARKER_DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={5.5}
              fill="#c4882a"
              opacity={0.2}
            />
          ))}
        </svg>

        {/* Hero text */}
        <div className="relative z-10 text-center w-full px-8">
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "0.875rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b89070",
              marginBottom: "1.5rem",
              fontWeight: 500,
            }}
          >
            Guitar · Theory · Practice
          </p>

          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(4.5rem, 13vw, 9.5rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
              color: "#2d1a0e",
            }}
          >
            Fret<span style={{ color: "#c4882a" }}>Flow</span>
          </h1>

          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
              color: "#7a5030",
              fontSize: "1.35rem",
              fontWeight: 400,
              maxWidth: "26rem",
              margin: "0 auto 2.75rem",
              lineHeight: 1.7,
            }}
          >
            Pick a key. Pick a vibe. See every chord, exactly where it lives on
            the neck.
          </p>

          <a
            href="#app"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              background: "linear-gradient(135deg, #e8b86d 0%, #c4882a 100%)",
              color: "#1c0f06",
              padding: "0.875rem 2.25rem",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow:
                "0 4px 20px rgba(196,136,42,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
              transition: "all 0.2s",
              fontFamily: "'Lora', serif",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 28px rgba(196,136,42,0.5), inset 0 1px 0 rgba(255,255,255,0.25)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 20px rgba(196,136,42,0.4), inset 0 1px 0 rgba(255,255,255,0.25)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
            }}
          >
            Start Practicing
            <svg
              width="13"
              height="13"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ opacity: 0.3 }}
        >
          <div style={{ width: 1, height: 56, background: "#8b5e3c" }} />
        </div>
      </section>

      {/* ── The CAGED System ──────────────────────────────────── */}
      <section
        id="how-caged"
        style={{ background: "#1c0e05" }}
        className="py-24 px-8"
      >
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col items-center text-center mb-14">
            <div
              style={{
                width: 40,
                height: 2,
                background: "#c4882a",
                marginBottom: 20,
                borderRadius: 2,
              }}
            />
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#f0e0c0",
                marginBottom: "0.875rem",
              }}
            >
              The CAGED System
            </h2>
            <p
              style={{
                color: "#9a7a58",
                fontSize: "1.2rem",
                maxWidth: "34rem",
                lineHeight: 1.8,
                fontStyle: "italic",
              }}
            >
              Five open-chord shapes that tile the entire neck. Move any one up
              the fretboard and you have any key.
            </p>
            <p
              style={{
                color: "#9a7a58",
                fontSize: "1.2rem",
                maxWidth: "34rem",
                lineHeight: 1.8,
                fontStyle: "italic",
              }}
            >
              No position left uncovered.
            </p>
          </div>

          {/* Shape cards with watermark letters */}
          <div className="flex flex-wrap justify-center gap-3">
            {CANON_PLACED.map((ps) => (
              <div
                key={ps.shape.name}
                className="relative overflow-hidden flex flex-col items-center"
                style={{
                  background: "#2d1a0d",
                  border: "1px solid #3d2516",
                  borderRadius: 18,
                  padding: "20px 18px 16px",
                  minWidth: 130,
                }}
              >
                {/* Watermark letter */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: -6,
                    right: 6,
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 900,
                    fontSize: "5.5rem",
                    lineHeight: 1,
                    color: "rgba(196,136,42,0.11)",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {ps.shape.name}
                </div>
                <FretboardDiagram placedShape={ps} />
              </div>
            ))}
          </div>

          {/* Legend */}
          <RoleLegend labelColor="#9a7a58" className="mt-10" />
        </div>
      </section>

      {/* ── App ────────────────────────────────────────────────── */}
      <section
        id="app"
        style={{ background: "#f4ede0" }}
        className="py-24 px-8"
      >
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {/* Section header */}
          <div className="flex flex-col gap-1">
            <p
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b89070",
                fontFamily: "'Lora', serif",
              }}
            >
              Practice Tool
            </p>
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#2d1a0e",
              }}
            >
              Generate a Progression
            </h2>
          </div>

          {/* Controls card */}
          <div
            style={{
              background: "#faf6ee",
              border: "1px solid #d9cbb0",
              borderRadius: 20,
              boxShadow:
                "0 2px 16px rgba(45,26,14,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
              overflow: "hidden",
            }}
          >
            {/* Two-column layout: key left, progression right */}
            <div className="grid md:grid-cols-[auto,1fr] gap-0">
              {/* Key selector */}
              <div
                style={{
                  padding: "28px 32px",
                  borderRight: "1px solid #e8dcc8",
                  borderBottom: "1px solid #e8dcc8",
                }}
                className="md:border-b-0"
              >
                <KeySelector value={key} onChange={handleKeyChange} />
              </div>

              {/* Progression selector */}
              <div
                style={{
                  padding: "28px 32px",
                  borderBottom: "1px solid #e8dcc8",
                }}
              >
                <ProgressionSelector
                  value={template}
                  onChange={setTemplate}
                  mode={key.mode}
                />
              </div>
            </div>

            {/* Generate — full-width bottom strip */}
            <div style={{ padding: "20px 32px", background: "#f5ede0" }}>
              <button
                onClick={() => {
                  const prog = realizeProgression(template, key);
                  setProgression(prog);
                  setPlacements(prog.chords.map(pickShape));
                  setActiveChord(0);
                }}
                className="w-full flex items-center justify-center gap-3 transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #e8b86d 0%, #c4882a 55%, #a8731f 100%)",
                  color: "#1c0f06",
                  padding: "0.875rem 2rem",
                  borderRadius: 12,
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  boxShadow:
                    "0 3px 14px rgba(196,136,42,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                  fontFamily: "'Lora', serif",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-1px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 6px 20px rgba(196,136,42,0.5), inset 0 1px 0 rgba(255,255,255,0.2)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 3px 14px rgba(196,136,42,0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                Generate Progression
              </button>
            </div>
          </div>

          {/* Full neck — appears after generating */}
          {progression && (
            <div
              style={{
                background: "#f5ede2",
                border: "1px solid #d9cbb0",
                borderRadius: 20,
                padding: 24,
                boxShadow:
                  "0 2px 16px rgba(45,26,14,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              <FullNeckDiagram
                orientation={isNarrow ? "portrait" : "landscape"}
                placements={placements}
                activeIndex={activeChord}
                onActiveChange={setActiveChord}
                chordLabels={progression.chords.map((chord, i) => ({
                  numeral: progression.template.numerals[i],
                  name: chordLabel(chord),
                  shapeName: placements[i]?.shape.name,
                }))}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer
        style={{ background: "#1c0e05", borderTop: "1px solid #2d1a0d" }}
        className="py-10 px-8"
      >
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#f0e0c0",
              letterSpacing: "-0.01em",
            }}
          >
            Fret<span style={{ color: "#c4882a" }}>Flow</span>
          </span>
          <p
            className="text-xs text-center sm:text-right leading-relaxed"
            style={{
              color: "#7a5a3a",
              fontFamily: "'Lora', serif",
              fontStyle: "italic",
            }}
          >
            Deterministic CAGED practice tool.
            <br />
            Built with React + Vite — all music theory runs client-side.
          </p>
        </div>
      </footer>
    </div>
  );
}
