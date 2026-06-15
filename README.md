# FretFlow

**Rote learning made beautiful.** Generate CAGED chord progressions and practice them instantly.

Live at [fretflow.ca](https://fretflow.ca)

---

## What it does

Pick a key and a progression template. FretFlow realizes the diatonic chords, maps each one to a random CAGED shape on the fretboard, and renders the full neck so you can see all four positions at once. The spatial relationship is the point.

Works entirely offline. No account, no backend, no API key required.

## Architecture

The core design principle is a hard trust boundary:

> **The deterministic theory core owns all musical truth. No AI involved.**

`src/theory/` is a pure TypeScript library: note spelling, diatonic chord derivation, CAGED shape templates, fretboard position placement. All deterministic, all tested. The UI wires selectors to this core and renders the output as SVG. There is nothing between them.

This means the harmony is correct *by construction*. The app can't produce a musically wrong chord for a given key because it never computes one; it picks from a list derived from the key's scale.

## Stack

| | |
|---|---|
| Language | TypeScript |
| Build | Vite |
| UI | React + Tailwind CSS |
| Fretboard | Inline SVG |
| Tests | Vitest (42 theory-core tests) |
| Deploy | GitHub Pages |

## Local development

```bash
npm install
npm run dev      # dev server at localhost:5173
npm test         # run theory-core tests
npm run build    # production build
```

A devcontainer is included (Node 20). Port 5173 is forwarded automatically.

## Project structure

```
src/
  theory/        # deterministic core: notes, chords, shapes, placement
  ui/            # React components: fretboard SVG, selectors, neck diagram
```

`/all-chords` is a development route that renders all 10 CAGED shapes across all common chords for visual verification.

## Working with Claude Code

Claude follows a **one-step-at-a-time** protocol on this project (see `CLAUDE.md`). Each session has a context window that fills up over time; as it fills, responses get slower and older context gets compressed away.

### `/clean-up` — when and why

Run `/clean-up` at a natural stopping point: when a feature is done, before switching to a different area of the codebase, or when a conversation feels long. It:

1. Condenses the session into the project memory and journal so nothing important is lost.
2. Produces a copy-paste handoff prompt you can open in a fresh conversation.
3. Keeps Claude's context lean so responses stay fast and accurate.

A rough rule: if you've been in the same conversation for more than 20–30 back-and-forths, it's a good time to clean up. Don't wait until the window is nearly full — clean up while things are still going well.
