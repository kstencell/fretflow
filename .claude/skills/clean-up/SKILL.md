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
   `scaffolding`, `app-logic`, `ui`, `testing`, `debugging`). For each shift that
   actually happened, drop a mark at roughly when it happened, in order. `mark.py`
   stamps `ts` as *now* (no backdate flag), so to place an earlier boundary, append
   the JSONL line by hand with the right `ts` — order matters, not exact seconds. Skip
   any boundary already marked live during the conversation.
2. **Clean-up itself is `planning-docs`** (this journaling/doc work). Mark it last so
   the bookkeeping tail attributes correctly:

```
python3 .claude/skills/clean-up/mark.py planning-docs "clean-up"
```

## Step 1 — Append a journal entry

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

Keep it tight — a future reader skims this, they don't re-read the transcript. No
verbatim dumps. Use today's date from the environment context.

## Step 2 — Review and update project docs

Make the repo's docs reflect reality after this conversation. Check, and update only
where the conversation actually changed something:

- `docs/design-notes.md` — decisions, scope, plan. Mark resolved items, add new ones.
- `CLAUDE.md` — only if our working agreement itself changed.
- `README.md` — if it exists and is now out of date.
- Long-term memory (`.../memory/`) — only if a durable, non-obvious fact emerged that
  isn't already captured in the repo's own docs. Don't duplicate what docs already own.

Be surgical: edit what changed, don't rewrite what didn't. If nothing needs updating,
say so explicitly rather than inventing changes.

## Step 3 — Produce the handoff prompt

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
