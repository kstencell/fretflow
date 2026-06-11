import type { Chord, ChordQuality, Key } from './types';
import { getKeyNotes } from './notes';

const MAJOR_QUALITIES: ChordQuality[] = [
  'major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished',
];

const MINOR_QUALITIES: ChordQuality[] = [
  'minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major',
];

export function getDiatonicChords(key: Key): Chord[] {
  const notes = getKeyNotes(key);
  const qualities = key.mode === 'major' ? MAJOR_QUALITIES : MINOR_QUALITIES;
  return notes.map((note, i) => ({ root: note, quality: qualities[i] }));
}
