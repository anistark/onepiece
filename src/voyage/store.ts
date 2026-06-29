// The voyage store: a module-level singleton that bubbles "travel to this world"
// requests from inside the R3F Canvas out to the app shell.
//
// `WorldRenderer` owns its own `<Canvas>`, which React renders with a separate
// reconciler — so React context does not reach `App.tsx` from an in-world component.
// A plain module singleton is shared across both React roots, so an in-world Portal
// sensor can call `requestVoyage()` and `App.tsx` (subscribed via `useSyncExternalStore`)
// hears it. The store holds only the pending destination; the app owns the transition.

type Listener = () => void

let pending: string | null = null
const listeners = new Set<Listener>()

function emit() {
  for (const fn of listeners) fn()
}

/**
 * Request travel to a world file (e.g. `/east-blue.world.json`). Ignored while a
 * voyage is already pending, so a sensor firing every frame — or two overlapping
 * portals — can never queue more than one swap. The app clears it once it commits.
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

/** The pending destination world file, or `null`. Stable identity for React. */
export function getVoyage(): string | null {
  return pending
}

/** Subscribe to changes; returns an unsubscribe fn. Shaped for `useSyncExternalStore`. */
export function subscribeVoyage(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
