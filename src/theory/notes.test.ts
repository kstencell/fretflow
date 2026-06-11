import { describe, it, expect } from 'vitest';
import { getKeyNotes } from './notes';
import type { Key, Note } from './types';

const cases: { key: Key; expected: Note[] }[] = [
  {
    key: { tonic: { pitchClass: 0, name: 'C' }, mode: 'major' },
    expected: [
      { pitchClass: 0, name: 'C' },
      { pitchClass: 2, name: 'D' },
      { pitchClass: 4, name: 'E' },
      { pitchClass: 5, name: 'F' },
      { pitchClass: 7, name: 'G' },
      { pitchClass: 9, name: 'A' },
      { pitchClass: 11, name: 'B' },
    ],
  },
  {
    key: { tonic: { pitchClass: 7, name: 'G' }, mode: 'major' },
    expected: [
      { pitchClass: 7, name: 'G' },
      { pitchClass: 9, name: 'A' },
      { pitchClass: 11, name: 'B' },
      { pitchClass: 0, name: 'C' },
      { pitchClass: 2, name: 'D' },
      { pitchClass: 4, name: 'E' },
      { pitchClass: 6, name: 'F#' },
    ],
  },
  {
    key: { tonic: { pitchClass: 5, name: 'F' }, mode: 'major' },
    expected: [
      { pitchClass: 5, name: 'F' },
      { pitchClass: 7, name: 'G' },
      { pitchClass: 9, name: 'A' },
      { pitchClass: 10, name: 'Bb' },
      { pitchClass: 0, name: 'C' },
      { pitchClass: 2, name: 'D' },
      { pitchClass: 4, name: 'E' },
    ],
  },
  {
    key: { tonic: { pitchClass: 9, name: 'A' }, mode: 'natural-minor' },
    expected: [
      { pitchClass: 9, name: 'A' },
      { pitchClass: 11, name: 'B' },
      { pitchClass: 0, name: 'C' },
      { pitchClass: 2, name: 'D' },
      { pitchClass: 4, name: 'E' },
      { pitchClass: 5, name: 'F' },
      { pitchClass: 7, name: 'G' },
    ],
  },
  {
    key: { tonic: { pitchClass: 4, name: 'E' }, mode: 'natural-minor' },
    expected: [
      { pitchClass: 4, name: 'E' },
      { pitchClass: 6, name: 'F#' },
      { pitchClass: 7, name: 'G' },
      { pitchClass: 9, name: 'A' },
      { pitchClass: 11, name: 'B' },
      { pitchClass: 0, name: 'C' },
      { pitchClass: 2, name: 'D' },
    ],
  },
];

describe('getKeyNotes', () => {
  it.each(cases)('$key.tonic.name $key.mode', ({ key, expected }) => {
    expect(getKeyNotes(key)).toEqual(expected);
  });
});
