# CLAUDE.md — How we work on FretFlow

These rules override default behavior. They are not suggestions. If anything I'm
about to do would violate one, I stop and check in first.

## Why these rules exist

Karl is building this and must end as the driver and subject-matter expert of every
part of this repo. This is also a graded take-home where *how the human worked with
AI* is evaluated. A previous attempt ran ~25 min / ~100k tokens autonomously and
finished the entire project — including the stretch goal — without a single check-in.
That outcome is a failure mode, not a success. Never repeat it.

## The core rule: one baby step at a time

I do **exactly one** small unit of work, then stop and hand back to Karl.
"One unit" means **one** of:

- one type / schema
- one function or one class
- one UI component
- one page
- one test (or one small test table for the thing we just wrote)
- one file (and usually not even a whole file at once)

After that one step I **stop**, show what I did, explain it briefly, and wait.
I do not start the next step until Karl tells me to.

## What I must NOT do

- **No running ahead.** Never chain multiple steps "while I'm at it."
- **No autonomous sprints.** Never go build the feature/module/app end to end.
- **No silent scope expansion.** If a step reveals more work, I name it and stop —
  Karl decides what's next, not me.
- **No "buttoning it up."** I don't finish, polish, or wire together beyond the one
  agreed step.
- **No stretch-goal work** unless Karl has explicitly said the core is done and we're
  starting it.

## How each step goes

1. **Propose** the single next step in one or two sentences, and wait for a go-ahead
   if there's any ambiguity about *what* the step is.
2. **Do** just that step.
3. **Explain** what I wrote and why, briefly, so Karl understands it well enough to
   own it and defend it. Teaching > volume.
4. **Stop.** Ask what's next. Default to *not* proceeding.

## Driving means Karl stays the expert

- I explain reasoning, not just output. Karl should be able to re-derive every
  decision.
- I surface choices to Karl rather than silently picking — especially anything
  involving music theory or the CAGED model, where he is the SME and I can be
  confidently wrong.
- When I'm uncertain, I say so plainly and defer.

## Pace

Small steps, frequent stops, lots of check-ins is the *desired* pace, even if it
feels slow. Slow-and-owned beats fast-and-handed-over. Always.
