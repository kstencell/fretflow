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

export type ChordToneRole = "root" | "third" | "fifth";

export type ShapeNote = {
  stringOffset: number; // string delta from the lowest root (0 = same string, -1 = one string higher, etc.)
  fretOffset: number;   // fret delta from the lowest root (can be negative)
  role: ChordToneRole;
};

export type CagedShapeName = "C" | "A" | "G" | "E" | "D";

export type CagedShape = {
  name: CagedShapeName;
  quality: Exclude<ChordQuality, "diminished">; // no CAGED shapes defined for diminished
  notes: ShapeNote[]; // all offsets relative to the lowest-string root in the shape
};

export type FretboardPosition = {
  string: number; // 1 = low E, 6 = high e
  fret: number;   // 0 = open, 1–12
  note: Note;
};

export type PlacedShape = {
  shape: CagedShape;
  chord: Chord;
  positions: (FretboardPosition & { role: ChordToneRole })[];
};
