---
name: clean-up
description: Use when Karl types /clean-up or asks to "clean up", "wrap up", "refresh the context", or "hand off" the current conversation. Condenses the conversation into the project journal, updates project docs to match what was accomplished, and produces a copy-paste handoff prompt for a fresh conversation.
---

# /clean-up — End-of-conversation handoff

Purpose: stop an ever-growing conversation from burning tokens. Capture what
happened, update the docs so the repo is the source of truth (not the chat), and
hand a clean baton to the next conversation.

Run these steps **in order**. Do them yourself in the main conversation — do
not spawn agents. Keep it tight; this is bookkeeping, not new feature work.

## Step 0 — Reconstruct usage marks

You have hindsight of the whole conversation now — use it to lay down the bucket
boundaries that should have been marked live. Two parts:

1. **The conversation's work.** It may span several buckets (`planning-docs`,
   `tooling`, `app-logic`, `ui`, `testing`, `debugging`). For each shift that
   actually happened, drop a mark at roughly when it happened, in order. `mark.py`
   stamps `ts` as *now* (no backdate flag), so to place an earlier boundary, append
   the JSONL line by hand with the right `ts` — order matters, not exact seconds. Skip
   any boundary already marked live during the conversation.
2. **Clean-up itself is `planning-docs`** (this journaling/doc work). Mark it last so
   the bookkeeping tail attributes correctly:

```
python3 .claude/skills/clean-up/mark.py planning-docs "clean-up"
```

## Step 1 — Refresh the AI usage ledger

Run the usage report to get the latest numbers:

```
python3 .claude/skills/clean-up/usage_report.py
```

Then update `docs/ai-usage.md` in place. The file's structure and prose don't
change — only the numbers. Specifically:

1. **Bucket table** — combine any per-model rows for the same bucket into one
   (e.g. two `planning-docs` rows sum into one). Recompute each bucket's share
   as a percentage of the new all-in total. Use the pretty names already in the
   table (`Planning & Documentation`, `UI & Design`, etc.).
2. **Bucket pie chart** — update the numeric values to match the new combined
   per-bucket totals.
3. **Work vs. context table** — update Work $, Context $, All-in $, and the
   share percentages.
4. **Work vs. context pie chart** — update the two numeric values.
5. **"What the numbers say" section** — update any percentages or figures cited
   in the narrative. Rewrite a sentence only if the numbers changed enough that
   the old sentence is now wrong; don't polish prose for its own sake.

Do not change the file's section order, headings, or any prose that doesn't
reference numbers.

## Step 2 — Append a journal entry

Append (never overwrite) one entry to `docs/journal.md`. Create the file with an
`# FretFlow — Conversation Journal` heading if it doesn't exist. Newest entries go
at the bottom. Entry format:

```markdown
## <YYYY-MM-DD> — <3–6 word title of what this conversation was about>

**Focus:** one sentence on what we set out to do.

**Decisions:** bullet list of decisions made (and the *why*, briefly). Omit if none.

**Done:** bullet list of concrete changes — files created/edited, with one-line each.

**Open threads:** what's unresolved or deferred. Omit if none.
```

**Brevity rules — strictly enforced:**
- Each bullet is one line. No sub-bullets, no elaboration.
- The whole entry should fit in ~15 lines. If you're over, cut.
- No restating what the code already shows. "Added `FretboardDiagram.tsx`" is enough — don't describe what it does.
- No hedging phrases ("we discussed", "we explored", "it was noted that"). State facts only.

Use today's date from the environment context.

## Step 3 — Review and update project docs

Make the repo's docs reflect reality. **Cut as much as you add.** Docs that are too
long waste tokens on every future conversation load — stale content is strictly worse
than no content.

- `docs/plan.md` — tick off completed items, collapse done phases to a single ✅ line,
  remove detail that's no longer actionable. Keep detail only for what's still TODO.
- `docs/design-notes.md` — mark resolved items ✅, add new decisions, and **delete or
  correct anything that is now wrong, deprecated, or superseded**. If a section no
  longer reflects how the code actually works, fix it or remove it.
- `CLAUDE.md` — only if the working agreement itself changed.
- `README.md` — if it's now out of date.
- Long-term memory (`.../memory/`) — only if a durable, non-obvious fact emerged that
  isn't already in the repo docs. Don't duplicate.

If nothing needs updating in a given file, skip it and say so. Don't touch files just
to show activity.

## Step 4 — Produce the handoff prompt

Output a fenced code block Karl can paste into a fresh conversation. It must let the
next Claude get up to speed by reading the repo, not by re-reading this chat. Include:

1. A one-line statement of where we are.
2. An instruction to read, in order: `CLAUDE.md`, `docs/design-notes.md`, and the
   latest entry in `docs/journal.md` — and to follow the CLAUDE.md ground rules
   (one baby step at a time; Karl drives).
3. The single concrete next step we agreed on (or "ask Karl what's next" if none).
4. Nothing else — no recap of the whole project; the docs carry that.

Template:

```
Picking up FretFlow where we left off: <one-line status>.

First, read these to get up to speed and load our working agreement:
1. CLAUDE.md (our ground rules — follow them exactly: one baby step at a time, I drive)
2. docs/design-notes.md (the plan and locked decisions)
3. The latest entry in docs/journal.md (what we just did)

Then stop and confirm you've read them. Our agreed next step is:
<the one next step, or: "I'll tell you — ask me.">
Do not start it until I say go.
```

## After running

End your turn after presenting the handoff prompt. Do not start the next step of
actual project work — the whole point is to close out cleanly.
