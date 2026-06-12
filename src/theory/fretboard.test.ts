import { describe, it, expect } from 'vitest';
import { getNoteAt } from './fretboard';

const cases: { string: number; fret: number; pitchClass: number; name: string }[] = [
  // open strings
  { string: 1, fret: 0, pitchClass: 4,  name: 'E'  },
  { string: 2, fret: 0, pitchClass: 9,  name: 'A'  },
  { string: 3, fret: 0, pitchClass: 2,  name: 'D'  },
  { string: 4, fret: 0, pitchClass: 7,  name: 'G'  },
  { string: 5, fret: 0, pitchClass: 11, name: 'B'  },
  { string: 6, fret: 0, pitchClass: 4,  name: 'E'  },

  // well-known fretted positions
  { string: 1, fret: 5,  pitchClass: 9,  name: 'A'  }, // low E string, 5th fret = A
  { string: 2, fret: 2,  pitchClass: 11, name: 'B'  }, // A string, 2nd fret = B
  { string: 4, fret: 5,  pitchClass: 0,  name: 'C'  }, // G string, 5th fret = C

  // flat spellings
  { string: 2, fret: 1,  pitchClass: 10, name: 'B♭' }, // A string, 1st fret = B♭
  { string: 3, fret: 1,  pitchClass: 3,  name: 'E♭' }, // D string, 1st fret = E♭

  // fret 12 repeats open (octave)
  { string: 1, fret: 12, pitchClass: 4,  name: 'E'  },
  { string: 2, fret: 12, pitchClass: 9,  name: 'A'  },
];

describe('getNoteAt', () => {
  it.each(cases)('string $string fret $fret = $name', ({ string, fret, pitchClass, name }) => {
    expect(getNoteAt(string, fret)).toEqual({ pitchClass, name });
  });
});
