import type { CagedShape, Chord, ChordToneRole, FretboardPosition, PlacedShape } from "./types";
import { getNoteAt } from "./fretboard";

export function placeShape(chord: Chord, shape: CagedShape): PlacedShape | null {
  if (shape.quality !== chord.quality) return null;

  const thirdInterval = chord.quality === "major" ? 4 : 3;
  const tones: Record<ChordToneRole, number> = {
    root:  chord.root.pitchClass,
    third: (chord.root.pitchClass + thirdInterval) % 12,
    fifth: (chord.root.pitchClass + 7) % 12,
  };

  // Scan every fret position where the root note appears; try to overlay the shape.
  for (let fret = 0; fret <= 12; fret++) {
    for (let string = 1; string <= 6; string++) {
      if (getNoteAt(string, fret).pitchClass !== tones.root) continue;

      const positions: (FretboardPosition & { role: ChordToneRole })[] = [];
      let valid = true;

      for (const sn of shape.notes) {
        const s = string + sn.stringOffset;
        const f = fret + sn.fretOffset;

        if (s < 1 || s > 6 || f < 0 || f > 12) { valid = false; break; }

        const note = getNoteAt(s, f);
        if (note.pitchClass !== tones[sn.role]) { valid = false; break; }

        positions.push({ string: s, fret: f, note, role: sn.role });
      }

      if (valid) return { shape, chord, positions };
    }
  }

  return null;
}
