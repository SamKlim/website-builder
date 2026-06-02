/**
 * Motion tokens — durations, distances, and timeouts for UI transitions.
 * Import these instead of hardcoding values in components.
 */

const MOTION_ENTER_MS = 400
const MOTION_EXIT_MS = 200

export const motionDuration = {
  enterMs: MOTION_ENTER_MS,
  exitMs: MOTION_EXIT_MS,
  enterS: MOTION_ENTER_MS / 1000,
  exitS: MOTION_EXIT_MS / 1000,
} as const

/** Horizontal slide distance for shared-axis wizard / step transitions (px). Mobile and desktop. */
export const MOTION_SHARED_AXIS_OFFSET_PX = 32

/** Max wait for an illustration before revealing a two-pane layout anyway. */
export const MOTION_ILLUSTRATION_READY_TIMEOUT_MS = 2_000

/** Viewport min-width where two-pane layouts show the illustration panel (desktop). */
export const MOTION_TWO_PANE_MIN_PX = 971

/** How step-to-step transitions are oriented (e.g. onboarding wizard). */
export type StepTransitionDirection = 'initial' | 'forward' | 'back'
