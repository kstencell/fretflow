import type { ProgressionTemplate } from "./types";

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
