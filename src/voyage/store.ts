// The voyage store: a module-level singleton that bridges the in-world scene and the app shell.
//
// `WorldRenderer` owns its own `<Canvas>`, which React renders with a separate reconciler — so
// React context does not reach `App.tsx` from an in-world component. A plain module singleton is
// shared across both React roots, so an in-world `TravelZone` can publish here and `App.tsx`
// (subscribed via `useSyncExternalStore`) hears it. It carries two things: the pending voyage
// (a world swap in flight) and the current contextual action prompt (board a boat / go ashore).

type Listener = () => void

const listeners = new Set<Listener>()
function emit() {
  for (const fn of listeners) fn()
}

/** Subscribe to any store change; returns an unsubscribe fn. Shaped for `useSyncExternalStore`. */
export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// --- voyage: a world swap in flight ----------------------------------------

let pending: string | null = null

/**
 * Request travel to a world file (e.g. `/east-blue.world.json`). Ignored while a voyage is
 * already pending, so a re-entrant trigger can never queue more than one swap.
 */
export function requestVoyage(to: string) {
  if (pending) return
  pending = to
  emit()
}

/** Clear the pending voyage once the app has consumed it. */
export function clearVoyage() {
  if (pending === null) return
  pending = null
  emit()
}

/** The pending destination world file, or `null`. */
export function getVoyage(): string | null {
  return pending
}

// --- prompt: the contextual action the player can take right now ------------

/** A boat to board ('board') or a port to step ashore at ('ashore'). */
export type PromptKind = 'board' | 'ashore'

export interface Prompt {
  /** Button caption, e.g. "Set sail" or "Go ashore". */
  label: string
  /** World file the action travels to. */
  to: string
  kind: PromptKind
}

let prompt: Prompt | null = null

/** A `TravelZone` the player/boat is inside publishes its action. Stable identity when unchanged. */
export function setPrompt(next: Prompt) {
  if (prompt && prompt.label === next.label && prompt.to === next.to && prompt.kind === next.kind) {
    return
  }
  prompt = next
  emit()
}

/**
 * Clear the prompt on leaving a zone. Pass the zone's `to` so a zone you've left can't clear a
 * prompt set by a different zone you're still inside; omit it to force-clear (e.g. on voyage).
 */
export function clearPrompt(to?: string) {
  if (prompt === null) return
  if (to !== undefined && prompt.to !== to) return
  prompt = null
  emit()
}

/** The current contextual action, or `null`. */
export function getPrompt(): Prompt | null {
  return prompt
}
