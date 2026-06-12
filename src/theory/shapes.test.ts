import { describe, it, expect } from 'vitest';
import { CAGED_SHAPES } from './shapes';
import { getNoteAt } from './fretboard';
import type { CagedShapeName, ChordToneRole } from './types';

type Case = {
  name: CagedShapeName;
  quality: 'major' | 'minor';
  anchorString: number; // string where stringOffset=0 root sits (1-indexed)
  anchorFret: number;
  expected: { pitchClass: number; role: ChordToneRole }[]; // one entry per shape note, in order
};

const cases: Case[] = [
  {
    // open E major (022100)
    name: 'E', quality: 'major', anchorString: 1, anchorFret: 0,
    expected: [
      { pitchClass: 4,  role: 'root'  }, // s1 f0: E
      { pitchClass: 11, role: 'fifth' }, // s2 f2: B
      { pitchClass: 4,  role: 'root'  }, // s3 f2: E
      { pitchClass: 8,  role: 'third' }, // s4 f1: G# (major third)
      { pitchClass: 11, role: 'fifth' }, // s5 f0: B
      { pitchClass: 4,  role: 'root'  }, // s6 f0: E
    ],
  },
  {
    // open E minor (022000)
    name: 'E', quality: 'minor', anchorString: 1, anchorFret: 0,
    expected: [
      { pitchClass: 4,  role: 'root'  }, // s1 f0: E
      { pitchClass: 11, role: 'fifth' }, // s2 f2: B
      { pitchClass: 4,  role: 'root'  }, // s3 f2: E
      { pitchClass: 7,  role: 'third' }, // s4 f0: G (minor third)
      { pitchClass: 11, role: 'fifth' }, // s5 f0: B
      { pitchClass: 4,  role: 'root'  }, // s6 f0: E
    ],
  },
  {
    // open A major (x02220)
    name: 'A', quality: 'major', anchorString: 2, anchorFret: 0,
    expected: [
      { pitchClass: 9,  role: 'root'  }, // s2 f0: A
      { pitchClass: 4,  role: 'fifth' }, // s3 f2: E
      { pitchClass: 9,  role: 'root'  }, // s4 f2: A
      { pitchClass: 1,  role: 'third' }, // s5 f2: C# (major third)
      { pitchClass: 4,  role: 'fifth' }, // s6 f0: E
    ],
  },
  {
    // open A minor (x02210)
    name: 'A', quality: 'minor', anchorString: 2, anchorFret: 0,
    expected: [
      { pitchClass: 9,  role: 'root'  }, // s2 f0: A
      { pitchClass: 4,  role: 'fifth' }, // s3 f2: E
      { pitchClass: 9,  role: 'root'  }, // s4 f2: A
      { pitchClass: 0,  role: 'third' }, // s5 f1: C (minor third)
      { pitchClass: 4,  role: 'fifth' }, // s6 f0: E
    ],
  },
  {
    // open G major (320003)
    name: 'G', quality: 'major', anchorString: 1, anchorFret: 3,
    expected: [
      { pitchClass: 7,  role: 'root'  }, // s1 f3: G
      { pitchClass: 11, role: 'third' }, // s2 f2: B (major third)
      { pitchClass: 2,  role: 'fifth' }, // s3 f0: D
      { pitchClass: 7,  role: 'root'  }, // s4 f0: G
      { pitchClass: 11, role: 'third' }, // s5 f0: B
      { pitchClass: 7,  role: 'root'  }, // s6 f3: G
    ],
  },
  {
    // Gm shape at fret 3 (B string omitted — see shapes.ts)
    name: 'G', quality: 'minor', anchorString: 1, anchorFret: 3,
    expected: [
      { pitchClass: 7,  role: 'root'  }, // s1 f3: G
      { pitchClass: 10, role: 'third' }, // s2 f1: B♭ (minor third)
      { pitchClass: 2,  role: 'fifth' }, // s3 f0: D
      { pitchClass: 7,  role: 'root'  }, // s4 f0: G
      { pitchClass: 7,  role: 'root'  }, // s6 f3: G
    ],
  },
  {
    // open D major (xx0232)
    name: 'D', quality: 'major', anchorString: 3, anchorFret: 0,
    expected: [
      { pitchClass: 2,  role: 'root'  }, // s3 f0: D
      { pitchClass: 9,  role: 'fifth' }, // s4 f2: A
      { pitchClass: 2,  role: 'root'  }, // s5 f3: D
      { pitchClass: 6,  role: 'third' }, // s6 f2: F# (major third)
    ],
  },
  {
    // open D minor (xx0231)
    name: 'D', quality: 'minor', anchorString: 3, anchorFret: 0,
    expected: [
      { pitchClass: 2,  role: 'root'  }, // s3 f0: D
      { pitchClass: 9,  role: 'fifth' }, // s4 f2: A
      { pitchClass: 2,  role: 'root'  }, // s5 f3: D
      { pitchClass: 5,  role: 'third' }, // s6 f1: F (minor third)
    ],
  },
  {
    // open C major (x32010)
    name: 'C', quality: 'major', anchorString: 2, anchorFret: 3,
    expected: [
      { pitchClass: 0,  role: 'root'  }, // s2 f3: C
      { pitchClass: 4,  role: 'third' }, // s3 f2: E (major third)
      { pitchClass: 7,  role: 'fifth' }, // s4 f0: G
      { pitchClass: 0,  role: 'root'  }, // s5 f1: C
      { pitchClass: 4,  role: 'third' }, // s6 f0: E
    ],
  },
  {
    // Dm chord in C minor shape (root D at A string fret 5)
    // C minor shape needs anchor fret ≥ 4 — no open-position Cm exists in standard tuning
    name: 'C', quality: 'minor', anchorString: 2, anchorFret: 5,
    expected: [
      { pitchClass: 2,  role: 'root'  }, // s2 f5: D
      { pitchClass: 5,  role: 'third' }, // s3 f3: F (minor third of Dm)
      { pitchClass: 9,  role: 'fifth' }, // s4 f2: A
      { pitchClass: 2,  role: 'root'  }, // s5 f3: D
      { pitchClass: 5,  role: 'third' }, // s6 f1: F
    ],
  },
];

describe('CAGED_SHAPES', () => {
  it.each(cases)('$name $quality at string $anchorString fret $anchorFret', (
    { name, quality, anchorString, anchorFret, expected }
  ) => {
    const shape = CAGED_SHAPES.find(s => s.name === name && s.quality === quality);
    expect(shape).toBeDefined();

    const resolved = shape!.notes.map(note => ({
      pitchClass: getNoteAt(anchorString + note.stringOffset, anchorFret + note.fretOffset).pitchClass,
      role: note.role,
    }));

    expect(resolved).toEqual(expected);
  });
});
