#!/usr/bin/env python3
"""Add up Claude Code token usage per PM bucket.

Reads the real per-message usage from this project's session transcripts and
attributes each message to whichever bucket was *active* at its timestamp,
per the marks in docs/ai-usage.marks.jsonl (see design-notes.md §9).

This is approximate by design — it shows trends, not exact accounting. Cost
is an estimate too: rates are per-model list prices, and cache reads/writes
are priced as multiples of the input rate (see PRICING below).

Usage:  python3 .claude/skills/clean-up/usage_report.py
"""

import json
from datetime import datetime
from pathlib import Path

# repo root = three levels up from .claude/skills/clean-up/usage_report.py
REPO_ROOT = Path(__file__).resolve().parents[3]
MARKS_FILE = REPO_ROOT / "docs" / "ai-usage.marks.jsonl"

# Claude Code encodes the project path as the transcript dir name: '/' -> '-'.
TRANSCRIPTS_DIR = (
    Path.home() / ".claude" / "projects" / str(REPO_ROOT).replace("/", "-")
)

BUCKETS = ["planning-docs", "tooling", "app-logic", "ui", "testing", "debugging"]
UNATTRIBUTED = "unattributed"  # messages before the first mark


def parse_ts(value):
    """ISO-8601 (with trailing 'Z') -> aware datetime."""
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def load_marks():
    """Marks sorted by time. Each: {ts: datetime, bucket: str}."""
    if not MARKS_FILE.exists():
        return []
    marks = []
    for line in MARKS_FILE.read_text().splitlines():
        line = line.strip()
        if not line:
            continue
        rec = json.loads(line)
        marks.append({"ts": parse_ts(rec["ts"]), "bucket": rec["bucket"]})
    marks.sort(key=lambda m: m["ts"])
    return marks


def bucket_for(ts, marks):
    """Bucket of the most recent mark at-or-before ts; else unattributed."""
    active = UNATTRIBUTED
    for mark in marks:
        if mark["ts"] <= ts:
            active = mark["bucket"]
        else:
            break
    return active


def iter_assistant_messages():
    """Yield (ts, model, usage) for each assistant message across transcripts.

    Deduped by message uuid so a message copied into a resumed session file
    isn't counted twice.
    """
    seen = set()
    for path in sorted(TRANSCRIPTS_DIR.glob("*.jsonl")):
        for line in path.read_text().splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if rec.get("type") != "assistant":
                continue
            uuid = rec.get("uuid")
            if uuid in seen:
                continue
            seen.add(uuid)
            msg = rec.get("message") or {}
            usage = msg.get("usage")
            ts = rec.get("timestamp")
            if not usage or not ts:
                continue
            yield parse_ts(ts), msg.get("model", "unknown"), usage


def add_up():
    """Aggregate tokens into totals[bucket][model] = {input, output, cache, msgs}."""
    marks = load_marks()
    totals = {}
    for ts, model, usage in iter_assistant_messages():
        bucket = bucket_for(ts, marks)
        slot = totals.setdefault(bucket, {}).setdefault(
            model,
            {"input": 0, "output": 0, "cache_write": 0, "cache_read": 0, "msgs": 0},
        )
        slot["input"] += usage.get("input_tokens", 0)
        slot["output"] += usage.get("output_tokens", 0)
        slot["cache_write"] += usage.get("cache_creation_input_tokens", 0)
        slot["cache_read"] += usage.get("cache_read_input_tokens", 0)
        slot["msgs"] += 1
    return totals


def fmt(n):
    return f"{n:,}"


# USD per 1M tokens — list prices from the claude-api reference (cached 2026-06-04).
PRICING = {
    "claude-opus-4-8": {"input": 5.00, "output": 25.00},
    "claude-sonnet-4-6": {"input": 3.00, "output": 15.00},
    "claude-haiku-4-5": {"input": 1.00, "output": 5.00},
}
# Cache tokens are priced as multiples of the model's input rate (approximate;
# per the prompt-caching docs): reads ~0.1x, writes ~1.25x (5-min TTL).
CACHE_READ_MULT = 0.10
CACHE_WRITE_MULT = 1.25


def cost_usd(model, t):
    """Approximate (work_usd, context_usd) for one slot. Unknown model -> None.

    work    = fresh input + output (the cost of actually producing things)
    context = cache reads + writes (the cost of carrying conversation context)
    """
    rate = PRICING.get(model)
    if rate is None:
        return None
    work = (t["input"] * rate["input"] + t["output"] * rate["output"]) / 1_000_000
    context = (
        t["cache_read"] * rate["input"] * CACHE_READ_MULT
        + t["cache_write"] * rate["input"] * CACHE_WRITE_MULT
    ) / 1_000_000
    return work, context


def render(totals):
    """Markdown table to stdout, grouped by bucket in canonical order."""
    order = BUCKETS + [b for b in totals if b not in BUCKETS]
    print("| bucket | model | msgs | input | output | cache | work $ | context $ | all-in $ |")
    print("|---|---|--:|--:|--:|--:|--:|--:|--:|")
    grand_tok = 0
    grand_work = 0.0
    grand_ctx = 0.0
    unpriced = False
    for bucket in order:
        if bucket not in totals:
            continue
        for model, t in sorted(totals[bucket].items()):
            cache = t["cache_read"] + t["cache_write"]
            grand_tok += t["input"] + t["output"] + cache
            cost = cost_usd(model, t)
            if cost is None:
                unpriced = True
                work_str = ctx_str = allin_str = "?"
            else:
                work, ctx = cost
                grand_work += work
                grand_ctx += ctx
                work_str = f"${work:,.2f}"
                ctx_str = f"${ctx:,.2f}"
                allin_str = f"${work + ctx:,.2f}"
            print(
                f"| {bucket} | {model} | {t['msgs']} | "
                f"{fmt(t['input'])} | {fmt(t['output'])} | {fmt(cache)} | "
                f"{work_str} | {ctx_str} | {allin_str} |"
            )
    print(f"\n**Total tokens (all buckets):** {fmt(grand_tok)}")
    print(f"**Work $ (input + output):** ${grand_work:,.2f}")
    print(f"**Context $ (cache):** ${grand_ctx:,.2f}")
    print(f"**All-in $:** ${grand_work + grand_ctx:,.2f}")
    if unpriced:
        print("\n_`?` = model not in the pricing table; cost omitted._")
    if any(b not in BUCKETS for b in totals):
        print("\n_Note: `unattributed` = messages before the first mark was dropped._")


if __name__ == "__main__":
    render(add_up())
