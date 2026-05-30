---
description: MEMORY.md — decision log and shipped-features index
alwaysApply: true
paths: []
globs: "**/*"
---

# Memory

`.ai/MEMORY.md` is a **decision log and shipped-features index** the codebase can't express — not a session recap.

**Purpose:** prevent wrong assumptions, re-litigation, and rebuilding features that already exist.

## Tags

| Tag | Use for |
|-----|---------|
| `[decision]` | Architectural choices, rejected alternatives, standing conventions |
| `[lesson]` | Mistakes to avoid repeating |
| `[shipped]` | One-line capability inventory — "this exists, don't rebuild it" |

## When to read

At `/start-chat`: read for **Build**, **Fix**, and **Other** — skip for **Question**. Do not recite it back.

## When to write

At `/finish-coding`, add entries only when something new belongs — many chats need zero new lines.

Draft every new entry in chat first. Wait for explicit approval before editing the file.

Full rules: global instructions at `~/.ai/instructions.md` § Memory.
