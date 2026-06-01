---
description: Test pipeline — plan, write, run, and self-heal. Runs at `/finish-coding`, not during coding.
alwaysApply: true
paths: []
globs: "**/*"
---

# AI Multi-Step Testing Pipeline

**When this rule loads:** every chat (`alwaysApply: true`).

**When the pipeline runs:**

| When | What runs |
|------|-----------|
| **During coding** | Do **not** write or edit tests. Focus on implementation. Tests are deferred to `/finish-coding`. |
| **`/finish-coding`** | Full pipeline (Stages 0–5) for everything new or changed in this chat. |

Also runs when the user explicitly says "test", "run tests", or invokes `/test`.

Follow all stages in order. Do not skip stages. **Do not write or edit test code before Stage 1 is posted in chat and approved** (unless the user says "auto-run").

---

## Test layers — pick the right one

| Layer | What it tests | Where | Command |
|-------|---------------|-------|---------|
| **Unit** | Pure functions, validators, business rules | Co-located `*.test.ts` next to source | `npm run test:unit -- [target-file]` |
| **Integration** | API routes, server actions, DB with mocks | `tests/integration/*.test.ts` | `npm run test:integration -- [target-file]` |
| **E2E** | Full user flows in the browser | `tests/e2e/*.spec.ts` + `tests/pages/` | `npx playwright test [target-file] --reporter=json --reporter=list` |

**Coverage split:**
- Exhaustive success/failure edge cases for logic → **unit** tests
- HTTP status codes and payload validation → **integration** tests
- Component visual states (loading, error, disabled) → **Admin → Design System** tab or the real app flow; cover in **E2E** when user-facing
- One representative happy path + one failure path in the UI → **E2E** tests
- Do not duplicate every validator edge case in Playwright

**CI:** GitHub Actions runs `npm run test` and `npm run test:e2e` on every push/PR to `main` and `dev`.

---

## Stage 0 — Prerequisites (E2E only)

Required before E2E Stage 3 and Playwright MCP in Stage 4. **Not needed for unit or integration tests.**

1. Check whether the dev server is already up (e.g. `curl -sf http://localhost:3000`).
2. If it is **not** running, start it in the background: `npm run dev`.
3. Wait until `http://localhost:3000` responds before continuing.

`playwright.config.ts` also has `webServer` with `reuseExistingServer: true`, so `npx playwright test` will start or reuse the server — but Stage 4 MCP debugging requires the server to be up independently.

---

## Stage 1 — Tactical Plan (Planner Mode)

1. Read the **code just written or changed** for this feature, bug fix, or improvement.
2. Identify which test layer(s) apply (unit, integration, E2E — often more than one).
3. **Post the full test plan in chat** using the format below. The user must see every scenario and every state before any test file is written or edited.
4. **WAIT** for confirmation before proceeding — unless the user says "auto-run".

### Required chat format (Stage 1)

Post this in chat. Do not skip sections — use "None" or "N/A" if a section does not apply.

```markdown
## Test plan — [feature or change name]

### What changed
- [file or behaviour]: [one-line summary]

### Unit tests
| Scenario | States / inputs covered | Expected outcome |
|----------|-------------------------|------------------|
| ... | empty, valid, invalid, boundary | ... |

### Integration tests
| Scenario | States / inputs covered | Expected outcome |
|----------|-------------------------|------------------|
| ... | ... | ... |

### E2E tests
| Scenario | UI states visible | User action → expected on screen |
|----------|-------------------|----------------------------------|
| ... | loading, success, error, disabled | ... |

### Existing tests to update
| File | What changed in app code | How the test must change |
|------|--------------------------|--------------------------|
| ... | ... | ... |

### Not testing (and why)
- [layer or scenario]: [reason — e.g. pure CSS, user waived, covered elsewhere]
```

**Minimum per layer:** 3–5 explicit scenarios when that layer applies. Must include happy paths, failure/validation cases, network/API edge cases (integration), and UI state boundary conditions (E2E: loading, error, disabled, empty where relevant).

**Visibility rule:** Never write test code silently. If you skip Stage 1 in chat, you must not proceed to Stage 2.

---

## Stage 2 — Code Generation (Generator Mode)

**Prerequisite:** Stage 1 test plan posted in chat and approved (or user said "auto-run").

Implement exactly the scenarios from the approved plan. If you discover a gap while writing, stop and append to the Stage 1 plan in chat before adding tests.

### Where tests live

```
lib/
  utils.ts
  utils.test.ts              ← unit: co-located next to source

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
| Integration tests | `tests/integration/` | `feature-name.test.ts` |
| E2E specs | `tests/e2e/` | `feature-name.spec.ts` |
| Page objects (POM) | `tests/pages/` | `FeatureNamePage.ts` |

Create missing folders at repo root if they do not exist.

### Rules

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
| ...       | unit / integration / e2e | ✅ Pass / ❌ Fail | Xms | ... |

Then provide the exact command(s) to reproduce locally:

```bash
npm run test:unit -- [target-file]
npm run test:integration -- [target-file]
npx playwright test [target-file] --reporter=json --reporter=list
```
