import type { Key, Note } from './types';

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NATURAL_PC: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
};

export function getKeyNotes(key: Key): Note[] {
  const intervals = key.mode === 'major' ? MAJOR_INTERVALS : MINOR_INTERVALS;
  const tonicLetterIdx = LETTERS.indexOf(key.tonic.name[0]);

  return intervals.map((interval, degree) => {
    const pitchClass = (key.tonic.pitchClass + interval) % 12;
    const letter = LETTERS[(tonicLetterIdx + degree) % 7];
    const diff = (pitchClass - NATURAL_PC[letter] + 12) % 12;
    const accidental = diff === 0 ? '' : diff === 1 ? '#' : 'b';
    return { pitchClass, name: letter + accidental };
  });
}
