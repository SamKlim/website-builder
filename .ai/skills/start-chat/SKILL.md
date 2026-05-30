# /start-chat

Run at the start of every new chat. The agent follows this on the first message — the user does not need to type `/start-chat`.

Full steps live in this skill. `CLAUDE.md` § Chat workflow is the summary only.

## Steps

1. **Say what loaded**

   List the instruction files already in context, for example:
   "Loaded: `~/.ai/instructions.md`, `CLAUDE.md`, `.ai/rules/memory.md`"

   Add any other `.ai/rules/*.md` files that are active for this chat.

2. **Ask intention** (skip if the user's first message already makes it obvious)

   > What's the intention for this chat? Pick one — or describe something else:
   > - **Build** — new feature, page, component, or behaviour change
   > - **Fix** — bug or small change to something that already exists
   > - **Question** — explain, explore, or review; no code changes expected
   > - **Other** — anything else (say what)

3. **Read memory** — for **Build**, **Fix**, and **Other** only

   Read `.ai/MEMORY.md`. Skip for **Question** (no code expected).
   Why: past decisions and `[shipped]` entries stop you rebuilding or getting architecture wrong.
   Do not recite memory back.

4. **Check active plans** — for **Build** only

   Look for `.ai/docs/plans/active-*.md`.
   - If one exists with `Status: approved` → ask: "Implementing from [plan name]?"
   - If one exists with `Status: draft` → continue that plan (brainstorm only until approved)
   - If none → start fresh brainstorm

5. **Route by intention**

   | Intention | Next step |
   |-----------|-----------|
   | **Build** | See **Build route** below |
   | **Fix** | Investigate → fix → tests when code changes |
   | **Question** | Answer or explore. No code unless they ask. |
   | **Other** | Clarify, then agree the route |

### Build route (mandatory)

When intention is **Build**:

1. Read `.ai/skills/brainstorm/SKILL.md` immediately (same turn, before other work)
2. Follow brainstorm process. No app code until plan is approved.

6. **Do not start building** until intention is clear and the route is agreed.
