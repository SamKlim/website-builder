# Onboarding Success Animation — Plan

**Date:** 2026-05-28
**Status:** built
**Target file:** `app/onboarding/page.tsx` + new `components/onboarding/OnboardingSuccess.tsx`

---

## Goal

When a user finishes onboarding (clicks the final Continue), replace the form with a full-screen takeover that plays a short two-phase animation — loading hand while the server creates the account, then confetti + "Account created!" — before auto-redirecting to `/topics`.

Today the onboarding submit shows a button-level "Setting up..." state and then hard-redirects with no confirmation. There's no moment to acknowledge that the account was actually created.

## Scope

- Plays for **both flows**: student (after step 1) and tutor (after step 2 — the students list).
- Replaces the existing `window.location.href = '/topics'` call inside `handleStep1Continue` (student) and `handleStep2Continue` (tutor).
- No animation on returning sign-ins; this is onboarding-only.

## Visual design — locked decisions

### Layout (Layout B from drafts exploration)

- Full-screen takeover, `bg-main-background` (`#f5f4f2`), the same grey as the onboarding illustration pane.
- Centred content. No buttons during the success phases (only on the error state).
- Same background across both phases — only the centre content cross-fades.

### Phase 1 — Loading

- Centred loading hand Lottie (`lib/lottie/loading-hand.json`).
- The Lottie has the word "LOADING" baked in as animated letters; that's the only on-screen text. No additional caption.

### Phase 2 — Success

- Same grey background.
- Confetti Lottie (`lib/lottie/confetti.json`) plays as a layer behind the text (`z-0`, full-bleed).
- On top:
  - "Account created!" — `type.heading1`, `text-main-primary-black`
  - Thin horizontal divider — `w-12 h-px bg-main-border` with 12px spacers above and below
  - "Now let's do some maths." — `type.body`, `text-main-dark-grey-text`

### Lottie recolouring

Loading hand (4 swaps applied via `recolourLottie`):

| Original | New | Notes |
|---|---|---|
| Plum outline `#6b0074` | Primary text `#2b2823` | |
| Bright blue accent `#0d76f1` | Primary orange `#e46c37` | |
| Light blue body `#4a90e2` | `#cb541d` | Hardcoded; not a design system token |
| Text grey `#444444` | Primary text `#2b2823` | |
| Shadow `#444444` | Kept | Hardcoded |

Confetti (4 swaps applied):

| Original | New | Notes |
|---|---|---|
| Deep purple `#7d3bc0` | Illust purple `#cfc6fa` | |
| Mint `#45e8a3` | Illust lighter sage `#7baa91` | Hardcoded; not in `colours.ts` but used in real_all_illustration.svg |
| Gold `#ffb400` | Illust yellow `#fdae20` | |
| Bright red `#ff4848` | Primary orange `#e46c37` | |
| 6 blues/cyans/navy/white | Kept | All hardcoded |

### Error state

- Same grey background, no confetti, no loading hand.
- Lucide `AlertCircle` icon in primary orange (`text-main-secondary-orange`).
- "Something went wrong" — `type.heading1`, primary text.
- Error message as subtitle — `type.body`, dark grey text.
- **Retry** button — `<Button variant="destructive" size="sm">` (matches the onboarding form's Continue). Re-runs `completeOnboarding` and returns to the loading phase.

This is the only state with a clickable button anywhere in the takeover.

## Animation flow & timing

| Step | Duration | Trigger |
|---|---|---|
| User clicks Continue (last step) | — | Click |
| Takeover mounts, loading hand fades in | 200ms fade-in | Mount |
| Loading hand visible, server call in flight | min 2.0s, no max cap | Both happen in parallel |
| Loading hand fades out | 300ms cross-fade | Server returns success AND min 2.0s elapsed |
| Success content (confetti + text) fades in | 300ms cross-fade | Concurrent with loading fade-out |
| Confetti + text visible | 2.0s | — |
| Hard redirect to `/topics` | — | `window.location.href = '/topics'` |
| **Total minimum** | **~4.3s** | |

Notes:
- "Min 2.0s, no max cap" means: if the server returns in 200ms, we still hold the loading hand until the full 2s has elapsed. If the server takes 5s, we hold the loading hand for 5s.
- If the server times out (existing 10s timeout in `handleStep1Continue`/`handleStep2Continue`) or returns an error, we transition to the error state instead of the success phase.

## Component structure

### New: `components/onboarding/OnboardingSuccess.tsx`

A self-contained takeover component, client-only. Owns its own state machine and the timing logic. Mounted by `app/onboarding/page.tsx` when a submit is in flight.

```ts
type OnboardingSuccessProps = {
  readonly status: 'loading' | 'success' | 'error'
  readonly errorMessage: string | null
  readonly onRetry: () => void
}
```

State logic lives in the parent (`OnboardingPage`), since the parent owns the form state and the submit handler. The takeover component just renders what it's told.

### Internal sub-components (in the same file)

- `LoadingPhase` — renders the loading hand Lottie with its locked-in recolour applied (memoised).
- `SuccessPhase` — renders the confetti layer + text stack with the divider.
- `ErrorPhase` — renders icon + headline + message + Retry button.

### Reuse

- `lib/lottie/recolour.ts` — already in place from the drafts work.
- `lib/lottie/loading-hand.json` and `lib/lottie/confetti.json` — already in place.
- The recolour maps will be lifted out of the drafts file into `OnboardingSuccess.tsx` (or a small adjacent constants file) so they're not duplicated.

## Wiring into `app/onboarding/page.tsx`

Replace the existing finish-state pattern with a state machine:

```ts
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'
const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
const [submitError, setSubmitError] = useState<string | null>(null)
```

In `handleStep1Continue` (student) and `handleStep2Continue` (tutor):

1. Set `submitStatus = 'loading'`. The takeover mounts.
2. Kick off the server call AND a 2-second timer in parallel (`Promise.all([serverCall, sleep(2000)])`).
3. On success → `submitStatus = 'success'`. The takeover cross-fades to the success phase.
4. After another 2s timer → hard redirect to `/topics`.
5. On error or timeout → `submitStatus = 'error'`, `submitError = err.message`. The takeover renders the error phase.
6. Retry button re-triggers the same handler from step 1.

The takeover is a sibling of the form in JSX, conditionally rendered when `submitStatus !== 'idle'`. It uses `fixed inset-0 z-50` so it covers the whole viewport regardless of whether the user is mid-scroll.

The existing inline `submitError` rendering on the form pane can be removed (the error state lives in the takeover now).

## Files added / changed

### New
- `components/onboarding/OnboardingSuccess.tsx` — the takeover component.

### Already added during drafts work
- `lib/lottie/loading-hand.json`
- `lib/lottie/confetti.json`
- `lib/lottie/recolour.ts`
- `package.json` — `lottie-react` dependency.

### Modified
- `app/onboarding/page.tsx` — switch to status state machine, mount `OnboardingSuccess`, remove inline `submitError` paragraph from the form.

### Drafts cleanup (after sign-off)
- `app/drafts/onboarding-loading/page.tsx` and `OnboardingLoadingPreview.tsx` — leave for now as a working drafts page. Can be deleted in a follow-up commit when the feature is shipped, or kept indefinitely as a colour reference.

## Out of scope

- **Reduced-motion fallback.** Not handling `prefers-reduced-motion` in this PR — confirmed with user.
- **Returning sign-ins.** A user signing in again (not new account) skips onboarding entirely; no animation involved.
- **Adding `#cb541d` or `#7baa91` to `colours.ts` as design system tokens.** Both are hardcoded in the recolour maps for now; promote later if reused.
- **Drafts page deletion.** Will leave the drafts page in place; can clean up in a follow-up.

## Key decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Layout | Layout B (full-screen grey, with divider) | Same colour as onboarding illustration pane; divider gives the two text lines rhythm |
| Loading caption | Use the Lottie's baked-in "LOADING" text, no separate caption | Avoids visual conflict with the animated letters |
| Loading hand body fill | Hardcoded `#cb541d` | One-off; not worth a design system token yet |
| Loading minimum duration | 2.0s | Long enough for the 1.33s loop to feel intentional |
| No max cap on loading | If server is slow, hold the hand | Better than faking progress |
| Success phase duration | 2.0s | Enough to read both lines without feeling like a wall |
| Auto-redirect | Hard navigation, no buttons | Matches existing onboarding flow; no user action needed |
| Error state | Inside the takeover (no fall-back to form) | The form is unmounted by the takeover; can't fall back |
| Error state has a Retry button | Yes | Only clickable element anywhere in the takeover |
| Reduced-motion handling | None | Confirmed with user; can revisit |

## Data model changes

None.
