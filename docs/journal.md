# FretFlow — Conversation Journal

## 2026-06-11 — Ground rules, planning, AI usage tooling

**Done:**
- `CLAUDE.md` — one-baby-step working agreement; Karl drives, no autonomous sprints.
- `docs/design-notes.md` — architecture, stack, scope, phased plan. Core principle: deterministic theory core owns all musical truth; AI is optional stretch.
- `.claude/skills/clean-up/SKILL.md` — `/clean-up` skill for end-of-session journaling + handoff.
- `docs/ai-usage.marks.jsonl` + `mark.py` — timestamped bucket marks for attributing transcript tokens to PM buckets.
- `.claude/skills/clean-up/usage_report.py` — reads transcripts + marks, outputs cost breakdown by bucket.
- `docs/plan.md` — phased build checklist.

## 2026-06-11 — Scaffold and theory core (Phases 0–2)

**Done:**
- `.devcontainer/devcontainer.json` — Node 20, port 5173 forwarded.
- Vite + React + TS + Tailwind + Vitest stack installed and verified.
- `src/theory/types.ts` — core types: `Note`, `Key`, `Chord`, `ProgressionTemplate`, `CagedShape`, etc.
- `src/theory/progressions.ts` — `PROGRESSION_TEMPLATES` catalog (7 templates, genre-tagged).
- `src/theory/notes.ts`, `chords.ts` — `getKeyNotes`, `getDiatonicChords`, `realizeProgression`. 11 tests passing.

## 2026-06-12 — Theory core: CAGED shapes + placement (Phase 3)

**Decisions:**
- Puzzle-piece placement: shape templates store offsets from lowest-string root; placement scans fretboard and verifies chord tones. No hardcoded anchor string.
- Quality-specific shapes (major/minor). Diminished skipped for v1.
- Root scan frets 0–12; root at fret 12 only if all other notes ≤ 12.

**Done:**
- `src/theory/fretboard.ts` — `FRETBOARD` matrix, `getNoteAt` (wraps via `% 12`).
- `src/theory/shapes.ts` — 10 CAGED shapes (5 names × major + minor).
- `src/theory/placement.ts` — `placeShape`: quality guard → chord-tones → scan → verify.
- 42 tests passing across fretboard, shapes, placement.

## 2026-06-12 — UI: fretboard diagram + verification page

**Done:**
- `src/ui/FretboardDiagram.tsx` — SVG chord diagram; horizontal layout (nut left, low E bottom); role-based dot colors; note names; fret label.
- `src/ui/VerificationPage.tsx` — all 10 shapes across 16 chords for visual verification. Route: `/all-chords`.

## 2026-06-12 — UI: full landing page (Phase 4)

**Done:**
- `react-router-dom` added; `/` → `HomePage`, `/all-chords` → `VerificationPage`.
- `src/ui/KeySelector.tsx` — 12 root buttons + major/minor toggle.
- `src/ui/ProgressionSelector.tsx` — mode-filtered template grid.
- `src/ui/HomePage.tsx` — hero, CAGED explainer, app section with generate flow, footer.

## 2026-06-12 — UI: full-neck diagram + acoustic redesign

**Done:**
- `src/ui/FullNeckDiagram.tsx` — rosewood SVG neck; all 4 chords overlaid; role-based dots; chord selector buttons; landscape/portrait via `useIsNarrow` hook.
- `src/ui/RoleLegend.tsx` — shared legend component.
- Full visual redesign: Fraunces 700 + Lora, cream `#f4ede0` / walnut `#2d1a0e` / brass `#c4882a`. Role dot colors locked: root = steel blue + amber border, third = ivory, fifth = amber gold.
- `src/ui/KeySelector.tsx` rewritten: two-row fret-dot grid, animated mode toggle.

## 2026-06-14 — UI: hero polish, mobile layout, chord toggle, deploy

**Done:**
- Hero: fretboard line decoration with SVG gradient mask; cream glow; tagline locked: *"Rote learning made beautiful."*
- `KeySelector` `compact` prop for narrow screens; app section padding mobile fix.
- Neck/Chords view toggle (`viewMode` state); chord card grid in Chords mode.
- Footer centred; GitHub attribution link added.
- `FretboardDiagram.tsx` fret label spacing fix (`PAD_BOTTOM` 20→28).
- `gh-pages` deploy; `public/CNAME` → `fretflow.ca`; favicon, OG tags, `theme-color`.
- Live at [fretflow.ca](https://fretflow.ca).

## 2026-06-14 — Docs: README + AI usage ledger

**Done:**
- `README.md` — replaced Vite boilerplate with project README (what it does, architecture, stack, dev commands).
- `docs/ai-usage.md` — token/cost breakdown by bucket, Mermaid pie charts, how-tracking-works explanation.
- `docs/ai-usage.marks.jsonl` + `mark.py` + `usage_report.py` — renamed `scaffolding` → `tooling`.
- `/clean-up` skill updated: Step 1 refreshes `ai-usage.md` automatically; journal brevity rules added; doc pruning instruction added.
- Journal compacted.

**Open threads:**
- Phase 7 (AI vibe layer) — stretch, not started.
- Phase 8 (WRITEUP.md) — not started.
- UX polish: stale display on key/template change; Generate→Regenerate label.

## 2026-06-15 — Docs housekeeping + clean-up skill improvements

**Done:**
- `docs/plan.md` — ticked off phases 0–5, collapsed to ✅ block; only Phase 7 stretch + Phase 8 write-up remain.
- `/clean-up` skill — added Step 1 (auto-refresh `ai-usage.md`), brevity rules for journal, doc-pruning instruction, `plan.md` sync step.
- `docs/journal.md` — compacted from 477 lines to ~70.
- `docs/ai-usage.marks.jsonl`, `mark.py`, `usage_report.py` — renamed `scaffolding` → `tooling`.
- `docs/ai-usage.md` — updated numbers after new usage report run ($83.17 total).

## 2026-06-15 — README Claude Code section + AI usage callout

**Focus:** Document how to use `/clean-up` effectively and surface the AI usage tracking in the README.

**Done:**
- `README.md` — added "Working with Claude Code" section: `/clean-up` usage guide, Python 3 host requirement and why (Claude runs on host, not devcontainer).
- `README.md` — added "AI usage" section above Architecture, linking to `docs/ai-usage.md`.
- `docs/ai-usage.md` — updated numbers ($85.01 total, 1,690 messages).
