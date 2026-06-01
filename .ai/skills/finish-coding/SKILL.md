# /finish-coding

Run this when you finish coding in a chat (before you close the thread or start unrelated work in a new one).

## Checklist

1. **Code review**

   Review **all changed files** — use `git diff` and `git status` (staged and unstaged). Skip if nothing changed.

   - Make sure the plan was correctly implemented (check against `.ai/docs/plans/active-*.md` if one exists for this work).
   - Look for any obvious bugs or issues in the code.
   - Look for subtle data alignment issues (e.g. expecting snake_case but getting camelCase, or expecting data in an object but receiving a nested object like `{ data: { } }`).
   - Look for any over-engineering or files getting too large and needing refactoring.
   - Look for any weird syntax or style that doesn't match other parts of the codebase.
   - Run `npx knip` as the starting scan, then verify findings manually (knip misses Next.js route conventions). Delete or fix anything touched or discovered in this chat:
   - Unused exports** — functions, types, and components exported but never imported elsewhere. Remove the export, or delete the symbol if nothing uses it internally either.
   - Orphaned routes** — pages under `app/` that are not linked from navigation, middleware redirects, or documented admin bookmarks. Delete unless there is an explicit reason to keep it as a manual URL.
   - One-off scripts** — migration/import scripts in `scripts/` not referenced by `package.json` scripts and not part of an active workflow. Delete when the job is done.
   - Legacy features** — superseded models, server actions, and UI that duplicate a newer path. Remove the schema, action, page, and any Prisma relation together. Run `npm run db:migrate` if the schema changed.
   - Unused code** — whole files with zero importers, duplicate helpers, abandoned spikes, and dependencies with no imports. Prefer deleting the file over leaving it commented out.
   - Check all typography comes from `lib/design-system/typography.ts`

   After cleanup: run `npm run build` (or at minimum `npx tsc --noEmit`), then `npx knip` again to confirm deletions are reflected.

   Document your findings: 
   - When documenting findings show the user all files that have changed and explain what has changed in that file (what we've removed what we've added or fixed and explain why we did that changed
   - Display this document in the chat  before continuing the checklist
   - Outline what you would change / fix / improve
   - Once the user approves changes,  Fix blockers before moving on.


2. **App state**
   Does it compile and run without errors? No console errors?

3. **Tests**
   Run `/test` for everything new or changed in this chat. Full pipeline: `.ai/rules/test-pipeline.md`.

   1. **Stage 1:** Post the full test plan in chat (scenarios, states, layers, existing tests to update). Wait for approval before writing test code — unless the user said "auto-run".
   2. **Stages 2–5:** Write or update tests, run, self-heal failures, summarise results.

   Never mark this step passed if a command exited non-zero, or if changed code has no tests and the Stage 1 plan did not explain why.

4. **MEMORY.md**

   Check whether this chat produced anything worth recording — a `[decision]`, `[lesson]`, or `[shipped]` entry. Many chats need zero new lines.
   If yes: draft every new entry in chat first. Show the **complete text** of each entry you propose to append — not a summary, not a few lines, not "see file". Wait for explicit approval before editing `.ai/MEMORY.md`.
   Only write once per chat.
   Follow Memory rules in global instructions (`~/.ai/instructions.md`) and `.ai/rules/memory.md`.

5. **BUILD_JOURNAL**
   Check whether this chat warrants an entry (when and what: `~/.ai/instructions.md` § Build Journal). Many chats need no entry.
   If yes: draft the **full** entry in chat first (`##` heading through last paragraph). How to write (tone, structure): same section in global instructions — do not duplicate those rules here. Wait for explicit approval before appending to `.ai/docs/BUILD_JOURNAL.md`. Excerpts are not acceptable.
   If no entry is warranted, skip it.

6. **Commit**
   Stage all changes. Write a clear commit message — one line summary of what changed.
   Never commit without explicit approval from the user.
   Split into separate commits if changes span unrelated concerns.

7. **Push**
   Push to remote. Nothing stays local only.

## Commit message format
- Short summary on the first line (what changed, not why)
- If needed, add a blank line then a brief explanation of why
- Never include "AI-generated" or tool attribution in commit messages
