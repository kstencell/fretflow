export type Note = {
  pitchClass: number; // 0 = C, 1 = C#/Db, 2 = D, … 11 = B
  name: string;       // enharmonic spelling for the active key, e.g. "F#" or "Gb"
};

export type Mode = "major" | "natural-minor";

export type ChordQuality = "major" | "minor" | "diminished";

export type Key = {
  tonic: Note;
  mode: Mode;
};

export type Chord = {
  root: Note;
  quality: ChordQuality;
};

export type Genre = "pop" | "rock" | "country" | "folk" | "blues" | "minor";

export type ProgressionTemplate = {
  id: string;
  label: string;
  numerals: [string, string, string, string];
  genres: Genre[];
};

export type Progression = {
  key: Key;
  template: ProgressionTemplate;
  chords: [Chord, Chord, Chord, Chord];
};
