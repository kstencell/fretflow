import type { Key, Progression, ProgressionTemplate } from "./types";
import { getDiatonicChords } from "./chords";

const NUMERAL_TO_DEGREE: Record<string, number> = {
  I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6,
};

function numeralToDegree(numeral: string): number {
  return NUMERAL_TO_DEGREE[numeral.toUpperCase().replace('°', '')];
}

export function realizeProgression(template: ProgressionTemplate, key: Key): Progression {
  const diatonic = getDiatonicChords(key);
  const chords = template.numerals.map(n => diatonic[numeralToDegree(n)]) as Progression['chords'];
  return { key, template, chords };
}

export const PROGRESSION_TEMPLATES: ProgressionTemplate[] = [
  {
    id: "axis",
    label: "Axis of Awesome",
    numerals: ["I", "V", "vi", "IV"],
    genres: ["pop", "rock"],
  },
  {
    id: "fifties",
    label: "50s Changes",
    numerals: ["I", "vi", "IV", "V"],
    genres: ["pop", "rock", "country"],
  },
  {
    id: "three-chord",
    label: "Three-Chord Classic",
    numerals: ["I", "IV", "V", "I"],
    genres: ["blues", "rock", "country", "folk"],
  },
  {
    id: "pop-standard",
    label: "Pop Standard",
    numerals: ["I", "IV", "vi", "V"],
    genres: ["pop", "rock"],
  },
  {
    id: "minor-anthem",
    label: "Minor Anthem",
    numerals: ["i", "VI", "III", "VII"],
    genres: ["pop", "rock", "minor"],
  },
  {
    id: "minor-rock",
    label: "Minor Rock",
    numerals: ["i", "VII", "VI", "VII"],
    genres: ["rock", "minor"],
  },
  {
    id: "natural-minor-loop",
    label: "Natural Minor Loop",
    numerals: ["i", "iv", "v", "i"],
    genres: ["folk", "minor"],
  },
];
