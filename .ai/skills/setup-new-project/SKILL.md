# /setup-new-project

Run this **once**, when scaffolding a brand new project from this `.ai/` structure (e.g. you copied this folder into a fresh repo).

This is NOT a start-chat thing — memory rules live in `.ai/rules/memory.md`. This skill is the one-time "turn the templates into real files for this specific project" step.

## When to run

Invoke `/setup-new-project` if any of the following are true:
- `CLAUDE.md` at the repo root doesn't exist yet
- `.ai/MEMORY.md` doesn't exist yet
- The repo otherwise looks fresh (no real app code, just config files)

Skip this skill if those files already exist — the project is already set up.

## Process

1. **Sanity-check the repo is actually fresh**
   List the repo root. If `CLAUDE.md` already exists AND there's substantive app code (`package.json` with real deps, `src/` or `app/` with real files), this is NOT a fresh project. STOP and tell the user. Do not overwrite anything.

2. **Walk through each template in `.ai/templates/`**
   For each template file:
   - Read it
   - Find every `{{PLACEHOLDER}}` marker
   - Read the HTML comment above each placeholder — it tells you what to ask for
   - **Ask for all placeholders in a single batched form**, not one at a time. Group related questions together. Goal: minimise round-trips with the user.
   - Once all placeholders are filled, write the instantiated file to its target location
   - **Never overwrite an existing target file.** If the target already exists, skip with a one-line warning.

3. **Template targets**
   - `claudemd-file-template.md` → `/CLAUDE.md` (repo root)
   - `build-journal-template.md` → `.ai/docs/BUILD_JOURNAL.md` (fill `{{PROJECT_NAME}}` from the CLAUDE.md answers)
   - `plan-template.md` → SKIP (used per-feature, not at setup time)
   - `design-system-prompt.template.md` → ask the user first. If yes, instantiate to `.ai/docs/design-system-prompt.project-specific.md`.
   - Any future template — infer target from the HOW TO USE block at the top, or ask the user

4. **Remove project-specific content inherited from the scaffold**
   The whole `.ai/` folder was likely copied wholesale from another project. Some files are generic (keep everywhere). Some are specific to the source project (delete when starting fresh).

   **How to tell:** any file whose name ends in `.project-specific.md` is for the source project only. Examples: `general.project-specific.md`, `design-system.project-specific.md`.

   Find every `*.project-specific.md` file under `.ai/rules/`, `.ai/skills/`, `.ai/prompts/`, and `.ai/docs/`. For each one:
   - Show the file path and a one-line summary of what it contains
   - Ask the user: **keep** (if relevant to this new project), **edit** (rewrite for this project), or **delete**
   - Default: delete

   Files **without** `.project-specific` in the filename are generic — keep them all without prompting.

5. **Initialise `.ai/MEMORY.md` if missing**
   If `.ai/MEMORY.md` doesn't exist yet, create it with a single starter entry. Use this format:
   ```
   [YYYY-MM-DD][setup] Project initialised from `.ai/` template scaffold. CLAUDE.md instantiated from `.ai/templates/claudemd-file-template.md`.
   ```

   **Replace `YYYY-MM-DD` with the literal date** before writing. If you have system date access, use today's date. If you don't, **ASK THE USER** for today's date — never make up or guess a date.

6. **Create agent symlinks**

   Cursor and Claude Code read from `.cursor/` and `.claude/` at the repo root. Those folders must be symlinks into `.ai/` — never edit rules or skills in `.cursor/` or `.claude/` directly.

   Create if missing (skip any path that already exists — report as skipped):

   | Symlink | Target |
   |---------|--------|
   | `.cursor/rules` | `../.ai/rules` |
   | `.cursor/permissions.json` | `../.ai/cursor/permissions.json` |
   | `.cursor/sandbox.json` | `../.ai/cursor/sandbox.json` |
   | `.claude/rules` | `../.ai/rules` |

   For each skill directory under `.ai/skills/`, create matching symlinks in `.cursor/skills/` and `.claude/skills/` pointing to `../../.ai/skills/<skill-name>`.

   Example shell (run from repo root):

   ```bash
   mkdir -p .cursor/skills .claude/skills
   ln -sf ../.ai/rules .cursor/rules
   ln -sf ../.ai/cursor/permissions.json .cursor/permissions.json
   ln -sf ../.ai/cursor/sandbox.json .cursor/sandbox.json
   ln -sf ../.ai/rules .claude/rules
   for skill in .ai/skills/*/; do
     name=$(basename "$skill")
     ln -sf "../../.ai/skills/$name" ".cursor/skills/$name"
     ln -sf "../../.ai/skills/$name" ".claude/skills/$name"
   done
   ```

   Why: Cursor auto-loads `.cursor/rules/` into every chat. Without these symlinks, `.ai/rules/` never reaches the agent.

7. **Create Cursor permissions file**

   Ensure `.ai/cursor/permissions.json` exists. Use Cursor's **IDE agent format** (not CLI `permissions.allow` — that format does not control terminal prompts in the editor).

   Minimum for a Node/npm repo:

   ```json
   {
     "terminalAllowlist": [
       "git",
       "npm",
       "npx",
       "node"
     ]
   }
   ```

   Optional: `mcpAllowlist` (e.g. `"*:*"` or `"github:*"`) and `autoRun` for Auto-review mode. See [Cursor permissions.json reference](https://cursor.com/docs/reference/permissions).

   Note: `.cursor/cli.json` is separate (CLI agent permissions). Do not remove it if present.

   **Run Mode required:** Cursor Settings → Agent → Run Mode must be **Auto-review**, **Allowlist**, or **Run Everything** — not deprecated "Ask every time". The file only applies when Run Mode is on.

   Symlink: `.cursor/permissions.json` → `../.ai/cursor/permissions.json` (step 6).

8. **Report what was created and removed**
   - List every file the skill wrote, with paths
   - List every project-specific file that was removed
   - List skipped templates separately with the reason
   - List symlinks created or skipped

9. **Run `/start-chat`**
   After setup is fully complete, run the `/start-chat` skill so normal chat-start workflow begins with the new project context.

## What this skill does NOT do

- Install npm packages
- Run database migrations
- Configure environment variables or secrets
- Set up git / push to remote
- Generate any app code

Those are separate concerns. Hand off to the user once templates are done.
