import type { Note } from "./types";

// Standard tuning open-string pitch classes, strings 1–6 (low E to high e)
const OPEN_STRINGS = [4, 9, 2, 7, 11, 4];

// Default sharp spelling for key-agnostic fretboard positions
const SHARP_NAMES = ["C", "C#", "D", "E♭", "E", "F", "F#", "G", "G#", "A", "B♭", "B"];

// FRETBOARD[stringIndex][fret], where stringIndex = string - 1 (0 = low E, 5 = high e)
// Covers frets 0 (open) through 12.
export const FRETBOARD: Note[][] = OPEN_STRINGS.map((openPitchClass) =>
  Array.from({ length: 13 }, (_, fret) => {
    const pitchClass = (openPitchClass + fret) % 12;
    return { pitchClass, name: SHARP_NAMES[pitchClass] };
  })
);

// string is 1-indexed (1 = low E, 6 = high e), fret is 0–12
export function getNoteAt(string: number, fret: number): Note {
  return FRETBOARD[string - 1][fret];
}
