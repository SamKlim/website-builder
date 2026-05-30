# /brainstorm

Use this skill before building any new feature, component, page, or behaviour change.

**Automatic on Build:** `/start-chat` must read this file immediately when intention is Build. You do not wait for the user to type `/brainstorm`.

## HARD STOP — read before anything else

Applies when intention is **Build** and no plan in `.ai/docs/plans/active-*.md` has `Status: approved`.

Announce in chat: **"Entering brainstorm mode — read only. No code until you approve the plan."**

If you are in brainstorm mode, you MUST NOT write app code in this turn or any later turn until the user approves the plan.

**User providing specs ≠ approval.** Detailed prompts are plan input, not permission to build.

### Forbidden until plan approved

Do NOT create, edit, or delete:

- App source (`src/`, `app/`, `components/`, `lib/`, `public/`)
- Config (`package.json`, `vite.config.*`, `tailwind.config.*`, `tsconfig.*`, `index.html`, `*.html` at repo root)
- Shell commands that install deps, scaffold, build, or run dev
- Task subagents that write app code

Do NOT interpret detailed specs, pasted prompts, or "build X" as approval to code.

### Allowed during brainstorm

- Read the codebase
- Ask questions and discuss options in chat
- Write or edit files under `.ai/docs/plans/` only (the active plan)

### Exit brainstorm (code allowed)

Only after the user explicitly approves, e.g. "approved", "build it", "go ahead and code".

Then set the plan `Status: approved` and implement.

---

## Planning mode — read only

Do not write or edit code, components, tests, or config until the user has approved the plan.

## Process

1. **Understand first**
   - Ask further clarifying questions to flesh out the request, or if anything is unclear. 
   - Ask how certain edge cases should be handled, and how unhappy paths should be handled
   - Don't start designing until the goal is clear.

2. **Explore approaches**
   Propose 2–3 options with trade-offs.
   Lead with your recommendation and reasoning.
   - Then Create a technical plan that concisely describes the feature the user wants to build.
   - Research the files and functions that need to be changed to implement the feature
   - Include specific and verbatim details from the user's prompt to ensure the plan is accurate.
   - Point to all the relevant files and functions that need to be changed or created
   - If necessary, breaks up the work into logical phases. Ideally this should be done in a way that has an initial "data layer" phase that defines the types and db changes that need to run, followed by N phases that can be done in parallel (e.g. Phase 2A - UI, Phase 2B - API). Only include phases if it's a REALLY big feature.


3. **Present incrementally**
   Once direction is agreed, present the design in small sections (~200–300 words).
   Check after each section before continuing.

4. **Save the design**
   Write the validated design to `.ai/docs/plans/active-YYYY-MM-DD-<topic>.md`
   using the plan template at `.ai/templates/plan-template.md`.
   Set `Status: draft`.
   **Stop.** Tell the user the plan is ready for review.
   Wait for explicit approval before any code.
