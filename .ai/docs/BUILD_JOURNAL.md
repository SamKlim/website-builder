# Building Exam Vault: A VCE Maths Question Bank from Scratch

*A detailed build log of Exam Vault — a web app that organises every VCAA Mathematical Methods exam question from 2006–2025, with worked solutions, topic taxonomy, and tutor tools. Built with Next.js 14, Prisma, PostgreSQL, and Supabase.*

---

## What is Exam Vault?

Exam Vault is a question bank for VCE Mathematical Methods (Year 12). Every past VCAA exam question is categorised by topic, subtopic, and difficulty — so tutors can instantly find "all Chain Rule questions from the last 5 years" or "every hard Probability question."

Each question has:
- LaTeX-rendered content (with KaTeX)
- Worked solutions (sourced from iTute, step by step)
- Difficulty ratings based on VCAA examiner report data (% of students who got it right)
- A 3-level taxonomy: Topic > Subtopic > Sub-subtopic
- Prerequisite tags when a question requires cross-topic knowledge

---

## Phase 1: The Question Bank (Core Product)

### Rendering maths in the browser

Every question contains LaTeX. We use **KaTeX** for rendering — it's faster than MathJax and works well client-side. The `MathRenderer` component parses a string, splits it on `$` (inline) and `$$` (display) delimiters, and renders each segment.

**Gotcha:** Markdown and KaTeX don't mix. We learned the hard way that `**bold**` and backticks inside question content render as literal characters because KaTeX doesn't process markdown. The rule: use `$\textbf{word}$` for bold inside maths, and plain text everywhere else. No markdown in question content, ever.

### Multi-part question grouping

VCAA questions are often multi-part (a, b, c, d…). We store each part as its own database row, then group them client-side by `year:examType:section:questionNumber`. The UI renders them as a single card with parts stacked vertically.

**The `sharedContext` problem:** Part (a) might have a preamble ("The function f(x) = …"), and parts (b)–(d) build on it. We store this preamble in `sharedContext` on part (a), and the UI shows it once at the top of the card. But we had a recurring bug: if you also put the preamble in part (a)'s `content`, it appears twice. The rule: `sharedContext` on part (a) is the opening preamble only if part (a)'s own content doesn't already say the same thing. For later parts, `sharedContext` is only text the exam *literally prints between parts* that hasn't appeared before. If nothing new is printed, it's `null` (never empty string).

### The taxonomy — the hardest part of the whole project

This was by far the biggest challenge. Not the code, not the deployment, not the auth — *categorising questions into topics*.

We built a 3-level taxonomy: **Topic > Subtopic > Sub-subtopic**. The top-level topics map to the VCE Methods curriculum:

1. Algebra and Polynomials
2. Transformations
3. Other Functions
4. Exponential and Logarithmic Functions
5. Trigonometry and Circular Functions
6. Differentiation
7. Integration
8. Probability and Statistics
9. Pseudocode (added later — VCAA sometimes tests algorithm reading)

Sounds straightforward. It wasn't.

**The fundamental problem: maths questions don't fit neatly into one box.** A question might ask you to differentiate an exponential function, then use the result to find an area under a curve using integration. Is that a Differentiation question? An Exponential question? An Integration question? It's all three.

This isn't an edge case — it's the norm, especially in harder questions. VCAA deliberately writes questions that combine skills. A single multi-part question might start with algebra, move to calculus, and finish with probability. The whole point of the exam is to test whether students can connect ideas across the curriculum.

We tried several approaches before landing on one that works:

**Attempt 1: Tag everything.** We added concept tags liberally — "exact values", "graph sketching", "exponential differentiation", "substitution". We ended up with 79 tagged questions and the tags were meaningless noise. "Substitution" doesn't help anyone find questions; it's a basic technique used everywhere.

**Attempt 2: Multi-topic assignment.** We considered letting each part of a question have its own topic. Part (a) = Differentiation, part (b) = Integration, part (c) = Algebra. This completely broke the UI — multi-part questions display as a single grouped card, so parts would appear scattered across different topic pages without their context. A student looking at "part (c)" of a question with no preamble or earlier parts is useless.

**What we landed on: One topic per question, with prerequisite tags for genuine cross-topic skills.**

All parts of a multi-part question share the same topic — the *primary* skill being tested. If part (d) requires a secondary skill from a different topic, that gets a "prerequisite" tag. Tags are only added when a question genuinely requires knowledge from a different topic area that isn't obvious from the taxonomy. A Differentiation question that uses the quotient rule on an exponential? Still just Differentiation — no tag needed. A Differentiation question where part (c) asks you to find an area between curves? Tag: `integration`.

We cleaned up 79 tagged questions down to 15 with genuine cross-topic tags. They display as purple "Prerequisite" chips below the question text.

**The tag approval rule:** We now require explicit approval before adding any concept tag. Without this gate, tag creep is inevitable — every question "involves" multiple skills if you squint hard enough. The question is: would a student studying *only* the assigned topic be surprised by what this question asks? If yes, tag it. If no, don't.

**Gotcha — forced subtopics:** Early on, we created subtopics for everything. Bad idea. Some topics (like Trigonometry and Circular Functions) don't have genuinely distinct sub-areas — graphing, solving, and modelling trig are all intertwined. We now have a rule: only assign a subtopic when the topic has clearly distinct techniques a student would practise independently. Differentiation has Chain Rule, Product Rule, Quotient Rule — those are genuinely separate skills. Circular Functions doesn't need subtopics. Exponential and Logarithmic Functions only had 2 questions — subtopics just added friction. We removed them.

**Gotcha — near-duplicate categories:** Without a deduplication rule, we ended up with "Definite integrals" and "Definite Integrals", or "The quotient rule" and "Quotient Rule". Now before assigning any category, we query all existing values and check for case/wording differences. If an existing value covers the same concept, use it exactly.

**Gotcha — hierarchy inconsistency:** We accidentally mixed specificity levels within the same topic. Under Probability and Statistics, one question had subtopic = "Continuous random variables" and another had subtopic = "Mean and median for a continuous random variable". The second is a *child* of the first, not a peer. The fix: all subtopics within a topic must be at the same conceptual level. Specific techniques go in sub-subtopic.

### The Exam 2 Extended Response problem

This deserves its own section because it was a major scoping decision.

VCE Methods has two exams:
- **Exam 1** — short answer, no calculator (typically 9 multi-part questions)
- **Exam 2** — Section A is 20 multiple choice questions, Section B is 5 extended response questions

Exam 1 and Exam 2 multiple choice questions are relatively clean to categorise. Each question mostly tests one topic, maybe with a secondary skill.

Exam 2 Extended Response questions are a completely different beast. A single ER question might have 8 parts spanning differentiation, integration, algebra, probability, and graph interpretation. Part (a) might set up a function, parts (b)–(d) might differentiate and integrate it, and parts (e)–(h) might apply it to a probability context. The whole question is *designed* to cross topics.

We tried categorising these and it was painful. Every assignment felt wrong — calling a 8-part question "Differentiation" when half of it is integration and a quarter is probability doesn't help anyone.

**The decision: hide Extended Response questions from the main question bank for now.** They're still in the database with `section = 'Extended Response'`, but the questions page filters them out. We'll handle them separately later — possibly with a different UI that shows the full question as a single document rather than trying to slot it into a topic-based browse experience.

This let us focus on getting Exam 1 and multiple choice questions right first. These are the questions where topic-based browsing actually makes sense — a tutor looking for "Chain Rule practice" will find exactly that. Extended Response questions need a different treatment.

### Worked solutions: the object vs string bug

We stored worked solutions as a JSON array in Postgres. Each step was meant to be a string, but our import script saved them as `{ text: "...", type: "itute" }` objects (to track the source). The `WorkingReveal` component expected `string[]` and passed each step directly to `MathRenderer`.

JavaScript being JavaScript: `"" + { text: "..." }` gives `"[object Object]"`, which has no `$` delimiters, so KaTeX found nothing to render. The symptom: numbered step badges (1, 2, 3, 4) appeared but with completely blank content. No errors in the console. The fix was a one-liner — extract `.text` from each step before rendering.

**Lesson:** When your rendered output is blank but the container is present, check whether you're passing an object where a string is expected. JavaScript won't throw — it'll silently coerce.

---

## Phase 2: The Design System

Before writing any UI, we defined a type scale in `lib/typography.ts`. Every text element references a named style — never raw `text-[18px] font-bold`. The scale covers display, heading-1 through heading-3, body-lg, body, body-sm, label, caption, and button.

All colours come from CSS variables in `globals.css`. Primary brand colour is `#001f3d` (navy) via `--primary`. Difficulty chips use CSS vars too: `--difficulty-easy`, `--difficulty-medium`, `--difficulty-hard` with matching background variants.

We have a single canonical card style (Elevated Card) and a `Chip` component with variants: neutral, easy, medium, hard, and prerequisite.

---

## Phase 3: Responsive UI + Loading States

### Shimmer loading for filter navigation

When you click a topic or subtopic in the sidebar, the page re-renders server-side. On a slow connection, nothing visually changes — the user doesn't know if they clicked the button. We added shimmer skeleton loading:

1. **`NavigationContext`** — a React context wrapping `useTransition` + `router.push`. Every filter click goes through `navigate()` which starts a transition.
2. **`QuestionListShimmer`** — 4 skeleton cards that appear when `isPending` is true.
3. **`QuestionListWrapper`** — hides the real question list during the transition.

**Gotcha — the bundling error:** We initially put `NavigationProvider` only in the questions page. When navigating client-side from `/topics` to `/questions`, Next.js threw: "Could not find the module NavigationContext.tsx#NavigationProvider in the React Client Manifest."

Next.js builds separate client bundles per route. The topics page's bundle didn't include the NavigationContext chunk. Fix: move the provider to the root layout (`app/layout.tsx`) so it's in the shared bundle for every route.

**Lesson:** If you add a React context that's only used on one page, but other pages navigate to it client-side, the context must be in a shared ancestor (like the layout). Otherwise the destination page's client components aren't in the originating page's bundle manifest.

---

## Phase 4: Auth & Onboarding

### Google Sign-In with Supabase

We added real authentication using **Supabase Auth** with Google OAuth. Before this, the "Sign in with Google" button on the landing page was just a link to `/topics` — no actual auth.

The full auth flow we built:

1. User clicks "Sign in with Google" on the landing page
2. Supabase redirects to Google's OAuth consent screen
3. Google redirects back to our `/auth/callback` route with an auth code
4. The callback route exchanges the code for a session using `supabase.auth.exchangeCodeForSession()`
5. We look up the user's Profile in our Prisma database (separate from Supabase's auth schema)
6. If no Profile exists → create one with `hasOnboarded: false`
7. If the email matches the `ADMIN_EMAIL` env var → auto-promote to admin, skip onboarding
8. If `hasOnboarded: false` → redirect to `/onboarding`
9. If `hasOnboarded: true` → redirect to `/topics`

We set up three Supabase client utilities following the `@supabase/ssr` pattern for Next.js App Router:
- `lib/supabase/client.ts` — for Client Components (browser)
- `lib/supabase/server.ts` — for Server Components, Route Handlers, Server Actions
- `lib/supabase/middleware.ts` — for middleware (cookie refresh)

**Gotcha — Prisma in Edge runtime:** Next.js middleware runs on the Edge runtime, which can't use Prisma's Node.js client. You can't query the database in middleware. We work around this with cookie-based routing hints — when a user authenticates, we set cookies like `x-onboarded` and `x-role`. Middleware reads these cookies to make routing decisions (redirect unauthenticated users to `/sign-in`, redirect non-onboarded users to `/onboarding`, block non-admins from `/admin`). The real auth checks happen in server components and server actions where Prisma is available.

**Lesson:** If you're using Prisma with Next.js middleware, you can't query the database directly. Use cookies or headers as lightweight routing hints, and do the real authorization checks server-side.

### Account types and onboarding

We have four conceptual roles:

| Role | Description | How they get this role |
|------|-------------|----------------------|
| **Admin** | Sam. Sees everything + admin dashboard. | Hardcoded — email matches `ADMIN_EMAIL` env var |
| **Tutor (internal)** | Tutors who work for Sam's tutoring company (Insight Tutors). Get free access + can leave feedback on questions. | Enter a specific invite code during onboarding |
| **Tutor (external)** | External tutors invited to review the app. | Sign up as tutor, don't enter a code (or enter wrong code) |
| **Student** | Future — not built yet. | N/A |

**Key decision: one role, one flag.** Internal and external tutors are the same database role (`tutor`) with a boolean `isInternal` flag. We considered separate roles but decided feature flags are simpler than role hierarchies when you only have a handful of internal tutors. The `isInternal` flag controls which features are visible (like the "Give feedback" button on question cards).

**The onboarding flow we built:**
1. After Google Sign-In, new users land on `/onboarding`
2. Step 1: "Are you a Tutor or a Student?" — two cards to choose from
3. If Tutor → an invite code field appears (optional). Valid code = flagged as internal tutor.
4. Step 2 (tutors only): "Add your students" — enter student names for session tracking
5. Done → redirect to `/topics`

The invite code is a single env var (`INSIGHT_TUTOR_INVITE_CODE`). No database table, no code management UI. One code for all internal tutors. Simple.

---

## Phase 5: Admin Dashboard & Tutor Feedback

### The admin page (`/admin`)

Three tabs: Feedback, Design System, Taxonomy. The design system page moved here (it was previously a public route). The taxonomy tab shows a mind map of all topics > subtopics > sub-subtopics with question counts.

### Tutor question feedback

Internal tutors see a "Give feedback" button on each question card. It opens a dialog with voice-to-text support (Web Speech API — browser native, no external dependencies). Feedback is saved to a `QuestionFeedback` table linked to both the question and the tutor's profile.

---

## Deployment

### Vercel + Supabase

The app deploys on Vercel with a Supabase Postgres database. Two deployment gotchas:

1. **`prisma generate` before build:** Vercel's build step needs `prisma generate` to run before `next build`, otherwise the Prisma client isn't generated and the build fails. We added it to the build script in `package.json`.

2. **`force-dynamic` on every page with Prisma:** Next.js tries to statically render pages at build time. Any page that calls Prisma will fail during static generation because there's no database connection at build time. We export `const dynamic = 'force-dynamic'` on every page that queries the database.

3. **Connection pooling:** Supabase requires a connection pooler URL for serverless environments. We use `DATABASE_URL` (pooled, port 6543) for queries and `DIRECT_URL` (direct, port 5432) for migrations. Both are configured in `prisma/schema.prisma`.

---

## The Exam Processing Workflow

Every exam goes through a strict 5-step process:

1. **Images** — Sam manually crops all images from the PDF. No auto-cropping.
2. **Questions** — Transcribe into the database, verify visually in the browser.
3. **Answers & Solutions** — Copy iTute's worked solutions verbatim. Examiner's report is the source of truth for correct answers.
4. **Categorise** — Assign topic/subtopic/sub-subtopic following the taxonomy. Check for duplicates. Concept tags require approval.
5. **Batch** — Process 5 questions at a time, check in with Sam after each batch.

**Why iTute verbatim?** We initially let Claude paraphrase and improve solutions. Bad idea — it introduced subtle errors and inconsistencies. Now we copy iTute word-for-word, and any improvements happen in a separate pass.

---

## SQL Gotcha: NULL Semantics with Prisma

Our `section` column was originally nullable — Exam 1 questions had `section = NULL`, Exam 2 Section A had `section = 'A'`, Section B had `section = 'B'`. When we tried to hide Section B questions with:

```typescript
where: { section: { not: 'B' } }
```

This excluded *all* Exam 1 questions too. In SQL, `NULL != 'B'` evaluates to `NULL` (unknown), not `TRUE`. Prisma's `not` translates to SQL `!=`, which excludes NULLs.

**Fix:** We renamed all section values to explicit strings: `NULL → "Exam 1"`, `"A" → "MC"`, `"B" → "Extended Response"`. No more NULLs, no more gotcha.

**Lesson:** Never use nullable columns for filtering if you want `NOT X` to include rows where the column is unset. Either use explicit values or handle the NULL case with an `OR` clause.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Supabase Auth (Google OAuth) |
| Styling | Tailwind CSS |
| Math rendering | KaTeX |
| Hosting | Vercel |
| Font | Instrument Sans (400–700) |

---

## Editorial Illustrations: AI-Generated SVGs via Gemini + Figma

We wanted editorial-style illustrations for the landing page and empty states — the kind of clean, stylised vector graphics you'd see on a well-designed SaaS site. Not stock icons, not generic clip art, something with personality that matched our design system.

**The problem:** Getting AI to generate illustrations that match an existing visual style is hard. Most models produce images that look generically "AI-generated" — they don't respect reference material well enough to produce something cohesive.

**What worked: Gemini's Nano Banana model.** After experimenting with several approaches, we found that Gemini's Nano Banana model was the best at taking reference graphics and producing something similar but distinct. The workflow:

1. Feed reference illustrations into Gemini (Nano Banana model) and ask it to create images in a similar style
2. Gemini outputs PNG files — unfortunately, Nano Banana can only produce raster images, not vectors
3. Import the PNGs into **Figma** and use the **Vectorize** feature — it converted them perfectly to vector paths
4. Export as SVG files from Figma
5. Hand the SVGs to Claude to integrate into the codebase as React components

**Why this matters:** The Gemini → Figma → SVG pipeline gives you production-quality vector illustrations with a consistent style, all from AI-generated source material. The key insight is that you don't need the AI model to output SVG directly — Figma's vectorisation handles the raster-to-vector conversion better than any AI model currently does.

**Gotcha:** Don't try to get AI models to generate SVG code directly. The results are always worse than generating a good raster image and vectorising it. The visual quality of the PNG is what matters — the format conversion is a solved problem.

---

*This is a living document. Updated as new features ship.*

---

## Why I Stopped Putting AI Instructions in One Big File

*May 2026*

If you've used Cursor or Claude Code for more than a few weeks, you've probably ended up with some version of the same problem: a massive instructions file that started small and grew into something unmanageable. Mine was 208 lines. Rules about fonts sat next to database schema definitions, which sat next to git workflow instructions. Every session loaded all of it, whether it was relevant or not.

The problem got worse when I started using two AI tools on the same project — Cursor for day-to-day editing and Claude Code for longer agentic tasks. Each tool has its own config system. Cursor reads `.cursor/rules/`. Claude Code reads `.claude/rules/`. They don't talk to each other. So every time I updated a rule in one place, I had to remember to update it in the other. I didn't always remember. The tools started behaving differently from each other in ways that were hard to debug.

**The fix: one source of truth, with symlinks.**

I created a `.ai/` folder at the project root. All actual rule and skill files live there. The tool-specific folders (`.claude/` and `.cursor/`) contain nothing but symlinks pointing back to `.ai/`. Edit one file, both tools see it immediately.

The instructions themselves got split by topic — design system conventions, data schema rules, question display rules, session start behaviour. Each file is small and focused. Cursor can scope rules to only load when you're editing matching files, so the agent isn't reading irrelevant context on every prompt.

**What I learned about agent memory.**

The other big change was separating two things I'd been conflating: *instructions* (what the agent should always know) and *memory* (what happened last session). I added a `MEMORY.md` file to each project — short dated notes written once per session about decisions made and threads left open. The agent reads it first thing each session, confirms the last entry date, and picks up from there.

This is different from a build journal (like this one). Memory is for the AI to stay oriented across sessions. The journal is for humans — to understand *why* things are the way they are, months later when you've forgotten.

**The brainstorming problem.**

I also had a brainstorming workflow buried in the main instructions file — a process for designing features before writing code. The problem: it loaded into every session, even when I was just fixing a bug. It was noise.

The solution was to turn it into a skill — a separate file that only loads when you explicitly invoke `/brainstorm`. The skill saves the validated design as a plan doc before any code is written. Plans are kept lean: architecture decisions and data models only. Step-by-step implementation instructions go stale the moment you start building, so they're not worth maintaining.

**Key takeaways:**

- One source of truth, symlinked to each tool. Never duplicate rule content.
- Split rules by topic. Small, focused files beat one monolith.
- Separate memory (AI continuity) from documentation (human understanding).
- Turn recurring workflows into skills so they only load when needed.
- Plans should record decisions, not implementation steps.

---

## Part 2: Making the `.ai/` Folder Portable

*28 May 2026*

The first refactor (above) solved the immediate pain: one monolithic `CLAUDE.md`, two tools drifting apart, brainstorming noise in every session. That shipped on 27 May. The next day we finished the part that makes this reusable across projects — not just cleaner for Exam Vault.

This entry is the inside story: what we built, what broke, and what we'd do differently.

### The folder map

After the refactor, every AI-related file lives under `.ai/`:

| Path | Purpose | Who reads it |
|------|---------|--------------|
| `.ai/MEMORY.md` | Dated session notes — decisions, lessons, open threads | Agent, every session start |
| `.ai/rules/` | Always-on or scoped rules (auto-loaded) | Agent, every relevant chat |
| `.ai/skills/` | Workflows invoked with `/command` | Agent, only when invoked |
| `.ai/prompts/` | Copy-paste prompt text for common tasks | Human (or paste into chat) |
| `.ai/docs/` | Build journal, feature plans, design notes | Human; agent writes, rarely reads |
| `.ai/templates/` | Starters for `CLAUDE.md`, plans, design-system prompts | Agent during `/setup-new-project` |

The repo root keeps a slim `CLAUDE.md` (~50 lines): product context, where things live, which skills exist. Detailed rules stay out of it. **Every line in `CLAUDE.md` costs tokens in every conversation** — we learned that the hard way when the file hit 208 lines and the agent was re-reading database schema rules while fixing a CSS bug.

Tool-specific folders are symlinks only:

```
.claude/rules  →  ../.ai/rules
.cursor/rules  →  ../.ai/rules
.claude/skills/brainstorm  →  ../../.ai/skills/brainstorm
```

**Gotcha:** Never edit files inside `.claude/` or `.cursor/` directly. They're pointers. Write to `.ai/` always. We broke this once early on — edited a rule in `.cursor/rules/` before realising it was the same inode as `.ai/rules/`. Confusing, not catastrophic, but it taught us to treat `.ai/` as the only write target.

**Gotcha:** Skills symlink individually; rules symlink the whole directory. Both work. The rule directory symlink means adding a new rule file in `.ai/rules/` automatically appears in both tools — no second symlink to create.

### Rules: always-on vs scoped

Each rule file has YAML frontmatter that controls when it loads:

```yaml
---
description: Design system — typography, UI aesthetics
alwaysApply: false
paths:
  - "app/**"
  - "components/**"
globs: "{app,components,lib/design-system}/**"
---
```

- **`alwaysApply: true`** — loads every session (`general.md`, `session-start.md`, `test-pipeline.md`)
- **`alwaysApply: false` + paths/globs** — loads only when you're editing matching files (`design-system.md`, `question-schema.project-specific.md`)

This is the biggest token win after splitting the monolith. The agent doesn't read 8KB of Prisma schema rules when you're tweaking a button colour. Cursor and Claude Code both respect the frontmatter.

**Gotcha:** If a rule "isn't working," check the frontmatter first. We had `design-system.md` set to `alwaysApply: true` initially — every bug fix loaded typography rules. Scoped loading fixed that.

### The `.project-specific.md` convention

Exam Vault has rules about VCAA question taxonomy, Instrument Sans fonts, and route names. None of that belongs in a generic scaffold.

We split each rule into two files where needed:

- `design-system.md` — generic ("define a type scale, never hardcode font sizes")
- `design-system.project-specific.md` — Exam Vault tokens (`main-primary-black`, Instrument Sans, elevated card style)

Files ending in `.project-specific.md` are **for the source project only**. When you copy `.ai/` into a new repo, delete them (or rewrite them). Generic files stay.

This naming convention is deliberately ugly. That's the point — you can't miss it. `/setup-new-project` finds every `*.project-specific.md`, shows a one-line summary, and asks keep / edit / delete. Default: delete.

**What we learned:** Trying to maintain "universal" and "project" rules in one file with comments like `<!-- DELETE FOR NEW PROJECTS -->` didn't work. The agent ignored the comments. Separate files with an unmistakable suffix is clearer for humans and machines.

### Three layers of "what the agent knows"

We now have three distinct layers, and conflating them caused most of our early confusion:

1. **Global instructions** (`~/.ai/instructions.md`) — how to write code, test, handle errors, edit memory. Same across all projects.
2. **Project rules** (`.ai/rules/`, `CLAUDE.md`) — what this product is, how this repo is organised.
3. **Session memory** (`.ai/MEMORY.md`) — what happened last time, what's still open.

Memory is *not* a todo list. `[open]` items are unfinished work from the previous session that would confuse the next session if unmentioned — "started refactoring auth but stopped halfway," not "add dark mode someday." The `/end-session` skill enforces this: write memory once per session, mark `[open]` items `[closed]` when done.

The build journal (this file) is a fourth layer, but it's for humans. The agent writes to it at session end when something worth documenting happened. It never auto-loads. That's intentional — reading 300 lines of history every session would be expensive and mostly irrelevant.

### Skills vs rules vs prompts

We tried three mechanisms for "things the agent should sometimes do":

| Mechanism | When it loads | Best for |
|-----------|---------------|----------|
| **Rule** (`alwaysApply: true`) | Every session | Session start, general behaviour, test pipeline |
| **Rule** (scoped) | When editing matching files | Design system, schema conventions |
| **Skill** (`/brainstorm`, `/end-session`) | Only when invoked | Multi-step workflows you don't always need |
| **Prompt** (`.ai/prompts/*.md`) | When a human pastes it | One-off tasks, demos, "show me the app working" |

**The brainstorming lesson:** A design-before-build workflow in the always-on rules file was dead weight on 80% of sessions. Moving it to `/brainstorm` cut noise immediately. The skill saves output to `.ai/docs/plans/active-YYYY-MM-DD-<topic>.md` using a lean template — decisions and data models only, not step-by-step implementation (those go stale the moment you start typing).

**The end-session lesson:** Without a checklist skill, we'd forget memory updates, skip the journal, or commit without asking. `/end-session` is the closing ritual: app compiles → tests exist → memory written → journal if warranted → commit (with approval) → push.

**Prompts vs skills:** Prompts are plain text for humans to copy. Skills are structured workflows the agent follows. We added `.ai/prompts/demonstrate-app-is-working.md` for a recurring "prove the app runs" request — too lightweight for a skill, too repetitive to retype.

### Plans: active vs historic

Feature designs live in `.ai/docs/plans/`. Naming convention:

- `active-2026-05-28-onboarding-success-animation.md` — in progress or awaiting build
- `historic-auth-onboarding.md` — shipped or superseded

Old plans from before the refactor were renamed with a `historic-` prefix and moved from a top-level `plans/` folder into `.ai/docs/plans/`. The template (`plan-template.md`) fits on one screen: what we built, key decisions table, data model changes if any. No implementation steps.

**Gotcha:** A plan with 40 lines of "Step 1: create file X, Step 2: add hook Y" becomes wrong by line 15 of the actual build. Decisions survive; steps don't.

### `/setup-new-project`: bootstrapping a new repo

The 28 May commit added the missing piece: making `.ai/` copy-pasteable.

When you start a new project, copy the whole `.ai/` folder, then run `/setup-new-project`. The skill:

1. Sanity-checks the repo is actually fresh (won't overwrite existing `CLAUDE.md`)
2. Walks through `.ai/templates/`, filling `{{PLACEHOLDER}}` markers in a single batched form
3. Writes instantiated files (`CLAUDE.md`, optionally `design-system-prompt.md`)
4. Finds and removes (or rewrites) every `*.project-specific.md`
5. Creates a starter `MEMORY.md` entry with today's date

Templates have HTML comments above each placeholder explaining what to ask for. The agent reads the comment, batches questions, writes the file. Manual alternative: copy `claudemd-file-template.md` to repo root and fill it yourself.

**What this does NOT do:** install packages, run migrations, configure env vars, or push to GitHub. It's strictly "turn the AI scaffolding into files for this specific project." App setup is separate.

### The test pipeline rule

The same week we added `test-pipeline.md` — an always-on rule defining a 5-stage workflow that runs after every feature or fix:

1. **Plan** — 3–5 scenarios per test layer; wait for confirmation
2. **Generate** — unit (co-located `*.test.ts`), integration (`tests/integration/`), E2E (`tests/e2e/` + Page Object Model)
3. **Execute** — run Vitest or Playwright
4. **Self-heal** — up to 3 autonomous fix attempts (Playwright MCP for E2E locator debugging)
5. **Summarise** — markdown table of results + repro commands

**Gotcha:** E2E needs the dev server running before Playwright MCP debugging in Stage 4. The rule has an explicit Stage 0 prerequisite check (`curl localhost:3000`, start `npm run dev` if needed). Without that, the healer burns iterations on connection errors instead of real locator failures.

**Gotcha:** Don't duplicate every validator edge case in Playwright. Unit tests own exhaustive logic; E2E owns one happy path and one failure path in the UI.

### Cleanup we should have done earlier

The refactor also killed accumulated clutter:

- `docs/BUILD_LOG.md` → `.ai/docs/BUILD_JOURNAL.md` (better name, correct home)
- Top-level `plans/` → `.ai/docs/plans/` with `historic-` prefix
- Deleted `DRAGON_README.md` and `docs/TODO.md` — stale docs the agent was occasionally referencing
- Moved `ui-ux-pro-max` skill from `.claude/skills/` into `.ai/skills/` with symlinks back

**Lesson:** If a doc isn't in `.ai/` and isn't app code, the agent might still find it via search and treat it as authoritative. Dead docs are worse than no docs.

### What we'd do differently

1. **Start with `.project-specific.md` from day one.** We split files retroactively. Doing it on first write would have saved a migration pass.
2. **Keep `CLAUDE.md` under 60 lines.** We still revisit this. Product context + pointer table + skill list. Everything else is a rule or skill.
3. **Don't put workflows in global instructions.** Global (`~/.ai/instructions.md`) is for code quality and testing principles. Project workflows belong in skills.
4. **Write memory at session end, not mid-task.** Mid-task memory entries go stale before the next session starts.

### The commit sequence (for reference)

Four commits over two days, each one complete:

1. **27 May** — Core refactor: `.ai/` folder, rule split, symlinks, `MEMORY.md`, skills, plan template, journal move
2. **27 May** — Backfill admin/auth decisions into `MEMORY.md`; clarify `[open]` lifecycle in `/end-session`
3. **28 May** — Test pipeline rule + `tests/e2e/`, `tests/pages/`, Vitest scripts
4. **28 May** — `.project-specific.md` naming, `/setup-new-project` skill, `CLAUDE.md` template, `.ai/prompts/`

Each commit is one concern. The temptation was to squash them — don't. When something breaks, you want to know which layer introduced it.

### Key takeaways (portable version)

If you're setting this up on a new project:

- Copy `.ai/` wholesale. Symlink `.claude/rules` and `.cursor/rules` to it.
- Run `/setup-new-project`. Delete inherited `*.project-specific.md` files.
- Keep `CLAUDE.md` short. Put details in scoped rules.
- Use `MEMORY.md` for continuity, the build journal for story, plans for decisions.
- Workflows you don't need every session → skills. Repetitive paste text → prompts.
- Never duplicate content across `.claude/`, `.cursor/`, and `.ai/`. One source of truth.

---

## The sign-in page looked finished but felt dead

*28 May 2026*

The landing page had the right copy and a nice illustration, but the hero was static. One flat SVG, no movement. For a product about exam readiness, the first screen should feel alive without being distracting.

The hard part was not picking a library. It was making motion feel physical. We wanted a small bounce on the question mark and globe, one at a time, while the brain wiggles. That meant splitting the Figma export into named SVG groups and choreographing a loop so only one icon moves at a time.

The other fight was entrance timing. The headline used a CSS fade-in on load. The illustration had to fetch and parse the SVG first, so the text always won the race. Fixing that meant waiting for the SVG, then fading in the whole hero row together. Separate fades on left and right still look wrong if the image is not ready yet.

---

## Finishing onboarding felt like nothing happened

*28 May 2026*

Click Continue on the last onboarding step and the app just left. Server call, hard jump to `/topics`. The account got created. You wouldn't know it from the screen.

We added a loading hand, then confetti and "Account created!", same grey as the form. That part was straightforward. The fight was the handoff to `/topics`.

Celebrate first, navigate second? White flash while the next page loads. Kills the moment.

Navigate during the celebration instead. `/topics` renders underneath while the overlay is still up. But the overlay can't live on the onboarding page. It unmounts the instant the route changes. Had to move it to the root layout and let the navigation start while confetti is still playing. Overlay comes down once the new page is actually there.

---

## We kept shipping features without tests

*28 May 2026*

For weeks the bar at the end of a session was "does it compile?" That is a low bar. Onboarding got a confetti animation, the sign-in page got a choreographed hero, validators went into forms, and none of it had a test attached. Fine when one person holds the whole app in their head. It stops working the moment you forget why something behaves the way it does, or the moment an agent ships a fix and nobody notices it broke the landing page.

The fix was not "install Playwright and hope." We split testing into four jobs and wrote a rule that makes them run automatically after every feature, bug fix, or improvement. Unit tests sit next to the file they test and own the boring edge cases: every invalid input, every boundary, every helper function. Integration tests live in `tests/integration/` for API routes and server actions where you need to mock the database but not spin up a browser. Storybook stories sit next to components so you can see loading, error, and success states without clicking through the app. E2E tests live in a central `tests/e2e/` folder because they cross routes and auth; co-locating them next to a single component would lie about what they actually exercise.

Each layer earns its keep. Unit tests are fast and precise. Storybook catches visual states you would never reach manually in one session. E2E catches the wiring: did the illustration load, does the sign-in button exist, does the console stay clean. The mistake to avoid is running every validator edge case through Playwright. That is slow, brittle, and you will stop running the suite. Unit tests own exhaustiveness. E2E owns one happy path and one failure path in the UI.

The behaviour change is an always-on rule in `.ai/rules/test-pipeline.md`. After code ships, the agent plans a handful of scenarios, waits for confirmation unless you say "auto-run", writes the right tests, runs them, and tries to fix failures up to three times before giving up. GitHub Actions runs the same stack on every push. We also learned that failures must never hide inside a checklist. End-session ran E2E, the dev server failed to start, and the session closed as if nothing happened. The rule now says: paste the full error output in chat, self-heal first, then tell the human what is still broken.

Two small gotchas worth keeping. Never put a sleep in an E2E test waiting for an SVG to load. We had a 1.5 second `waitForTimeout` on the sign-in hero. Replacing it with a wait for the illustration network response cut the test from two and a half seconds to under one. Sleeps hide race conditions. Waits on real signals do not. And do not runtime-recolour Lottie JSON. We briefly swapped hex values in animation data at load time, with a helper function and unit tests for the swap logic. The right answer is simpler: edit `confetti.json` once with your brand browns and oranges, import it directly, and delete the indirection. One animation file, no colour map, no test for colour math.

If you are setting this up elsewhere, copy the folder structure (`tests/e2e/`, `tests/pages/`, `tests/integration/`), wire Vitest and Playwright, add Storybook, drop the pipeline rule with `alwaysApply: true`, and add a CI workflow. The point of this entry is the lesson: tests are part of shipping, not a phase at the end, and a passing checklist means nothing if nobody saw the stderr.

The full rule file is below. Copy it into `.ai/rules/test-pipeline.md` in your repo (and symlink or mirror it to `.cursor/rules/` if you use Cursor) if you want the same always-on testing behaviour.

````markdown
---
description: 5-stage automated test generation and self-healing pipeline. Runs automatically after any feature, bug fix, or improvement is implemented.
alwaysApply: true
---

# AI Multi-Step Testing Pipeline

**This pipeline runs automatically after every feature, bug fix, or improvement — without being asked.** It also runs when explicitly told to "test" or "run a test cycle".

Follow all stages in order. Do not skip stages. Do not write test code before Stage 2.

---

## Test layers — pick the right one

| Layer | What it tests | Where | Command |
|-------|---------------|-------|---------|
| **Unit** | Pure functions, validators, business rules | Co-located `*.test.ts` next to source | `npm run test:unit -- [target-file]` |
| **Integration** | API routes, server actions, DB with mocks | `tests/integration/*.test.ts` | `npm run test:integration -- [target-file]` |
| **Storybook** | Component visual states (empty, loading, error, success) | Co-located `*.stories.tsx` next to component | `npm run test:storybook -- [target-file]` |
| **E2E** | Full user flows in the browser | `tests/e2e/*.spec.ts` + `tests/pages/` | `npx playwright test [target-file] --reporter=json --reporter=list` |

**Coverage split:**
- Exhaustive success/failure edge cases for logic → **unit** tests
- HTTP status codes and payload validation → **integration** tests
- Every new reusable component → **Storybook** story for each user-visible state
- One representative happy path + one failure path in the UI → **E2E** tests
- Do not duplicate every validator edge case in Playwright

**CI:** GitHub Actions runs `npm run test`, `npm run build-storybook`, and `npm run test:e2e` on every push/PR to `main` and `dev`.

---

## Stage 0 — Prerequisites (E2E only)

Required before E2E Stage 3 and Playwright MCP in Stage 4. **Not needed for unit or integration tests.**

1. Check whether the dev server is already up (e.g. `curl -sf http://localhost:3000`).
2. If it is **not** running, start it in the background: `npm run dev`.
3. Wait until `http://localhost:3000` responds before continuing.

`playwright.config.ts` also has `webServer` with `reuseExistingServer: true`, so `npx playwright test` will start or reuse the server — but Stage 4 MCP debugging requires the server to be up independently.

---

## Stage 1 — Tactical Plan (Planner Mode)

1. Read the **code just written** for this feature, bug fix, or improvement.
2. Identify which test layer(s) apply (unit, integration, Storybook, E2E — often more than one).
3. Draft a markdown list of **3–5 explicit execution scenarios** per layer.
   - Must include: happy paths, failure/validation cases, network/API edge cases, and element state boundary conditions (E2E).
4. **WAIT** for confirmation before proceeding — unless the user says "auto-run".

---

## Stage 2 — Code Generation (Generator Mode)

### Where tests live

```
lib/
  utils.ts
  utils.test.ts              ← unit: co-located next to source

components/
  design-system/
    Card.tsx
    Card.stories.tsx         ← Storybook: component states

tests/
  integration/
    onboarding.test.ts       ← integration: API routes, server actions
  e2e/
    onboarding.spec.ts       ← E2E: browser flows
  pages/
    OnboardingPage.ts        ← E2E: Page Object Model classes
```

| Type | Location | Naming |
|------|----------|--------|
| Unit tests | Next to source file | `foo.test.ts` beside `foo.ts` |
| Storybook stories | Next to component | `Foo.stories.tsx` beside `Foo.tsx` |
| Integration tests | `tests/integration/` | `feature-name.test.ts` |
| E2E specs | `tests/e2e/` | `feature-name.spec.ts` |
| Page objects (POM) | `tests/pages/` | `FeatureNamePage.ts` |

Create missing folders at repo root if they do not exist.

### Rules

**Storybook:**
1. Add a story for every new reusable component.
2. Cover each user-visible state: empty, loading, error, success (as applicable).
3. Co-locate `Component.stories.tsx` next to the component.

**Unit & integration (Vitest):**
1. Use `describe` / `it` with explicit success and failure cases.
2. Mock external dependencies (DB, Supabase, fetch) in integration tests — do not hit real services.
3. Import from source using `@/` path alias.

**E2E (Playwright):**
1. Follow **Page Object Model (POM)** — page classes in `tests/pages/`.
2. Use **user-facing role locators only** — no CSS selectors, no XPath.

```typescript
// ✅ GOOD
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('test@example.com');

// ❌ BAD
await page.locator('.submit-btn').click();
await page.locator('#email-input').fill('test@example.com');
```

---

## Stage 3 — Execution & Output Capture

Run the command(s) matching the layer(s) from Stage 1:

```bash
# Unit (no dev server needed)
npm run test:unit -- [target-file]

# Integration (no dev server needed unless testing live HTTP)
npm run test:integration -- [target-file]

# Storybook component tests (no dev server needed)
npm run test:storybook -- [target-file]

# E2E (complete Stage 0 first)
npx playwright test [target-file] --reporter=json --reporter=list
```

Parse the full terminal output. If all tests pass → skip to Stage 5.

**If any command exits non-zero:** do not silently continue. Tell the user immediately in chat with the **full error output** (every failing test, stack trace, stderr). Then enter Stage 4 self-healing before treating the run as final.

---

## Stage 4 — Autonomous Self-Healing (Healer Mode, max 3 iterations)

Trigger only if Stage 3 produces failures.

**Unit / integration failures:**
1. Do **not** ask the user for advice — diagnose autonomously.
2. Read the Vitest error output and fix the test or source code.
3. Re-run the failing command. Repeat up to **3 times**.

**E2E failures:**
1. Do **not** ask the user for advice — diagnose autonomously.
2. Ensure Stage 0 is satisfied (dev server running).
3. Use the Playwright MCP tool to launch a headed browser at the failure point.
4. Inspect the accessibility tree snapshot to find changed or hidden elements.
5. Rewrite the faulty locator or assertion directly in the spec file.
6. Re-run `npx playwright test [target-file] --reporter=json --reporter=list`.
7. Repeat up to **3 times**.

If still failing after 3 attempts, **tell the user explicitly in chat** with the full error output and what was tried. Do not hide failures behind a summary table of passes.

---

## Stage 5 — Verification & Summary

Present a structured markdown table:

| Test Name | Layer | Status | Duration | Notes |
|-----------|-------|--------|----------|-------|
| ...       | unit / integration / storybook / e2e | ✅ Pass / ❌ Fail | Xms | ... |

Then provide the exact command(s) to reproduce locally:

```bash
npm run test:unit -- [target-file]
npm run test:integration -- [target-file]
npm run test:storybook -- [target-file]
npx playwright test [target-file] --reporter=json --reporter=list
```
````
