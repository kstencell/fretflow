import { describe, it, expect } from 'vitest';
import { placeShape } from './placement';
import { CAGED_SHAPES } from './shapes';
import type { CagedShapeName, ChordToneRole, Chord } from './types';

function findShape(name: CagedShapeName, quality: 'major' | 'minor') {
  return CAGED_SHAPES.find(s => s.name === name && s.quality === quality)!;
}

// ── null cases ────────────────────────────────────────────────────────────────

describe('placeShape → null', () => {
  it('returns null when chord quality is major but shape is minor', () => {
    const chord: Chord = { root: { pitchClass: 4, name: 'E' }, quality: 'major' };
    expect(placeShape(chord, findShape('E', 'minor'))).toBeNull();
  });

  it('returns null when chord quality is minor but shape is major', () => {
    const chord: Chord = { root: { pitchClass: 9, name: 'A' }, quality: 'minor' };
    expect(placeShape(chord, findShape('A', 'major'))).toBeNull();
  });

  it('returns null for diminished chord (no CAGED shape exists for diminished)', () => {
    const chord: Chord = { root: { pitchClass: 11, name: 'B' }, quality: 'diminished' };
    expect(placeShape(chord, findShape('E', 'major'))).toBeNull();
  });
});

// ── valid placements ──────────────────────────────────────────────────────────

type ExpectedPosition = { string: number; fret: number; role: ChordToneRole; pitchClass: number };

type Case = {
  label: string;
  chord: Chord;
  shapeName: CagedShapeName;
  shapeQuality: 'major' | 'minor';
  expectedPositions: ExpectedPosition[];
};

const cases: Case[] = [
  {
    label: 'open E major (E shape, anchor s1 f0)',
    chord: { root: { pitchClass: 4, name: 'E' }, quality: 'major' },
    shapeName: 'E', shapeQuality: 'major',
    expectedPositions: [
      { string: 1, fret: 0, role: 'root',  pitchClass: 4  }, // E
      { string: 2, fret: 2, role: 'fifth', pitchClass: 11 }, // B
      { string: 3, fret: 2, role: 'root',  pitchClass: 4  }, // E
      { string: 4, fret: 1, role: 'third', pitchClass: 8  }, // G#
      { string: 5, fret: 0, role: 'fifth', pitchClass: 11 }, // B
      { string: 6, fret: 0, role: 'root',  pitchClass: 4  }, // E
    ],
  },
  {
    label: 'open A minor (A shape, anchor s2 f0)',
    chord: { root: { pitchClass: 9, name: 'A' }, quality: 'minor' },
    shapeName: 'A', shapeQuality: 'minor',
    expectedPositions: [
      { string: 2, fret: 0, role: 'root',  pitchClass: 9 }, // A
      { string: 3, fret: 2, role: 'fifth', pitchClass: 4 }, // E
      { string: 4, fret: 2, role: 'root',  pitchClass: 9 }, // A
      { string: 5, fret: 1, role: 'third', pitchClass: 0 }, // C (minor third)
      { string: 6, fret: 0, role: 'fifth', pitchClass: 4 }, // E
    ],
  },
  {
    label: 'F major barre (E shape, anchor s1 f1)',
    chord: { root: { pitchClass: 5, name: 'F' }, quality: 'major' },
    shapeName: 'E', shapeQuality: 'major',
    expectedPositions: [
      { string: 1, fret: 1, role: 'root',  pitchClass: 5 }, // F
      { string: 2, fret: 3, role: 'fifth', pitchClass: 0 }, // C
      { string: 3, fret: 3, role: 'root',  pitchClass: 5 }, // F
      { string: 4, fret: 2, role: 'third', pitchClass: 9 }, // A
      { string: 5, fret: 1, role: 'fifth', pitchClass: 0 }, // C
      { string: 6, fret: 1, role: 'root',  pitchClass: 5 }, // F
    ],
  },
  {
    label: 'open D major (D shape, anchor s3 f0)',
    chord: { root: { pitchClass: 2, name: 'D' }, quality: 'major' },
    shapeName: 'D', shapeQuality: 'major',
    expectedPositions: [
      { string: 3, fret: 0, role: 'root',  pitchClass: 2 }, // D
      { string: 4, fret: 2, role: 'fifth', pitchClass: 9 }, // A
      { string: 5, fret: 3, role: 'root',  pitchClass: 2 }, // D
      { string: 6, fret: 2, role: 'third', pitchClass: 6 }, // F#
    ],
  },
  {
    label: 'open C major (C shape, anchor s2 f3)',
    chord: { root: { pitchClass: 0, name: 'C' }, quality: 'major' },
    shapeName: 'C', shapeQuality: 'major',
    expectedPositions: [
      { string: 2, fret: 3, role: 'root',  pitchClass: 0 }, // C
      { string: 3, fret: 2, role: 'third', pitchClass: 4 }, // E
      { string: 4, fret: 0, role: 'fifth', pitchClass: 7 }, // G
      { string: 5, fret: 1, role: 'root',  pitchClass: 0 }, // C
      { string: 6, fret: 0, role: 'third', pitchClass: 4 }, // E
    ],
  },
];

describe('placeShape → valid placements', () => {
  it.each(cases)('$label', ({ chord, shapeName, shapeQuality, expectedPositions }) => {
    const shape = findShape(shapeName, shapeQuality);
    const result = placeShape(chord, shape);

    expect(result).not.toBeNull();
    expect(result!.chord).toEqual(chord);
    expect(result!.shape).toBe(shape);
    expect(result!.positions).toHaveLength(expectedPositions.length);

    result!.positions.forEach((pos, i) => {
      const exp = expectedPositions[i];
      expect(pos.string, `position ${i} string`).toBe(exp.string);
      expect(pos.fret,   `position ${i} fret`).toBe(exp.fret);
      expect(pos.role,   `position ${i} role`).toBe(exp.role);
      expect(pos.note.pitchClass, `position ${i} pitchClass`).toBe(exp.pitchClass);
    });
  });
});
