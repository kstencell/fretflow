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
