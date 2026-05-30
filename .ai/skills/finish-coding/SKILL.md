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

   Document your findings and display them in chat before continuing the checklist. Fix blockers before moving on.

2. **Dead code cleanup**
   Run `npx knip` as the starting scan, then verify findings manually (knip misses Next.js route conventions). Delete or fix anything touched or discovered in this chat:

   - **Unused exports** — functions, types, and components exported but never imported elsewhere. Remove the export, or delete the symbol if nothing uses it internally either.
   - **Orphaned routes** — pages under `app/` that are not linked from navigation, middleware redirects, or documented admin bookmarks. Delete unless there is an explicit reason to keep it as a manual URL.
   - **One-off scripts** — migration/import scripts in `scripts/` not referenced by `package.json` scripts and not part of an active workflow. Delete when the job is done.
   - **Legacy features** — superseded models, server actions, and UI that duplicate a newer path. Remove the schema, action, page, and any Prisma relation together. Run `npm run db:migrate` if the schema changed.
   - **Unused code** — whole files with zero importers, duplicate helpers, abandoned spikes, and dependencies with no imports. Prefer deleting the file over leaving it commented out.

   **Keep:** scripts listed in `package.json` (`fix-answers`, `backfill-mcq-options`, etc.); intentional admin/dev bookmark routes only if documented in MEMORY or a plan.

   **Typography:** all typography must come from `lib/design-system/typography.ts`. Do not reintroduce `lib/typography.ts`.

   After cleanup: run `npm run build` (or at minimum `npx tsc --noEmit`), then `npx knip` again to confirm deletions are reflected.

3. **App state**
   Does it compile and run without errors? No console errors?

4. **Tests**
   Run the relevant test commands for anything new or changed in this chat:
   ```bash
   npm run test
   npm run test:e2e
   ```

   **If anything fails, you must tell the user in chat before moving on.** Do not silently continue the checklist.

   1. Paste the **full error output** (not a summary) — every failing test name, stack trace, and stderr line.
   2. **Self-heal first** — follow `.ai/rules/test-pipeline.md` Stage 4 (up to 3 fix-and-retry attempts) before reporting a final failure.
   3. After self-healing, if tests still fail, state clearly: which command failed, how many retries were attempted, and what blocker remains.
   4. If tests were not written for changed code, say why.

   Never mark the tests step as passed if a command exited non-zero.

5. **MEMORY.md**
   Check whether this chat produced anything worth recording — a `[decision]`, `[lesson]`, or `[shipped]` entry. Many chats need zero new lines.
   If yes: draft every new entry in chat first. Show the **complete text** of each entry you propose to append — not a summary, not a few lines, not "see file". Wait for explicit approval before editing `.ai/MEMORY.md`.
   Only write once per chat.
   Follow Memory rules in global instructions (`~/.ai/instructions.md`) and `.ai/rules/memory.md`.

6. **BUILD_JOURNAL**
   Check whether this chat warrants an entry (when and what: `~/.ai/instructions.md` § Build Journal). Many chats need no entry.
   If yes: draft the **full** entry in chat first (`##` heading through last paragraph). How to write (tone, structure): same section in global instructions — do not duplicate those rules here. Wait for explicit approval before appending to `.ai/docs/BUILD_JOURNAL.md`. Excerpts are not acceptable.
   If no entry is warranted, skip it.

7. **Commit**
   Stage all changes. Write a clear commit message — one line summary of what changed.
   Never commit without explicit approval from the user.
   Split into separate commits if changes span unrelated concerns.

8. **Push**
   Push to remote. Nothing stays local only.

## Commit message format
- Short summary on the first line (what changed, not why)
- If needed, add a blank line then a brief explanation of why
- Never include "AI-generated" or tool attribution in commit messages
