import type { CagedShape } from "./types";

// All fret offsets are relative to the lowest-string root in the shape.
// Negative offsets mean the note is closer to the nut than the anchor root.
//
// ⚠️  Verify all 10 shapes against a real guitar before trusting these offsets.

export const CAGED_SHAPES: CagedShape[] = [
  // ── E shapes ── anchor root on string 1 (low E) ──────────────────────────
  {
    name: "E",
    quality: "major",
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 1: root
      { stringOffset: 1, fretOffset: 2, role: "fifth" }, // string 2
      { stringOffset: 2, fretOffset: 2, role: "root" }, // string 3
      { stringOffset: 3, fretOffset: 1, role: "third" }, // string 4
      { stringOffset: 4, fretOffset: 0, role: "fifth" }, // string 5
      { stringOffset: 5, fretOffset: 0, role: "root" }, // string 6
    ],
  },
  {
    name: "E",
    quality: "minor",
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 1: root
      { stringOffset: 1, fretOffset: 2, role: "fifth" }, // string 2
      { stringOffset: 2, fretOffset: 2, role: "root" }, // string 3
      { stringOffset: 3, fretOffset: 0, role: "third" }, // string 4 — one fret lower than major
      { stringOffset: 4, fretOffset: 0, role: "fifth" }, // string 5
      { stringOffset: 5, fretOffset: 0, role: "root" }, // string 6
    ],
  },

  // ── A shapes ── anchor root on string 2 (A) ──────────────────────────────
  {
    name: "A",
    quality: "major",
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 2: root
      { stringOffset: 1, fretOffset: 2, role: "fifth" }, // string 3
      { stringOffset: 2, fretOffset: 2, role: "root" }, // string 4
      { stringOffset: 3, fretOffset: 2, role: "third" }, // string 5
      { stringOffset: 4, fretOffset: 0, role: "fifth" }, // string 6
    ],
  },
  {
    name: "A",
    quality: "minor",
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 2: root
      { stringOffset: 1, fretOffset: 2, role: "fifth" }, // string 3
      { stringOffset: 2, fretOffset: 2, role: "root" }, // string 4
      { stringOffset: 3, fretOffset: 1, role: "third" }, // string 5 — one fret lower than major
      { stringOffset: 4, fretOffset: 0, role: "fifth" }, // string 6
    ],
  },

  // ── G shapes ── anchor root on string 1 (low E) ──────────────────────────
  {
    name: "G",
    quality: "major",
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 1: root
      { stringOffset: 1, fretOffset: -1, role: "third" }, // string 2
      { stringOffset: 2, fretOffset: -3, role: "fifth" }, // string 3
      { stringOffset: 3, fretOffset: -3, role: "root" }, // string 4
      { stringOffset: 4, fretOffset: -3, role: "third" }, // string 5
      { stringOffset: 5, fretOffset: 0, role: "root" }, // string 6
    ],
  },
  {
    name: "G",
    quality: "minor",
    // String 5 (B) omitted: the minor third there would require fret 11+ in open
    // position, making it impractical. B string muted in this shape.
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 1: root
      { stringOffset: 1, fretOffset: -2, role: "third" }, // string 2 — one fret lower than major
      { stringOffset: 2, fretOffset: -3, role: "fifth" }, // string 3
      { stringOffset: 3, fretOffset: -3, role: "root" }, // string 4
      { stringOffset: 5, fretOffset: 0, role: "root" }, // string 6
    ],
  },

  // ── D shapes ── anchor root on string 3 (D) ──────────────────────────────
  {
    name: "D",
    quality: "major",
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 3: root
      { stringOffset: 1, fretOffset: 2, role: "fifth" }, // string 4
      { stringOffset: 2, fretOffset: 3, role: "root" }, // string 5
      { stringOffset: 3, fretOffset: 2, role: "third" }, // string 6
    ],
  },
  {
    name: "D",
    quality: "minor",
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 3: root
      { stringOffset: 1, fretOffset: 2, role: "fifth" }, // string 4
      { stringOffset: 2, fretOffset: 3, role: "root" }, // string 5
      { stringOffset: 3, fretOffset: 1, role: "third" }, // string 6 — one fret lower than major
    ],
  },

  // ── C shapes ── anchor root on string 2 (A) ──────────────────────────────
  {
    name: "C",
    quality: "major",
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 2: root
      { stringOffset: 1, fretOffset: -1, role: "third" }, // string 3
      { stringOffset: 2, fretOffset: -3, role: "fifth" }, // string 4
      { stringOffset: 3, fretOffset: -2, role: "root" }, // string 5
      { stringOffset: 4, fretOffset: -3, role: "third" }, // string 6
    ],
  },
  {
    name: "C",
    quality: "minor",
    notes: [
      { stringOffset: 0, fretOffset: 0, role: "root" }, // string 2: root
      { stringOffset: 1, fretOffset: -2, role: "third" }, // string 3 — one fret lower than major
      { stringOffset: 2, fretOffset: -3, role: "fifth" }, // string 4
      { stringOffset: 3, fretOffset: -2, role: "root" }, // string 5
    ],
  },
];
