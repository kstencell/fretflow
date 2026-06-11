# FretFlow — Build Checklist

> The actionable do-list. `design-notes.md` is the *why* (decisions, scope, trust
> boundary); this is the *what next*, sized for a cheaper executor model.

## How to use this

- **One box = one baby step.** Do exactly one, stop, explain it, wait for go-ahead.
  CLAUDE.md still governs — same agreement, cheaper model. No running ahead, no
  finishing a phase "while I'm at it."
- **Theory core is TDD.** Where there's an objective right answer, write the
  expected-output table *first*, then implement to green. The test table is its own
  checklist item, before the implementation item.
- **Usage marks:** when the *kind* of work shifts, drop a mark (`mark.py`) so usage
  attributes correctly — see design-notes §9. Not embedded per-step on purpose.
- **⛔ = a gate:** a decision/confirmation that must happen before the items under it.
- Check a box only when it's done *and* (for theory) its tests are green.

---

## ⛔ Open decision blocking Phase 3 (and two Phase 0.5 types)

- [ ] **Nail down the CAGED data model + who authors it.** §5 flags CAGED as the
      error-prone, SME-heavy part where an LLM will confidently emit wrong fretboard
      data. Decide: the exact shape of the CAGED data (offsets per string, root
      string, chord-tone roles) **and** whether Karl authors/verifies it vs. the
      executor generates + Karl verifies against a guitar. This shapes the `Shape` and
      `FretboardPosition` types and all of Phase 3. **Resolve before coding either.**

---

## Phase 0 — Scaffold

- [ ] Init Vite + React + TS; `npm run dev` serves a blank page.
- [ ] Add Tailwind; a styled element renders.
- [ ] Add Vitest; a trivial test runs green.
- [ ] Confirm `dev` / `build` / `test` scripts all work.

## Phase 0.5 — Core type contracts (the spec)

- [ ] `Note` / pitch-class representation (12 pitch classes; enharmonic spelling).
- [ ] `Key` (tonic + mode: `major` | `natural-minor`).
- [ ] `Chord` (root + quality: major / minor / diminished triad).
- [ ] `Progression` (key + ordered chords + template name).
- [ ] *(blocked by the CAGED gate)* `Shape` — CAGED shape template.
- [ ] *(blocked by the CAGED gate)* `FretboardPosition` — string, fret, note, role.

## Phase 1 — Theory: notes, scales, diatonic chords (TDD)

- [ ] Test table: pitch-class ↔ name, sharps/flats per key.
- [ ] Implement note / pitch-class helpers to green.
- [ ] Test table: major scale for known keys (C, G, F, …).
- [ ] Implement major scale builder.
- [ ] Test table: natural-minor scale for known keys.
- [ ] Implement natural-minor scale builder.
- [ ] Test table: diatonic triads + qualities, major key.
- [ ] Implement diatonic-triad builder (major).
- [ ] Test table: diatonic triads, natural-minor key (`v`, not `V`).
- [ ] Implement diatonic-triad builder (minor).
- [ ] Enharmonic spelling check against known key signatures (§5 risk).

## Phase 2 — Theory: progression templates → concrete chords (TDD)

- [ ] Define the ~5 templates as Roman-numeral data (pop I–V–vi–IV, folk, blues,
      minor i–VI–III–VII, random).
- [ ] Test table: template + key → expected concrete chords.
- [ ] Implement `realize(template, key)` → chords.
- [ ] Random template (seedable so tests stay deterministic).

## Phase 3 — Theory: CAGED + region mapping + fretboard (heaviest tests)

> ⛔ Resolve the CAGED gate above before any item here.

- [ ] Encode the 5 CAGED shape templates (per the resolved approach).
- [ ] Test table: each shape's chord tones for a known chord (verify vs. guitar).
- [ ] Implement chord → CAGED shape selection within a neck region.
- [ ] Test: region playability (open / 3–7 / 5–9 / full).
- [ ] Implement fretboard position grid (note + role at each string/fret).
- [ ] **Human verification pass:** shapes against a real guitar / references.
- [ ] Movement hint: "shift N frets to nearest shape" (keep it dumb on purpose).

## Phase 4 — UI: selectors + generate + progression list

- [ ] Key selector component.
- [ ] Neck-region selector component.
- [ ] Vibe / freeform input component (inert for now — AI is stretch).
- [ ] Generate / regenerate button wired to the core.
- [ ] Progression list display.

## Phase 5 — UI: SVG fretboard

- [ ] Static SVG fretboard grid (strings × frets).
- [ ] Highlight roots vs. chord tones.
- [ ] Shape-name label.
- [ ] Movement-hint display.

## Phase 6 — Save loops (localStorage)

- [ ] Save current loop to localStorage.
- [ ] List saved loops.
- [ ] Load / delete a saved loop.

## Phase 7 — STRETCH: AI vibe layer

> ⛔ Only after the core is complete *and* tested.

- [ ] Confirm with Karl the core is done + tested before starting.
- [ ] API-key entry + localStorage.
- [ ] Export the allowed vocabulary from `theory/validation`.
- [ ] Prompt builder.
- [ ] Schema-constrained Haiku call (`claude-haiku-4-5`).
- [ ] Whitelist-validate the model's output.
- [ ] Deterministic fallback on error / invalid / missing.

## Phase 8 — Write-up & ship

- [ ] `WRITEUP.md`: architecture + the trust boundary.
- [ ] AI-collaboration story (caught mistakes, CAGED verification moments).
- [ ] Usage-tracking rollup into `docs/ai-usage.md`.
- [ ] Decide deploy target (Vercel / Netlify / GH Pages) and deploy.
