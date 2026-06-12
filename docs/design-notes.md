# FretFlow — Design Notes & Plan

> Living brainstorming doc. Captures decisions, rationale, scope boundaries, and
> the execution plan. Updated as we go.

## 0. The grading lens (why this doc is shaped the way it is)

This is a take-home for Origin. Two things are actually evaluated:

1. **Scope discipline** — a *finished* small tool beats an ambitious half-done one.
2. **How AI was used to build it** — where the human pushed back, caught mistakes,
   and shaped output. Git history + write-up are evidence.

Everything below optimizes for "small, complete, correct, and honestly documented"
over "impressive surface area."

## 1. Architecture principle: the trust boundary

The single most important design decision — and the strongest talking point because
it mirrors Origin's own thesis:

> **The deterministic core owns all musical truth. AI only suggests intent.**

- Musical coherence is guaranteed *by construction*: we pick a key, pick a diatonic
  Roman-numeral progression template, and realize it in that key. The harmony is
  correct because it can't be anything else. Only **fretboard position** is the
  degree of freedom we randomize.
- The AI "vibe" layer is optional sugar. It maps a freeform mood ("bluesy",
  "Ed Sheeran-ish") to a *choice among options the core already supports* — a
  progression template, chord-quality preference, practice note. It never emits a
  chord, a fret, or a shape. Its output is schema-constrained and whitelist-validated
  against the core's vocabulary; anything off-list falls back to deterministic random.

If we get nothing else right, get this boundary clean and well-tested.

## 2. Stack

**Decision: pure client-side static SPA. No backend.**

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript | Theory core is logic-heavy; types are the spec we hand to executor models. |
| Build/dev | Vite | Fast, zero-config, static output. |
| UI | React | Component model fits selectors + fretboard cleanly. |
| Styling | Tailwind | Clean look fast, no bikeshedding CSS architecture. |
| Fretboard render | Inline SVG | Debuggable, accessible, crisp. Not canvas. |
| Tests | Vitest | Same toolchain as Vite; theory core is TDD. |
| AI runtime call | `@anthropic-ai/sdk` in-browser (`dangerouslyAllowBrowser`) | User brings their own key. No server to deploy/secure. |
| Persistence | `localStorage` | Saved loops + API key. No DB. |
| Deploy | Static host (Vercel/Netlify/GH Pages) | One command, nothing to run. |

**Why no backend:** it's the scope-discipline move. BYO-key + client-side call means
the whole app is a static bundle — nothing to provision, nothing to break in a demo.
The tradeoff (the Anthropic call pattern is visible client-side, key lives in the
user's browser) is acceptable for a personal BYO-key tool and we'll note it in the
write-up rather than over-engineer around it.

**Runtime AI model:** Haiku 4.5 (`claude-haiku-4-5-20251001`). The vibe task is tiny
and structured — cheapest capable model, schema-constrained output. Good story:
right-sized model, not reflexively reaching for the biggest one.

## 3. Component map

### `src/theory/` — deterministic core (owns truth, exhaustively tested)

- **notes** — 12 pitch classes, enharmonic spelling per key.
- **keys/scales** — major + natural minor. Diatonic triads with qualities.
- **progressions** — catalog of named 4-chord Roman-numeral templates (`src/theory/progressions.ts`), each tagged with one or more genres. Template → concrete chords in a key.
- **caged** — the 5 movable shapes (C, A, G, E, D) as templates: relative fret
  offsets per string, root string, chord-tone roles. Map a chord → a CAGED shape
  that lands inside the selected neck region.
- **fretboard** — strings × frets grid; note at each position; which positions are
  roots vs. other chord tones for a given chord+shape.
- **validation** — region playability; whitelist of progression types & qualities
  the AI layer is allowed to reference.

### `src/ui/` — presentation

- Key selector · neck-region selector (open / 3–7 / 5–9 / full) · vibe-or-freeform
  input · generate/regenerate · fretboard SVG (highlight roots, chord tones, shape
  name, movement hint) · progression list · save-loop.

### `src/ai/` — optional creative layer

- Prompt builder · structured output via tool/JSON schema · whitelist validation
  against `theory/validation` vocabulary · deterministic fallback on
  error/invalid/missing · API-key entry + localStorage.

## 4. Scope

**In v1 (the finished small tool):**
- Major + natural-minor keys.
- **Triads only** (no 7ths/extensions).
- 5 CAGED shapes.
- ~5 progression templates (pop, folk, blues, minor, random).
- SVG fretboard with roots/chord-tones/shape-name/simple movement hint.
- Deterministic generation end-to-end, fully working *without* any API key.

**Explicitly out of v1:**
- 7th chords, modes, scale overlays, chord-tone targeting.
- Backing tracks / audio playback.
- Smart voice-leading. Movement hint = simple "shift N frets to nearest shape."
- Neck region filtering (deferred — pick a random valid placement from frets 0–12 for now).
- Accounts / sync / backend of any kind.

**Stretch (only if core is done + tested):**
- AI vibe layer (it's a *stretch*, not the spine — the app must be complete without it).
- Neck region selector + region-filtered placement.
- Saved practice history beyond a single localStorage list.

## 5. Risks & where the "AI build story" lives

- **CAGED mapping is the hard part.** All 5 shapes, every key, every region, correct
  chord tones — fiddly and easy to get subtly wrong. This is exactly where an LLM will
  *confidently* produce wrong fretboard data. So: concentrate tests here, and the
  human-in-the-loop verification (checking shapes against a real guitar / known
  references and rejecting bad model output) is a *primary* AI-collaboration anecdote
  for the write-up. Capture these moments as they happen.
- **Enharmonic spelling** (G♯ vs A♭) is a classic place to look correct but be wrong.
  Test against known key signatures.
- **Scope creep via "movement hints"** — keep it dumb on purpose.

## 6. Execution plan (sized for simpler executor models)

> The actionable, checkbox version of this lives in `docs/plan.md` — this section is
> the rationale; that file is the do-list the executor model works through.

Principle: define **type contracts first**, then implement each module behind them.
The theory core has objective right answers → **TDD**: write the table of expected
outputs (known keys/chords/shapes) before implementing. This makes each task
self-checking and safe to hand to a Sonnet/Haiku-level executor without architectural
judgment calls.

- **Phase 0 — scaffold:** Vite + React + TS + Tailwind + Vitest; CI-free, just
  `dev`/`build`/`test`. Define core TypeScript types (Note, Key, Chord, Progression,
  Shape, FretboardPosition) — these are the spec. ✅
- **Phase 1 — theory: notes + scales + diatonic chords.** TDD against known key
  signatures and diatonic triads. ✅ (`notes.ts` + `chords.ts`, 8 tests)
- **Phase 2 — theory: progression templates → concrete chords.** TDD. ✅ (`realizeProgression` in `progressions.ts`, 2 tests)
- **Phase 3 — theory: CAGED shapes + fretboard positions.** Heaviest testing. Human verification pass. ✅ (`fretboard.ts`, `shapes.ts`, `placement.ts`; 42 tests. Region filtering deferred to stretch.) Placement extended post-session: fret wrapping via `getNoteAt(% 12)`, root scan to fret 12, root-at-12 guard.
- **Phase 4 — UI: selectors + generate + progression list.** Wire to core. ✅ Full landing page complete: CAGED explainer (dark section, 5 shape cards), `KeySelector`, `ProgressionSelector` (mode-filtered), Generate button, chord + fretboard display (random shape per chord), footer. Font: Space Grotesk 700.
- **Phase 5 — UI: SVG fretboard render.** Roots, chord tones, shape name, movement hint. ✅ `FretboardDiagram` wired into both the CAGED explainer and the dynamic progression display. `showLabel` prop added.
- **Phase 5b — UI: full-neck diagram.** ✅ `FullNeckDiagram` replaces per-chord cards. Wood-toned SVG neck, all 4 chord shapes overlaid, active/inactive dot coloring (green + blue root ring / gray), chord selector buttons, responsive orientation (landscape ≥768px / portrait <768px via `useIsNarrow` hook).
- **Phase 6 — save loops (localStorage).** Minimal.
- **Phase 7 (stretch) — AI vibe layer.** Schema-constrained Haiku call, whitelist
  validation, deterministic fallback, key entry.
- **Phase 8 — WRITEUP.md.** Architecture, the trust boundary, and the honest
  AI-collaboration story (including caught mistakes).

Each phase = a legible commit (or few). Keep history clean — it's graded evidence.

## 7. Decisions (locked 2026-06-11)

- **Stack:** static SPA, no backend. BYO-key, client-side Anthropic call. ✅
- **Theory scope:** major + natural minor, **triads only**. No harmonic minor, no
  7ths in v1. Minor progressions stay diatonic to natural minor (`v`, not `V`). ✅
- **Progressions:** fixed catalog of **4-chord templates only**. Genre is a multi-value
  tag on each template (not a 1:1 identifier). No `random` template type — random
  means pick randomly from the catalog at runtime. ✅
- **AI vibe layer:** strictly a **stretch** — deterministic app ships complete and
  fully usable with no key entered; AI added only if time remains. ✅

## 8. CAGED placement model (decided 2026-06-12)

- **Puzzle-piece scan:** shape template = `{ stringOffset, fretOffset, role }` offsets from lowest-string root. Placement scans fretboard for root note positions, overlays template, verifies all chord tones match. No hardcoded anchor string — valid placements emerge from the scan.
- **Fret scope (revised 2026-06-12):** root scan covers frets 0–12. For roots at frets 0–11, shape notes may extend beyond fret 12 (rendered with real fret numbers; `getNoteAt` wraps via `% 12`). Root at fret 12 only if every other note is also ≤ 12 — this admits backward-looking shapes (G, C) without duplicating forward-looking ones (E, A, D). Region filtering deferred.
- **Quality-specific shapes:** `CagedShape.quality: 'major' | 'minor'`. Diminished shapes skipped for v1.
- **Gm shape:** B string omitted (minor third unreachable in open position).

## 9. Still open

- Deploy target (Vercel / Netlify / GH Pages / just `dev`) — decide near the end;
  doesn't affect the build.
- **CAGED shape data verified ✅** — Karl completed the pass; shapes look correct. `VerificationPage` now lives at `/all-chords` as a permanent diagnostic tool.
- **UI theme (locked 2026-06-12, font updated 2026-06-12):** light background (`#f0f5ff`), blue-500 accent, Space Grotesk 700 display font (switched from Syne 800 — too wide/fat at large sizes), DM Sans body. All sections complete.
- **Full-neck diagram (2026-06-12):** `FullNeckDiagram` — wood-gradient SVG neck, all progression chords overlaid simultaneously, active chord green (`#4ade80`) + blue root ring (`#3b82f6`), inactive gray. Chord selector buttons below neck. Responsive: landscape ≥768px, portrait <768px. `FretboardDiagram` retained for CAGED explainer section.

## 9. AI usage tracking (meta-tooling)

A side goal that mirrors Origin's own thesis: make *how much AI effort went where*
observable. We attribute Claude Code's real token usage (read from the session
transcripts at `~/.claude/projects/.../*.jsonl`, which carry exact per-message
`usage` + `model`) to coarse, domain-agnostic **PM buckets**, and the `/clean-up`
skill renders a rollup into `docs/ai-usage.md` (tokens + estimated $ per bucket/model).

This is **approximate by design** — meant to show *trends* ("most effort went to app
logic and debugging"), not exact accounting. Imperfect bucketing is fine.

**Buckets** (broad, agnostic to the guitar domain):

| bucket | covers |
|---|---|
| `planning-docs` | design decisions, journaling, writing/updating docs, the working agreement |
| `scaffolding` | devcontainer, installing tools/deps, build config, CI/GitHub Actions, repo setup |
| `app-logic` | schemas, types, classes, core domain logic (the SPA's "backend") |
| `ui` | components, layout, styling, visual design |
| `testing` | writing and running tests |
| `debugging` | diagnosing and fixing things that don't work |

**Attribution = sub-conversation tagging.** Tokens are counted into whichever bucket
was *active* at each message's timestamp. The active bucket is set by **marks**.

**Mark sidecar — the contract everything else reads:**

- **File:** `docs/ai-usage.marks.jsonl` — append-only, one JSON object per line, sits
  beside the rendered ledger as the raw data behind it.
- **Record shape:**

  ```json
  { "ts": "2026-06-11T14:30:00Z", "bucket": "app-logic", "note": "chord schema" }
  ```

  - `ts` — ISO-8601 UTC instant the bucket became active.
  - `bucket` — one of the six enum values above.
  - `note` *(optional)* — short human label of what we're doing; for skimming only.

- **Active-bucket rule:** a transcript message belongs to the bucket of the *most
  recent mark with `ts` at-or-before that message's timestamp*. A new mark switches
  the bucket from that instant on; messages before the first mark are unattributed.
- Marks are dropped as focus shifts (usually by Claude); they're a tiny plain-text
  file, so Karl can edit/insert/fix a boundary by hand at any time.

**Implementation notes (as built so far):**

- `usage_report.py` (in the clean-up skill) is the adder-upper: reads transcripts +
  marks, dedups messages by uuid, buckets via the active-mark rule, prices per model.
- **Cost is split** into *work* $ (fresh input + output) vs *context* $ (cache).
  Cache is priced at multiples of the input rate — reads ~0.1×, writes ~1.25× — so it's
  already discounted to roughly real billing; the split just exposes that carrying
  context, not generating, dominates a session's bill.
- **Path-keyed gotcha:** the transcript dir is named from the repo *path*
  (`/home/karl/repos/fretflow` → `-home-karl-repos-fretflow`). Reusing a folder name for
  a different project mixes their logs together — purge stale transcripts/memories when
  restarting fresh (done once already, June 11).
- `mark.py` (in the clean-up skill) is the mark writer: `mark.py <bucket> [note...]`
  auto-stamps `ts` (UTC now), enum-validates the bucket, appends one record. Hand-edits
  to the marks file are still fair game for fixing/retconning boundaries (done once —
  the whole 2026-06-11 planning session was retconned to `planning-docs`).
- The clean-up skill's **Step 0** reconstructs the conversation's marks from hindsight
  (then marks the clean-up work itself `planning-docs`) — the reliable place to set
  boundaries, since live marking gets forgotten.
- Not built yet: the persisted `docs/ai-usage.md` ledger (renderer + rollup).
