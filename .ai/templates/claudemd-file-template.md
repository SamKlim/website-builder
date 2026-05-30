<!--
=======================================================================
CLAUDE.md TEMPLATE
=======================================================================
This is a starting template for a project-level CLAUDE.md.
It is also read by Cursor (via the .cursor symlink) and any other agent
that respects CLAUDE.md.

This file is a GENERIC scaffold — not a copy of any project's filled-in
CLAUDE.md. Exam Vault (or any source repo) may have Routing, Workflows,
and extra skills in its root CLAUDE.md; add those after setup for the new
project only.

<!--
{{PROJECT_NAME}}: Short, human-readable project name.
Example: "My App" (use your project name, not the repo you copied `.ai/` from).
-->

## Chat workflow

Summary only — full steps in `.ai/skills/start-chat/SKILL.md` and `.ai/skills/finish-coding/SKILL.md`.

### Start (automatic — first message of every new chat)

Follow `/start-chat`. User does not need to type the command.

1. **Say what loaded** — list instruction files in context, e.g. `~/.ai/instructions.md`, `CLAUDE.md`, `.ai/rules/memory.md`
2. **Ask intention** — Build, Fix, Question, or Other (skip if already obvious)
3. **Read `.ai/MEMORY.md`** — Build, Fix, and Other only (skip for Question). Stops rebuilds and wrong architecture.
4. **Check active plans** — Build only. Ask if an `active-*.md` plan already exists.

| Intention | Route |
|-----------|-------|
| **Build** | `/brainstorm` (read only — no code) → plan → approve → code |
| **Fix** | Investigate → fix → tests when code changes |
| **Question** | Answer or explore. No code unless asked. |
| **Other** | Clarify, then agree the route |

While coding: `.ai/rules/test-pipeline.md` runs after features and fixes (loads when editing app code).

### End (user invokes `/finish-coding`)

Full steps in `.ai/skills/finish-coding/`: code review → knip → compile → tests → MEMORY (if warranted) → BUILD_JOURNAL (if warranted) → commit (with approval) → push.

## This project

<!--
Fill in the five lines below. Keep each to 1–2 sentences.
This block tells the agent WHAT the product is and WHO it's for —
so it can make decisions in context instead of guessing.
-->

**Core Product:** {{CORE_PRODUCT}}
<!-- {{CORE_PRODUCT}}: What the product is, in one sentence. -->

**The Problem:** {{PROBLEM}}
<!-- {{PROBLEM}}: The pain the product solves. -->

**The Solution:** {{SOLUTION}}
<!-- {{SOLUTION}}: How the product solves the problem. -->

**Target Audience:** {{TARGET_AUDIENCE}}
<!-- {{TARGET_AUDIENCE}}: Who uses it. -->

**Value Proposition:** {{VALUE_PROPOSITION}}
<!-- {{VALUE_PROPOSITION}}: Why this matters to them. -->

## Where instructions live

Edit everything under `.ai/` only. `.claude/` and `.cursor/` folders are symlinks — do not write rule or skill content there.

| Path | Purpose |
|------|---------|
| `.ai/MEMORY.md` | Decision log + shipped-features index. See `.ai/rules/memory.md`. |
| `.ai/rules/` | Detailed rules (auto-loaded into every chat). Files ending in `.project-specific.md` are for the source project only — delete when copying to a new repo. |
| `.ai/skills/` | Invoke-only skills (run with a slash command). |
| `.ai/prompts/` | Reusable prompts (copy-paste into chat). |
| `.ai/docs/` | Long-form docs for humans (build journal, plans, design notes). |
| `.ai/templates/` | Starter templates for new files (plans, this CLAUDE.md, etc.). |

Rules load automatically:
- Claude Code: `.claude/rules/` → `.ai/rules/`
- Cursor: `.cursor/rules/` → `.ai/rules/` (as `.mdc` symlinks)

Do not duplicate rule content in this file.

## Skills (invoke when needed)

<!--
List every skill that lives in `.ai/skills/`. One line per skill in the format:
  - `/skill-name` — one-line description (`.ai/skills/skill-name/`)
The three below are the standard skills most projects want.
Remove any that don't exist in this repo. Add project-specific skills.
-->

- `/start-chat` — every new chat: read memory, ask intention, route (`.ai/skills/start-chat/`)
- `/brainstorm` — design before building (`.ai/skills/brainstorm/`)
- `/finish-coding` — end of chat checklist: tests, memory, journal, commit, push (`.ai/skills/finish-coding/`)
- `/setup-new-project` — first-time setup walkthrough for a fresh repo (`.ai/skills/setup-new-project/`)
<!-- Add more skills here as you create them, e.g.:
- `/ui-ux-pro-max` — UI/UX guidance (`.ai/skills/ui-ux-pro-max/`)
-->

## Build journal

- `.ai/docs/BUILD_JOURNAL.md` — human prose; when/how to write: `~/.ai/instructions.md` § Build Journal (triggered from `/finish-coding`).

