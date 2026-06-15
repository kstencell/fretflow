# FretFlow — Conversation Journal

## 2026-06-11 — Planning, ground rules & tooling

**Focus:** Turn the project description into concrete decisions, set strict
human-in-the-loop working rules, and build a clean-up/handoff skill — before any code.

**Decisions:**
- Architecture spine = trust boundary: deterministic core owns all musical truth;
  AI only suggests *intent* (schema-constrained, whitelist-validated, deterministic
  fallback). This is also the headline talking point for the Origin grading.
- Stack: static SPA, **no backend**. Vite + React + TS + Tailwind, SVG fretboard,
  BYO-key client-side Anthropic call. Runtime AI model = Haiku 4.5.
- Theory scope for v1: major + natural minor, **triads only** (no harmonic minor,
  no 7ths). Minor progressions stay diatonic to natural minor (`v`, not `V`).
- AI vibe layer is **strictly a stretch** — app must be fully usable with no key.
- Working agreement: **one baby step at a time**; Karl is the driver/SME and must own
  every part by the end. No autonomous sprints (a prior attempt did the whole project
  unsupervised — that's the failure mode we're preventing).

**Done:**
- `docs/design-notes.md` — full living plan: grading lens, trust-boundary principle,
  stack table, component map (`theory/`/`ui/`/`ai/`), in/out scope, risk callout
  (CAGED is the hard, error-prone part + where the AI-collab story lives), phased TDD
  execution plan (0–8), and locked decisions.
- `CLAUDE.md` — strict collaboration ground rules (one unit of work per step, propose→
  do→explain→stop, no running ahead, Karl stays SME).
- `.claude/skills/clean-up/SKILL.md` — `/clean-up` skill: journal entry → surgical doc
  updates → paste-ready handoff prompt.

**Open threads:**
- No code written yet. Next agreed step (from design-notes Phase 0/1): define the core
  TypeScript types (`Note`, `Key`, `Chord`, `Progression`, `Shape`, `FretboardPosition`)
  — possibly after pressure-testing the CAGED model on paper first, since its data shape
  informs `Shape`/`FretboardPosition`. Karl to decide which.
- Deploy target (Vercel / Netlify / GH Pages) deferred until the end.

## 2026-06-11 — AI usage tracking (meta-tooling)

**Focus:** Build observability into our own process — attribute Claude Code token/$
usage to coarse PM buckets, so Karl can show *how much AI effort went where* (an
Origin-flavored angle). Still no app code; this is tooling.

**Decisions:**
- Source of truth = the session transcripts (`~/.claude/projects/.../*.jsonl`), which
  carry real per-message `usage` + `model`. We compute from logs, not estimates —
  same deterministic-core principle as the app itself.
- Six domain-agnostic buckets: `planning-docs`, `scaffolding`, `app-logic`, `ui`,
  `testing`, `debugging`. Attribution = **sub-conversation tagging** via timestamped
  "marks"; a message counts toward the most-recent mark at-or-before its ts.
- Report both **tokens and estimated $**, rendered (eventually) into `docs/ai-usage.md`.
  Approximate by design — trends, not accounting.
- Cost is **split**: *work* $ (fresh input + output) vs *context* $ (cache). Cache is
  priced at real multiples of the input rate (reads ~0.1×, writes ~1.25×), not full
  price — so cache is already discounted, and the split shows that context-carrying,
  not generation, dominates a session's bill.
- **Purged last night's session.** Name-reuse trap: the transcript dir is keyed by repo
  *path*, so a deleted same-named project (June 10) was poisoning totals (~31M tokens /
  ~$35, 88% of the bill). Deleted that transcript + its memory note; clean slate.

**Done:**
- `docs/design-notes.md` §9 — documents the usage-tracking design + the **mark sidecar
  contract**: `docs/ai-usage.marks.jsonl`, records `{ts, bucket, note?}`, active-bucket rule.
- `.claude/skills/clean-up/usage_report.py` — reads transcripts + marks, dedups by uuid,
  buckets via the active-mark rule, prices per model, prints a markdown table with
  `work $ / context $ / all-in $` columns. Runs clean; everything currently
  `unattributed` (no marks dropped yet).
- Deleted `13f6f4f0-…jsonl` transcript + `memory/fretflow-takehome.md`; reset `MEMORY.md`.

**Open threads:**
- **Next step (agreed): build the mark-dropping mechanism** so work stops landing in
  `unattributed`. Open sub-decision: how marks get written (tiny command / `/mark`
  skill / direct append) and exact file location confirmation.
- Not yet built: the `docs/ai-usage.md` renderer (persisted ledger + rollup), and
  wiring a usage step into the clean-up skill itself.
- Gotcha to remember: transcript dir is **path-keyed** — reusing `~/repos/fretflow` for
  a future project will re-contaminate usage totals.

## 2026-06-11 — Mark mechanism + build checklist

**Focus:** Finish the usage-tracking writer (drop marks so work stops landing in
`unattributed`), then turn the plan into an executor-ready checklist for handing the
coding to a cheaper model.

**Decisions:**
- Marks are written by a **tiny script** (`mark.py`), not a `/mark` skill or raw
  append — chosen so `ts` is auto-stamped (UTC now, lines up with transcripts) and the
  bucket is enum-validated (a typo can't silently misattribute). Callable by Claude via
  Bash and by Karl by hand.
- **Retconned the whole session so far to `planning-docs`** via a hand-inserted mark at
  `2026-06-11T17:50:09Z` (at-or-before the earliest message). Honest: it's all been
  planning + meta-tooling, zero app code. Hand-editing the marks file for boundary
  fixes is the §9-sanctioned path.
- Build checklist rulings: lives in **new `docs/plan.md`**; the one-baby-step +
  check-in agreement **carries over to the cheaper coding model** (CLAUDE.md still
  governs); checklist kept **pure of mark commands** (one §9 reminder only); **CAGED
  data model is left as an explicit ⛔ gate** to nail down later, not decided now.

**Done:**
- `.claude/skills/clean-up/mark.py` — appends `{ts, bucket, note?}` to
  `docs/ai-usage.marks.jsonl`; auto-stamps UTC ts, validates bucket against the six-value
  enum, omits empty notes, `mkdir -p`s the docs dir. Mirrors `usage_report.py`'s path/
  constant conventions so writer and reader agree on the contract.
- `docs/ai-usage.marks.jsonl` — created; now holds 2 marks (the 17:50:09Z retcon +
  a 19:29:28Z `mark.py` test), both `planning-docs`. `usage_report.py` re-run confirms
  `unattributed` is gone — whole session (~17.3M tokens / ~$20.6, ~94% cache/context)
  attributes to `planning-docs`.
- `docs/plan.md` — new build checklist: preamble enforces baby-steps + TDD (test table
  is its own box before the impl box), CAGED hoisted as a ⛔ gate blocking `Shape`/
  `FretboardPosition` types and all of Phase 3, phases mirror design-notes §6 (+0.5 for
  type contracts), stretch/ship gated and last.
- `.claude/skills/clean-up/SKILL.md` — added **Step 0: reconstruct usage marks**.
  Clean-up now lays down the conversation's bucket boundaries from hindsight (the
  reliable place to do it, vs. hoping marks were dropped live), then marks the clean-up
  doc work itself as `planning-docs` last.

**Open threads:**
- **Next step (agreed): settle the CAGED data model** — the ⛔ gate in `docs/plan.md`.
  This is the SME-heavy, error-prone part (§5); do it while on this model with Karl
  driving, before handing coding to the cheaper executor. Decide the data shape
  (offsets per string, root string, chord-tone roles) and who authors/verifies it.
- Still unbuilt: `docs/ai-usage.md` renderer (persisted ledger) and wiring a usage
  step into the clean-up skill.
- Checklist granularity is a proposal — split any item that's too big for the executor.

## 2026-06-11 — Devcontainer setup

**Focus:** Add a devcontainer so both Karl and the Origin EM can develop/run the project without polluting their host environments.

**Decisions:**
- Devcontainer is for **everyone** (Karl included) — no Node deps on the host; everything runs inside the container.
- Used Microsoft's pre-built `javascript-node:20` image — no custom Dockerfile needed, it ships with git + npm + common tools.
- `postCreateCommand` is conditional (`if [ -f package.json ]`) so the container works now and auto-installs deps once the Vite scaffold lands in Phase 0.
- Claude Code (skills, Python scripts) runs on the host natively — the devcontainer has no bearing on it.
- `.claude/` stays committed intentionally: the Origin assignment evaluates AI tool usage, and that's the evidence trail.

**Done:**
- `.devcontainer/devcontainer.json` — Node 20 devcontainer; forwards port 5173 (Vite); VS Code extensions: Tailwind IntelliSense, Prettier, Vitest explorer.

**Open threads:**
- Phase 0 scaffold (Vite + React + TS) is the agreed next step — once `package.json` exists, the devcontainer's `postCreateCommand` becomes live.

## 2026-06-11 — Phase 0 scaffold complete

**Focus:** Install and verify the full Vite + React + TS + Tailwind + Vitest stack.

**Decisions:**
- Vite config needs `server: { host: true }` in a devcontainer — default binds to loopback only, which port-forwarding can't reach.
- Import `defineConfig` from `'vitest/config'` (not `'vite'`) — the `/// <reference types="vitest" />` directive doesn't survive `tsc -b` cleanly; Vitest's own `defineConfig` re-export has the `test:` key built into its types.
- Tailwind v4: no `tailwind.config.js` needed; single `@import "tailwindcss"` in the CSS file plus the `@tailwindcss/vite` plugin is the complete setup.
- Vitest environment: `'node'` (correct for pure theory-core functions; `'jsdom'` only needed if/when we add component tests).

**Done:**
- `vite.config.ts` — Vite + React + Tailwind + Vitest config; `host: true` for devcontainer; `defineConfig` from `vitest/config`.
- `src/index.css` — `@import "tailwindcss"` prepended; Tailwind utility classes verified working.
- `package.json` — `"test": "vitest"` script added; `tailwindcss`, `@tailwindcss/vite`, `vitest` in devDependencies.
- `src/sanity.test.ts` — trivial passing test confirming Vitest wiring; to be deleted when first real theory test lands.
- All three scripts verified: `dev` serves app, `build` compiles clean, `test` runs green.
- Committed and pushed.

**Open threads:**
- Next: Phase 0.5 type contracts (`Note`, `Key`, `Chord`, `Progression`) — the unblocked four. `Shape` and `FretboardPosition` still blocked on the CAGED gate.
- `src/sanity.test.ts` should be deleted once the first real theory test is written.

## 2026-06-11 — Phase 0.5 type contracts

**Focus:** Define the core TypeScript types that serve as the spec for the theory core.

**Decisions:**
- `ProgressionTemplate` is a data object (`id`, `label`, `numerals`, `genres`), not a genre-name enum — genre labels don't map 1:1 to progressions, and the catalog approach lets multiple genres tag the same progression.
- Scope locked to **4-chord progressions only** — the app is a practice tool for common 4-chord CAGED patterns, not a general sequencer. Enforced as a 4-tuple in the type.
- `Genre` is a string union (`pop | rock | country | folk | blues | minor`); a template can belong to multiple genres via `genres: Genre[]`.
- `random` template removed — random means "pick randomly from the catalog at runtime," not a distinct template type.
- `Shape` and `FretboardPosition` remain blocked on the CAGED gate.

**Done:**
- `src/theory/types.ts` — `Note`, `Mode`, `Key`, `ChordQuality`, `Chord`, `Genre`, `ProgressionTemplate`, `Progression`.
- `src/theory/progressions.ts` — `PROGRESSION_TEMPLATES`: 7 common 4-chord progressions with genre tags (Axis of Awesome, 50s Changes, Three-Chord Classic, Pop Standard, Minor Anthem, Minor Rock, Natural Minor Loop). Acknowledged as a draft to be verified/tweaked later.

**Open threads:**
- `Shape` and `FretboardPosition` blocked on CAGED gate — resolve before Phase 3.
- Progressions catalog is a draft; genre tags and selection should be verified against a guitar.
- Next: Phase 1 — TDD for notes/scales/diatonic chords. Start with the test table for pitch-class ↔ name mapping.

## 2026-06-11 — Phases 1 & 2: theory core TDD

**Focus:** Implement and test the deterministic theory core: note spelling, diatonic chords, and progression realization.

**Decisions:**
- `getKeyNotes` spells notes by walking letter names (A–G) from the tonic and computing accidentals from the difference between the required pitch class and the letter's natural pitch class. Handles sharps and flats; double accidentals not needed for standard major/natural-minor keys.
- `getDiatonicChords` delegates note spelling to `getKeyNotes`, then zips with a fixed quality array per mode. Quality arrays are the music theory encoded as data.
- `realizeProgression` parses Roman numerals by uppercasing + stripping `°`, then indexing into `getDiatonicChords`. Returns a full `Progression` (key + template + chords).
- `sanity.test.ts` left in place — will be deleted when it becomes a nuisance (agreed earlier).

**Done:**
- `src/theory/notes.ts` — `getKeyNotes(key: Key): Note[]`; enharmonic spelling via letter-walk + pitch-class diff.
- `src/theory/notes.test.ts` — 5 cases: C major, G major (F#), F major (B♭), A natural minor, E natural minor.
- `src/theory/chords.ts` — `getDiatonicChords(key: Key): Chord[]`; fixed quality arrays for major and natural minor.
- `src/theory/chords.test.ts` — 3 cases: C major, G major, A natural minor.
- `src/theory/progressions.ts` — added `realizeProgression(template, key): Progression`; `PROGRESSION_TEMPLATES` catalog unchanged.
- `src/theory/progressions.test.ts` — 2 cases: Axis of Awesome in C major, Minor Anthem in A natural minor.
- All 11 tests passing (plus sanity).

**Open threads:**
- Phase 3 (CAGED shapes + region mapping) is the ⛔ gate — needs CAGED data model discussion with Karl before any code.
- `sanity.test.ts` still present; delete when first test file makes it redundant (already redundant now — Karl's call).
- Progressions catalog still a draft; verify genre tags + chord choices against a real guitar.

## 2026-06-12 — Phase 3: CAGED data model + shape data

**Focus:** Settle the CAGED data model (the ⛔ gate), unblock the remaining types, and write the fretboard matrix and shape data with tests.

**Decisions:**
- **Puzzle-piece placement model:** shape templates store `{ stringOffset, fretOffset, role }` offsets relative to the lowest-string root. Placement scans the fretboard for root positions and verifies all chord tones fit — no hardcoded anchor string. Elegant: verification is built into placement, and multiple-root shapes fall out naturally.
- **12-fret scope, no region filtering for now:** frets 0–12 guarantee at least one valid placement for every shape/key combination (patterns repeat at 12). Region filtering deferred.
- **Shape offsets are quality-specific:** major/minor shapes differ by one fret on the third. Added `quality: Exclude<ChordQuality, "diminished">` to `CagedShape`.
- **Diminished shapes skipped for v1:** no current progression templates produce diminished chords.
- **Gm shape omits B string:** the minor third there would require fret 11+ in open position — B string muted in practice.
- **Fretboard names use E♭ and B♭** (not D# and A#) — conventional guitarist spelling.

**Done:**
- `src/theory/types.ts` — added `ChordToneRole`, `ShapeNote`, `CagedShapeName`, `CagedShape` (with quality), `FretboardPosition`, `PlacedShape`.
- `src/theory/fretboard.ts` — `FRETBOARD` matrix (6 strings × 13 frets, generated from open-string pitch classes); `getNoteAt(string, fret)` accessor.
- `src/theory/fretboard.test.ts` — 13 cases: all 6 open strings, fretted positions, E♭/B♭ spelling, fret-12 octave repeat.
- `src/theory/shapes.ts` — `CAGED_SHAPES`: 10 shapes (5 names × major + minor) with verified offsets.
- `src/theory/shapes.test.ts` — 10 cases anchored at open-position chords where possible; C minor uses Dm (fret 5) since no open Cm exists in standard tuning.
- All 34 tests passing.

**Open threads:**
- **Shape data needs human verification** against a real guitar — especially G minor and C minor shapes. Tests pass mathematically but the offsets were derived by Claude.
- **Next step: placement algorithm** — `placeShape(chord, shape): PlacedShape | null` — scans fretboard for root positions, overlays template, verifies chord tones, returns resolved positions.
- `sanity.test.ts` still present (delete whenever).

## 2026-06-12 — Phase 3: placeShape algorithm + tests

**Focus:** Implement `placeShape(chord, shape): PlacedShape | null` — the puzzle-piece scan that places a CAGED shape onto the fretboard for a given chord.

**Decisions:**
- No new decisions; the placement model was fully locked in the previous session (puzzle-piece scan, frets 0–12, quality guard first).
- `placeShape` lives in its own `src/theory/placement.ts` — it imports from both `fretboard.ts` and `types.ts`, so neither of those files was the right home.

**Done:**
- `src/theory/placement.ts` — `placeShape(chord, shape)`: quality guard → chord-tones table → fret/string scan → overlay + verify → return first valid `PlacedShape` or `null`.
- `src/theory/placement.test.ts` — 8 cases: 3 null cases (quality mismatch major/minor both directions + diminished), 5 valid placements (open E major, open Am, F major barre, open D major, open C major) each with full per-position string/fret/role/pitchClass assertions. 42 tests passing total.

**Open threads:**
- Shape data still needs human verification against a real guitar (especially G minor, C minor) — this is a known open item from the previous session.
- Next step: region filtering — given a `PlacedShape`, determine which neck region(s) it falls in and, conversely, filter/select placements for a target region.

## 2026-06-12 — Phase 4 start: SVG fretboard + verification page

**Focus:** Begin the UI with a visual shape-verification tool — render all 10 CAGED shapes across all common chords so Karl can check the shape data against a real guitar in one pass.

**Decisions:**
- Start UI from the fretboard-first end (not selectors first), so shape data can be visually verified before wiring up dynamic controls.
- Diagram orientation: **horizontal, CCW 90°** — nut on the left, low E (string 1) at the bottom, high e at the top. Mirrors looking down the neck while playing.
- Open-string dots sit **on the nut bar** (not floating to its left) — eliminates the visual "shadow fret" that made diagrams look like they had 5 cells instead of 4.
- Always show exactly **4 fret cells** per diagram (FRETS_MIN = 4); shapes never naturally span more than 4.
- Fret wrapping: `getNoteAt` now uses `fret % 12` so shape notes can legally land above fret 12 (e.g. D-shape root at fret 11 → notes at 13/14). Renders with real fret numbers.
- Root-at-fret-12 constraint: root may be placed at fret 12 **only if every other note in the shape is also ≤ 12**. This admits "backward-looking" shapes (G, C — all offsets ≤ 0) while blocking "forward-looking" duplicates (E, A, D — positive offsets would just replicate the fret-0 placement). Fixes the missing G shape for E major.

**Done:**
- `src/ui/FretboardDiagram.tsx` — SVG chord diagram component; takes a `PlacedShape`; horizontal layout (nut left, low E bottom); amber = root, indigo = third, slate = fifth; note name inside each dot; ✕ for muted strings; fret number label for non-open shapes.
- `src/ui/VerificationPage.tsx` — diagnostic page; 8 major + 8 minor chords; all 5 CAGED shapes per chord in E→A→G→D→C order; "no placement" placeholder for nulls; color legend.
- `src/App.tsx` — temporarily renders `VerificationPage` for the verification pass.
- `src/theory/fretboard.ts` — `getNoteAt` extended to accept any fret via `fret % 12`.
- `src/theory/placement.ts` — root scan extended to fret 12; `f > 12` upper cap removed for roots 0–11; root-at-12 guard `fret === 12 && f > 12` added.
- All 42 tests still passing after placement changes.

**Open threads:**
- **Human verification pass still needed** — Karl has the page running; shape data (especially G minor, C minor) needs checking against a real guitar before we trust it.
- Next after verification: pull back from the diagnostic page and build the real dynamic UI — key/progression selectors wired to the core, with the fretboard rendering actual generated progressions.

## 2026-06-12 — Routing, hero section & light theme

**Focus:** Build the landing page shell — routing, hero section, and visual theme.

**Decisions:**
- `VerificationPage` moves to `/all-chords` permanently (diagnostic tool, not home page).
- Light theme with blue accent — Karl preferred light over dark; blue stays as primary color throughout.
- Display font: **Syne 800** (geometric, techy) over Playfair Display (too classical). Body: DM Sans.
- Background: `#f0f5ff` (barely-blue white) — warm without being stark white.
- Hero layout is full-width (no max-width on content); eyebrow pill badge removed per Karl's feedback.
- Stale Vite scaffold CSS in `index.css` was constraining `#root` to 1126px — stripped to a clean reset.

**Done:**
- `react-router-dom` installed; `src/App.tsx` wired with `BrowserRouter` — `/` → `HomePage`, `/all-chords` → `VerificationPage`.
- `src/ui/HomePage.tsx` — hero section complete: Syne 800 wordmark, tagline, blue CTA button, SVG fretboard string decoration, radial blue glow; stub sections for how-caged/app/footer in place.
- `src/index.css` — stripped Vite scaffold CSS (was locking `#root` to 1126px with border); now just Tailwind import + minimal body/box-sizing reset.

**Open threads:**
- "How CAGED Works" explainer section — next agreed step.
- App section (selectors + fretboard) and footer still stubs.

## 2026-06-12 — Phase 4 complete: full landing page UI

**Focus:** Build the remaining landing page sections (CAGED explainer, app controls, footer) and fix a font width issue.

**Decisions:**
- **CAGED explainer section:** dark band (`bg-slate-900`) to contrast with light hero — creates visual rhythm and suits `FretboardDiagram`'s existing dark SVG. Computes the 5 canonical open-position `PlacedShape`s at module level using `placeShape` (which naturally returns open-position for namesake chords); no hardcoded positions needed.
- **KeySelector:** controlled component (`value: Key, onChange`); 12 root-note buttons keyed by pitch class (so enharmonic equivalents share state correctly); Major/minor toggle with `handleKeyChange` in `HomePage` that auto-resets the template when mode switches — prevents musically nonsensical cross-mode realizations.
- **ProgressionSelector:** filters templates by first-numeral case (uppercase `I` = major, lowercase `i` = minor) to only show applicable progressions for the current mode. Each card shows label, numerals, and genre tags.
- **Generate flow:** `pickShape` collects all valid `PlacedShape` candidates for a chord and picks one at random — every Generate press can surface a different position, which is the core practice-tool behaviour. `showLabel={false}` prop added to `FretboardDiagram` so the column header (numeral + chord name) doesn't duplicate the diagram's internal label.
- **Font swap:** Syne 800 looked extremely wide/fat at large sizes (screenshotted and confirmed). Switched to **Space Grotesk 700** — same geometric/modern character, meaningfully narrower strokes. Design-notes updated.

**Done:**
- `src/ui/HomePage.tsx` — full landing page: CAGED explainer section (dark band + 5 shape cards + legend), app section (heading + white card), key selector wired, progression selector wired, generate button + chord + fretboard display, footer. Font swapped Syne → Space Grotesk throughout.
- `src/ui/KeySelector.tsx` — new; 12 root-note buttons + major/minor toggle; controlled component.
- `src/ui/ProgressionSelector.tsx` — new; mode-filtered template grid; label + numerals + genre tags per card.
- `src/ui/FretboardDiagram.tsx` — added `showLabel?: boolean` prop (defaults `true`; existing usages unaffected).
- `docs/design-notes.md` — Phase 4 status updated; font decision updated; UI theme note updated.

**Open threads:**
- Phase 6 (save loops / localStorage) not yet started.
- UX polish: progression display stays stale when key/template changes after generating (could auto-clear); Generate button doesn't change to "Regenerate" after first press.
- Stretch AI vibe layer still deferred.

## 2026-06-12 — Full-neck diagram redesign

**Focus:** Replace the per-chord card layout with a full guitar neck SVG showing all chord shapes overlaid, with interactive chord highlighting.

**Decisions:**
- **Full neck instead of cards:** show all 4 chord shapes on one neck simultaneously so the spatial relationship between positions is visible. This is the core pedagogical point of CAGED.
- **Orientation:** wide viewport (≥768px) = landscape (nut left, low E bottom — looks like looking down the neck while playing); narrow = portrait (nut top, low E left — chord-chart style). Breakpoint matches Tailwind `md`.
- **Responsive strategy:** `useIsNarrow` hook reads `window.innerWidth` on mount + resize and passes `orientation` prop. Avoids the CSS `hidden/flex` class conflict that would arise from rendering two instances.
- **Active/inactive coloring:** active chord = solid green (`#4ade80`) dots, blue ring (`#3b82f6`) on roots only. Inactive chords = slate gray (`#64748b`) at 45% opacity. No root/third/fifth distinction — Karl's call, chord identity is the primary encoding.
- **Portrait SVG sizing:** `maxHeight: '72vh', width: 'auto'` prevents the portrait viewBox (184×784) from stretching to fill container width (~1600px tall on mobile).
- **Chord selector buttons:** row below the neck; active = green-400 bg matching dot color; inactive = slate-800. Roman numeral in small mono + chord name. Active index resets to 0 on each Generate press.
- **`FretboardDiagram` kept** for the CAGED explainer section — mini per-shape diagrams are correct there (teaching individual shapes, not a progression).

**Done:**
- `src/ui/FullNeckDiagram.tsx` — new component: SVG neck with wood gradient, inlay dots, string gauge variation, fret labels; dot overlay (inactive pass then active pass for z-order); chord selector buttons; `orientation` prop drives landscape vs. portrait via `px`/`py` coordinate helpers that swap axes.
- `src/ui/HomePage.tsx` — `useIsNarrow` hook added; `activeChord` state + reset on generate; old chord card grid removed; `FullNeckDiagram` wired into app section in `bg-slate-900` container; app section widened from `max-w-3xl` to `max-w-5xl`.

**Open threads:**
- Phase 6 (save loops / localStorage) still not started — next agreed topic.
- UX polish carry-overs: stale display on key/template change; Generate → Regenerate label after first press.
- Stretch AI vibe layer still deferred.

## 2026-06-12 — Warm acoustic UI redesign

**Focus:** Complete visual overhaul to a warm acoustic guitar aesthetic — new fonts,
palette, fretboard materials, role-based dot colors, and component unification.

**Decisions:**
- **Fonts:** Fraunces 700 (display) + Lora serif (body/UI) replace Space Grotesk/DM Sans.
  Warm serif character suits the acoustic theme better than geometric sans.
- **Palette:** cream `#f4ede0` page background, walnut `#2d1a0e` dark sections, brass
  `#c4882a` primary accent. Off-white/wood/amber family throughout.
- **Role-based dot colors (locked):** root = steel blue `#5896a8` + amber-gold `#f59e0b`
  border; third = warm ivory `#c8b888`; fifth = amber gold `#d4862a`. These replace the
  earlier green/gray scheme and now apply to both fretboard components.
- **Fretboard visual language (locked):** rosewood gradient (`#7A4828→#4E2810→#7A4828`),
  silver-grey frets `#9E9C96`, silver strings `#C8C8C4`, ivory nut `#F0E5B8`. Both
  `FretboardDiagram` and `FullNeckDiagram` now share these material constants exactly.
- **KeySelector UI:** replaced piano keyboard (wrong metaphor for guitar) with a two-row
  fret-dot grid — naturals on top (44px circles), accidentals below (40px). Animated
  sliding brass pill for Major/minor mode toggle.
- **FullNeckDiagram container:** changed from near-black `#1c0e05` to light cream
  `#f5ede2` — the rosewood gradient itself provides contrast; a dark wrapper was
  competing with the neck.
- **Root note highlight:** collapsed separate ring circle into a tight `stroke` on the
  dot itself — eliminates the gap that was visible with a separate larger circle.
- **RoleLegend shared component:** extracted into `src/ui/RoleLegend.tsx`, used in both
  the CAGED explainer section and below the full neck. Dots at DOT_R=9 with PAD=3 so
  root's 2.5px stroke doesn't clip.
- **Chord selector button text:** now shows numeral + chord name + shape name (three rows)
  so the player knows which CAGED shape is being highlighted.

**Done:**
- `src/index.css` — body background changed to cream `#f4ede0`.
- `src/ui/HomePage.tsx` — full redesign: Fraunces/Lora fonts (loaded via useEffect),
  wood grain SVG in hero (feTurbulence + multiply blend), larger font sizes throughout,
  CAGED section dark with watermark letters, app section light with 2-column controls,
  FullNeckDiagram in cream container, chordLabels include shapeName.
- `src/ui/KeySelector.tsx` — complete rewrite: two-row fret-dot grid, animated mode
  toggle, brass/cream palette.
- `src/ui/ProgressionSelector.tsx` — larger font sizes, brass accent for active state,
  inline styles (no Tailwind arbitrary values for complex styles).
- `src/ui/FretboardDiagram.tsx` — rosewood gradient, silver strings/frets, ivory nut;
  DOT_R=9; role-based colors matching FullNeckDiagram exactly.
- `src/ui/FullNeckDiagram.tsx` — role-based ACTIVE_ROLE colors; inactive dots at 0.7
  opacity with note names; chord buttons show numeral/name/shape; RoleLegend at bottom.
- `src/ui/RoleLegend.tsx` — new shared component: SVG dots at fretboard size, root with
  amber border, rendered in both CAGED section and below full neck.

**Open threads:**
- Phase 6 (save loops / localStorage) still not started.
- UX polish: stale display on key/template change; Generate → Regenerate after first press.
- Stretch AI vibe layer still deferred.

## 2026-06-14 — Hero section font & decoration polish

**Focus:** Refine the hero section's visual quality — logo font and background decoration.

**Decisions:**
- **Logo font stays Fraunces, but at weight 700** (not 900). Karl trialled Playfair Display, Cormorant Garamond, and Yeseva One, then concluded the original Fraunces was best. Both hero h1 and footer wordmark now unified at 700.
- **Hero background = fretboard lines only** — no guitar body or headstock. Attempts at a full guitar silhouette (figure-8 body path + headstock) were rejected after screenshots showed the bezier curves produced an unrecognisable shape. Cleaner to keep the abstract fretboard.
- **Fretboard decoration:** strings + fret lines + inlay dots, centred vertically in the hero. A SVG `<linearGradient>` mask fades the fretboard out on both left and right edges so it doesn't hard-stop on wide screens.
- **Inlay dots corrected:** dots were sitting on fret lines (x values matched FRET_XS exactly); moved to midpoints between consecutive frets — 3rd, 5th, 7th, and 9th (double) positions.
- **Cream glow retained:** radial gradient behind the hero text block keeps the subheading readable over the fretboard decoration.

**Done:**
- `src/ui/HomePage.tsx` — logo font weight 900 → 700; STRINGS/FRET_XS/MARKER_DOTS constants restored to original centred values; decorative SVG replaced with fretboard-only version wrapped in gradient mask; MARKER_DOTS corrected to inter-fret midpoints; cream glow div added above hero text.

**Open threads:**
- Phase 6 (save loops / localStorage) still not started.
- UX polish: stale display on key/template change; Generate → Regenerate after first press.
- Stretch AI vibe layer still deferred.

## 2026-06-14 — Mobile polish, chord view toggle, hero copy

**Focus:** Mobile layout fixes to the practice tool section, a new chord card view, and hero copy/styling updates.

**Decisions:**
- **Mobile key selector:** `KeySelector` gets a `compact?: boolean` prop — naturals shrink from 44→40px, accidentals 40→36px, gap 8→6px. `HomePage` passes `compact={isNarrow}`. App section padding reduced from `px-8` to `px-4 md:px-8`; card column padding halved on narrow screens. Together these fit the 7-note row on a 390px screen with ~10px to spare.
- **Chord view toggle:** a "Neck / Chords" pill toggle appears above the generated output. "Neck" shows `FullNeckDiagram` as before; "Chords" shows a `flex-wrap` grid of 4 `FretboardDiagram` cards, each labelled with the Roman numeral + chord name. `viewMode` state persists across Regenerate presses so the user's preference sticks.
- **Hero copy:** replaced the three-line "Pick a key…" tagline with two lines — `"Rote learning made beautiful."` (italic, 1.9rem, walnut) as the emotional hook, and `"Generate CAGED progressions. / Practice instantly."` (1.3rem, muted) as the descriptor. "Rote learning made beautiful" is the locked tagline.
- **Hero cream glow:** widened on mobile from `55%` to `95%` horizontal radius (using `isNarrow`) so the glow covers the full text block on narrow screens.
- **Footer:** changed from `flex-row justify-between` to `flex-col items-center` — tagline now sits below the FretFlow wordmark, both centred.

**Done:**
- `src/ui/KeySelector.tsx` — `compact` prop; smaller button/font sizes in compact mode.
- `src/ui/HomePage.tsx` — section padding mobile fix; card padding via `isNarrow`; `viewMode` state + Neck/Chords toggle + chord card grid; hero copy rewrite; cream glow responsive; footer layout centred.

**Open threads:**
- Phase 6 (save loops / localStorage) still not started.
- UX polish: stale display on key/template change; Generate → Regenerate after first press.
- Stretch AI vibe layer still deferred.
- **Next agreed focus: deployment.**
