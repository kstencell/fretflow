#!/usr/bin/env python3
"""Drop a usage-tracking mark.

Appends one {ts, bucket, note?} record to docs/ai-usage.marks.jsonl, marking
the instant a PM bucket becomes active. From that ts onward, transcript
messages count toward this bucket until the next mark (see design-notes.md §9).

The ts is stamped automatically as UTC now, so it lines up with the transcript
timestamps usage_report.py reads. The bucket is validated against the enum, so
a typo can't silently send work to the wrong bucket (or to unattributed).

Usage:  python3 .claude/skills/clean-up/mark.py <bucket> [note...]
Example: python3 .claude/skills/clean-up/mark.py app-logic "chord schema"
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

# repo root = three levels up from .claude/skills/clean-up/mark.py
REPO_ROOT = Path(__file__).resolve().parents[3]
MARKS_FILE = REPO_ROOT / "docs" / "ai-usage.marks.jsonl"

BUCKETS = ["planning-docs", "scaffolding", "app-logic", "ui", "testing", "debugging"]


def utc_now_iso():
    """Current UTC instant as ISO-8601 with a trailing 'Z', second precision."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def main(argv):
    if not argv:
        print(f"usage: mark.py <bucket> [note...]\nbuckets: {', '.join(BUCKETS)}")
        return 2

    bucket = argv[0]
    if bucket not in BUCKETS:
        print(f"error: {bucket!r} not in {{{', '.join(BUCKETS)}}}")
        return 1

    rec = {"ts": utc_now_iso(), "bucket": bucket}
    note = " ".join(argv[1:]).strip()
    if note:
        rec["note"] = note

    MARKS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with MARKS_FILE.open("a") as f:
        f.write(json.dumps(rec) + "\n")

    print(f"appended: {json.dumps(rec)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
