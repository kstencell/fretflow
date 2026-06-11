import { describe, it, expect } from 'vitest';
import { realizeProgression, PROGRESSION_TEMPLATES } from './progressions';
import type { Key, Progression } from './types';

const cMajor: Key = { tonic: { pitchClass: 0, name: 'C' }, mode: 'major' };
const aMinor: Key = { tonic: { pitchClass: 9, name: 'A' }, mode: 'natural-minor' };

const axis = PROGRESSION_TEMPLATES.find(t => t.id === 'axis')!;
const minorAnthem = PROGRESSION_TEMPLATES.find(t => t.id === 'minor-anthem')!;

const cases: { label: string; template: typeof axis; key: Key; expected: Progression['chords'] }[] = [
  {
    label: 'Axis of Awesome in C major (I V vi IV)',
    template: axis,
    key: cMajor,
    expected: [
      { root: { pitchClass: 0, name: 'C' }, quality: 'major' },
      { root: { pitchClass: 7, name: 'G' }, quality: 'major' },
      { root: { pitchClass: 9, name: 'A' }, quality: 'minor' },
      { root: { pitchClass: 5, name: 'F' }, quality: 'major' },
    ],
  },
  {
    label: 'Minor Anthem in A natural minor (i VI III VII)',
    template: minorAnthem,
    key: aMinor,
    expected: [
      { root: { pitchClass: 9, name: 'A' }, quality: 'minor' },
      { root: { pitchClass: 5, name: 'F' }, quality: 'major' },
      { root: { pitchClass: 0, name: 'C' }, quality: 'major' },
      { root: { pitchClass: 7, name: 'G' }, quality: 'major' },
    ],
  },
];

describe('realizeProgression', () => {
  it.each(cases)('$label', ({ template, key, expected }) => {
    const result = realizeProgression(template, key);
    expect(result.key).toEqual(key);
    expect(result.template).toEqual(template);
    expect(result.chords).toEqual(expected);
  });
});
