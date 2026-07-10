import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { registry } from './registry'
import { Footer } from './Footer'
import { InfoPanel } from './InfoPanel'
import { islandInfo } from './islandInfo'
import { clearPrompt, clearVoyage, getPrompt, getVoyage, requestVoyage, subscribe } from './voyage/store'
import { parseWorld, type WorldData, type WorldNode, WorldEditor, WorldRenderer } from '@runek/core'

const START_WORLD = '/dawn-island.world.json'
// Worlds where the player is at the helm (sail controls), not on foot.
const SEA_WORLDS = new Set(['/east-blue.world.json'])
// How long the screen stays black between worlds (matches the .voyage-fade CSS transition).
const FADE_MS = 450
// The ship's compass HUD (vendored Runek component), injected into every rendered world —
// never into the world data itself, so the editor and serialized JSON stay clean, and the
// dial vanishes in edit mode (the editor renders the un-injected data). North defaults to +Z,
// matching how the islands are authored (decisions #10).
const COMPASS: WorldNode = {
  type: 'Compass',
  id: '__compass',
  props: { corner: 'bottom-left', inset: [16, 48] },
}

export function App() {
  const [worldFile, setWorldFile] = useState(START_WORLD)
  const [world, setWorld] = useState<WorldData | null>(null)
  const [editing, setEditing] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [fading, setFading] = useState(false)
  const info = islandInfo[worldFile]
  const sailMode = SEA_WORLDS.has(worldFile)

  // An in-world `TravelZone` (a separate React root, past the Canvas) publishes the pending voyage
  // and the contextual action prompt through the voyage store; the app shell reads them here.
  const pending = useSyncExternalStore(subscribe, getVoyage)
  const prompt = useSyncExternalStore(subscribe, getPrompt)

  // On foot you act near a boat ('board'); at the helm you act at a port ('ashore').
  const actionable =
    prompt != null && (sailMode ? prompt.kind === 'ashore' : prompt.kind === 'board')
  const canAct = actionable && !editing && !showInfo && !fading

  useEffect(() => {
    if (!pending) return
    if (pending === worldFile) {
      clearVoyage()
      return
    }
    setFading(true)
    const timer = setTimeout(() => {
      setEditing(false)
      setShowInfo(false)
      clearPrompt() // drop any stale action from the world we're leaving
      setWorldFile(pending) // triggers the load effect below; fade clears once it lands
      clearVoyage()
    }, FADE_MS)
    return () => clearTimeout(timer)
  }, [pending, worldFile])

  useEffect(() => {
    let cancelled = false
    // no-store: the world files change constantly while building; never serve a stale cache.
    fetch(worldFile, { cache: 'no-store' })
      .then((res) => res.text())
      .then((text) => {
        if (cancelled) return
        setWorld(parseWorld(text))
        setFading(false) // new world is mounted — lift the fade
      })
      .catch((error) => console.error('[onepiece] failed to load world:', error))
    return () => {
      cancelled = true
    }
  }, [worldFile])

  // Press E to take the current action (board / go ashore), mirroring the on-screen button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && canAct && prompt) requestVoyage(prompt.to)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canAct, prompt])

  const renderWorld = useMemo<WorldData | null>(
    () => world && { ...world, nodes: [...world.nodes, COMPASS] },
    [world],
  )

  if (!world || !renderWorld) return null

  const act = () => {
    if (canAct && prompt) requestVoyage(prompt.to)
  }

  return (
    <>
      {/* Remount per world: a clean Canvas + Physics for each island, no stale bodies/camera. */}
      {editing ? (
        <WorldEditor key={worldFile} data={world} registry={registry} onChange={setWorld} lights={false} />
      ) : (
        <WorldRenderer key={worldFile} data={renderWorld} registry={registry} lights={false} />
      )}

      {info && !editing && !showInfo && (
        <button type="button" className="about-toggle" onClick={() => setShowInfo(true)}>
          ⓘ {info.title}
        </button>
      )}
      {info && showInfo && <InfoPanel info={info} onClose={() => setShowInfo(false)} />}

      <button type="button" className="mode-toggle" onClick={() => setEditing((on) => !on)}>
        {editing ? '▶ Walk' : '✎ Edit'}
      </button>

      {/* Contextual action: board a boat on foot; at the helm, go ashore (enabled only at a port). */}
      {!editing && !showInfo && !fading && !sailMode && prompt?.kind === 'board' && (
        <button type="button" className="action-prompt" onClick={act}>
          ⛵ {prompt.label} <kbd>E</kbd>
        </button>
      )}
      {!editing && !showInfo && !fading && sailMode && (
        <button type="button" className="action-prompt" onClick={act} disabled={!canAct}>
          ⚓ Go ashore <kbd>E</kbd>
        </button>
      )}

      {!editing && !showInfo && (
        <p className="hint">
          {sailMode ? (
            <>
              <b>WASD</b> to steer · sail to a port and <b>go ashore</b>
            </>
          ) : (
            <>
              <b>WASD</b> move · <b>←→</b> turn · <b>↑↓</b> look · <b>Shift</b> run · <b>Space</b> jump · board a boat
            </>
          )}
        </p>
      )}

      <Footer />

      <div className={`voyage-fade${fading ? ' on' : ''}`} aria-hidden="true" />
    </>
  )
}
