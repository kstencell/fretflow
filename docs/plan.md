# FretFlow — Build Checklist

> The actionable do-list. `design-notes.md` is the *why*; this is the *what next*.
> One box = one baby step. CLAUDE.md governs — no running ahead.

---

## ✅ Phases 0–5 — Complete

- Phase 0: Vite + React + TS + Tailwind + Vitest scaffold.
- Phase 0.5: Core type contracts (`Note`, `Key`, `Chord`, `Progression`, `CagedShape`, `FretboardPosition`, etc.).
- Phase 1: Theory core — `getKeyNotes`, `getDiatonicChords`. TDD, 11 tests.
- Phase 2: `realizeProgression`. TDD.
- Phase 3: CAGED shapes + `placeShape` algorithm. 42 tests. Human verification pass done.
- Phase 4: `KeySelector`, `ProgressionSelector`, `HomePage` generate flow.
- Phase 5: `FretboardDiagram` SVG + `FullNeckDiagram` full-neck view. Neck/Chords toggle.

**Deferred from scope:** movement hints, neck-region filtering, Phase 6 save loops (localStorage).

---

## Phase 7 — STRETCH: AI vibe layer

> Only after Karl confirms the write-up is done and there's time.

- [ ] API-key entry + localStorage.
- [ ] Prompt builder + schema-constrained Haiku call (`claude-haiku-4-5`).
- [ ] Whitelist-validate output against `theory/validation` vocabulary.
- [ ] Deterministic fallback on error / invalid / missing key.

---

## Phase 8 — Ship

- [x] Deploy to `fretflow.ca` (GitHub Pages). ✅
- [x] `docs/ai-usage.md` — token/cost breakdown with charts. ✅
