import { useEffect, useState, useSyncExternalStore } from 'react'
import { registry } from './registry'
import { Footer } from './Footer'
import { InfoPanel } from './InfoPanel'
import { islandInfo } from './islandInfo'
import { clearVoyage, getVoyage, subscribeVoyage } from './voyage/store'
import { parseWorld, type WorldData, WorldEditor, WorldRenderer } from '@runek/core'

const START_WORLD = '/dawn-island.world.json'
// How long the screen stays black between worlds (matches the .voyage-fade CSS transition).
const FADE_MS = 450

export function App() {
  const [worldFile, setWorldFile] = useState(START_WORLD)
  const [world, setWorld] = useState<WorldData | null>(null)
  const [editing, setEditing] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [fading, setFading] = useState(false)
  const info = islandInfo[worldFile]

  // A Portal inside the world (a separate React root, past the Canvas) asks to travel via the
  // voyage store; the app shell hears it here and swaps the mounted world JSON behind a fade.
  const pending = useSyncExternalStore(subscribeVoyage, getVoyage)

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

  if (!world) return null

  return (
    <>
      {/* Remount per world: a clean Canvas + Physics for each island, no stale bodies/camera. */}
      {editing ? (
        <WorldEditor key={worldFile} data={world} registry={registry} onChange={setWorld} lights={false} />
      ) : (
        <WorldRenderer key={worldFile} data={world} registry={registry} lights={false} />
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

      {!editing && !showInfo && (
        <p className="hint">
          {worldFile === '/east-blue.world.json' ? (
            <>
              <b>WASD</b> / arrows to steer · sail through the <b>gate</b> to land
            </>
          ) : (
            <>
              <b>WASD</b> / arrows move · <b>Shift</b> run · <b>Space</b> jump · <b>drag</b> to look
            </>
          )}
        </p>
      )}

      <Footer />

      <div className={`voyage-fade${fading ? ' on' : ''}`} aria-hidden="true" />
    </>
  )
}
