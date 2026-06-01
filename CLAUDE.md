# Website Builder — Project Rules

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
| **Build** | Auto-enter `/brainstorm` (read skill file) → plan (`Status: draft`) → user approves → code |
| **Fix** | Investigate → fix → tests at `/finish-coding` |
| **Question** | Answer or explore. No code unless asked. |
| **Other** | Clarify, then agree the route |

**Build gate:** No app code until `.ai/docs/plans/active-*.md` has `Status: approved` and the user says so explicitly.

While coding: do not write tests — defer to `/finish-coding`. Test pipeline rule always loads: `.ai/rules/test-pipeline.md`.

### End (user invokes `/finish-coding`)

Full steps in `.ai/skills/finish-coding/`: code review → knip → compile → tests → MEMORY (if warranted) → BUILD_JOURNAL (if warranted) → commit (with approval) → push.

## This project

**Core Product:** A prompt library and Vite showcase for building premium landing pages from detailed AI prompts (inspired by MotionSites-style specs).

**The Problem:** High-quality landing page prompts are scattered — hard to reuse, compare, or turn into working pages without re-pasting specs every time.

**The Solution:** Store curated build prompts under `.ai/prompts/website/`, render reference pages in a Vite app, and reuse templates for new sites. Hardcoded Tailwind per prompt is fine for this repo.

**Target Audience:** Sam (and future agents) prototyping marketing/landing pages from prompt specs.

**Value Proposition:** Copy a prompt → build a page → iterate visually without starting from scratch.

## Where instructions live

Edit everything under `.ai/` only. `.claude/` and `.cursor/` folders are symlinks — do not write rule or skill content there.

| Path | Purpose |
|------|---------|
| `.ai/MEMORY.md` | Decision log + shipped-features index. See `.ai/rules/memory.md`. |
| `.ai/rules/` | Detailed rules (auto-loaded into every chat). Files ending in `.project-specific.md` are for the source project only — delete them when copying `.ai/` to a new repo. |
| `.ai/skills/` | Invoke-only skills (run with a slash command). |
| `.ai/prompts/` | Reusable prompts (copy-paste into chat). Website prompts live in `.ai/prompts/website/`. |
| `.ai/docs/` | Long-form docs for humans (build journal, plans, design notes). |
| `.ai/templates/` | Starter templates for new files (plans, this CLAUDE.md, etc.). |

Rules load automatically:
- Claude Code: `.claude/rules/` → `.ai/rules/`
- Cursor: `.cursor/rules/` → `.ai/rules/` (as `.mdc` symlinks)

Do not duplicate rule content in this file.

## Skills

- `/start-chat` — every new chat: read memory, ask intention, route (`.ai/skills/start-chat/`)
- `/brainstorm` — **automatic on Build** via `/start-chat`. Read-only until plan approved (`.ai/skills/brainstorm/`)
- `/test` — full test pipeline: plan in chat → write/update tests → run → self-heal (`.ai/skills/test/`)
- `/finish-coding` — end of chat checklist: code review → compile → tests → memory, journal, commit, push (`.ai/skills/finish-coding/`)
- `/setup-new-project` — first-time setup walkthrough for a fresh repo (`.ai/skills/setup-new-project/`)
- `/ui-ux-pro-max` — UI/UX guidance (`.ai/skills/ui-ux-pro-max/`)

## Build journal

- `.ai/docs/BUILD_JOURNAL.md` — human prose; when/how to write: `~/.ai/instructions.md` § Build Journal (triggered from `/finish-coding`).

## App structure

- **Stack:** React 18 + TypeScript + Vite + Tailwind CSS + lucide-react
- **Dev:** `npm run dev` → open routes in browser (e.g. `/halo`, `/max-reed`)
- **Static HTML:** `npm run build` → output in `dist/` (index.html + hashed assets)
- **Prompts:** `.ai/prompts/website/examples/` (full specs), `.ai/prompts/website/templates/` (blank templates)
