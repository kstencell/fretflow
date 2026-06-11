import { describe, it, expect } from 'vitest';
import { getDiatonicChords } from './chords';
import type { Chord, Key } from './types';

const cases: { key: Key; expected: Chord[] }[] = [
  {
    key: { tonic: { pitchClass: 0, name: 'C' }, mode: 'major' },
    expected: [
      { root: { pitchClass: 0, name: 'C' }, quality: 'major' },
      { root: { pitchClass: 2, name: 'D' }, quality: 'minor' },
      { root: { pitchClass: 4, name: 'E' }, quality: 'minor' },
      { root: { pitchClass: 5, name: 'F' }, quality: 'major' },
      { root: { pitchClass: 7, name: 'G' }, quality: 'major' },
      { root: { pitchClass: 9, name: 'A' }, quality: 'minor' },
      { root: { pitchClass: 11, name: 'B' }, quality: 'diminished' },
    ],
  },
  {
    key: { tonic: { pitchClass: 7, name: 'G' }, mode: 'major' },
    expected: [
      { root: { pitchClass: 7, name: 'G' }, quality: 'major' },
      { root: { pitchClass: 9, name: 'A' }, quality: 'minor' },
      { root: { pitchClass: 11, name: 'B' }, quality: 'minor' },
      { root: { pitchClass: 0, name: 'C' }, quality: 'major' },
      { root: { pitchClass: 2, name: 'D' }, quality: 'major' },
      { root: { pitchClass: 4, name: 'E' }, quality: 'minor' },
      { root: { pitchClass: 6, name: 'F#' }, quality: 'diminished' },
    ],
  },
  {
    key: { tonic: { pitchClass: 9, name: 'A' }, mode: 'natural-minor' },
    expected: [
      { root: { pitchClass: 9, name: 'A' }, quality: 'minor' },
      { root: { pitchClass: 11, name: 'B' }, quality: 'diminished' },
      { root: { pitchClass: 0, name: 'C' }, quality: 'major' },
      { root: { pitchClass: 2, name: 'D' }, quality: 'minor' },
      { root: { pitchClass: 4, name: 'E' }, quality: 'minor' },
      { root: { pitchClass: 5, name: 'F' }, quality: 'major' },
      { root: { pitchClass: 7, name: 'G' }, quality: 'major' },
    ],
  },
];

describe('getDiatonicChords', () => {
  it.each(cases)('$key.tonic.name $key.mode', ({ key, expected }) => {
    expect(getDiatonicChords(key)).toEqual(expected);
  });
});
