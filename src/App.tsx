import { useEffect, useState } from 'react'
import { registry } from './registry'
import { Footer } from './Footer'
import { InfoPanel } from './InfoPanel'
import { islandInfo } from './islandInfo'
import { parseWorld, type WorldData, WorldEditor, WorldRenderer } from '@runek/core'

// Phase 0 loads one island. The East Blue voyage selector (sail between islands)
// arrives in Phase 2; this stays a single fetch until then.
const WORLD_FILE = '/dawn-island.world.json'

export function App() {
  const [world, setWorld] = useState<WorldData | null>(null)
  const [editing, setEditing] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const info = islandInfo[WORLD_FILE]

  useEffect(() => {
    // no-store: the world file changes constantly while building; never serve a stale cache.
    fetch(WORLD_FILE, { cache: 'no-store' })
      .then((res) => res.text())
      .then((text) => setWorld(parseWorld(text)))
      .catch((error) => console.error('[onepiece] failed to load world:', error))
  }, [])

  if (!world) return null

  return (
    <>
      {editing ? (
        <WorldEditor data={world} registry={registry} onChange={setWorld} lights={false} />
      ) : (
        <WorldRenderer data={world} registry={registry} lights={false} />
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
          <b>WASD</b> / arrows move · <b>Shift</b> run · <b>Space</b> jump · <b>drag</b> to look
        </p>
      )}

      <Footer />
    </>
  )
}
