import { useEffect, useState } from 'react'
import { registry } from './registry'
import { parseWorld, type WorldData, WorldEditor, WorldRenderer } from '@runek/core'

// Phase 0 loads one island. The East Blue voyage selector (sail between islands)
// arrives in Phase 2; this stays a single fetch until then.
const WORLD_FILE = '/dawn-island.world.json'

export function App() {
  const [world, setWorld] = useState<WorldData | null>(null)
  const [editing, setEditing] = useState(false)

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
      {/* Forward fonts + ground explicitly: @runek/core@0.10.0's WorldRenderer/WorldEditor
          drop data.fonts and data.ground (fixed upstream). Remove once core > 0.10.0 ships. */}
      {editing ? (
        <WorldEditor
          data={world}
          registry={registry}
          onChange={setWorld}
          lights={false}
          fonts={world.fonts}
          ground={world.ground}
        />
      ) : (
        <WorldRenderer
          data={world}
          registry={registry}
          lights={false}
          fonts={world.fonts}
          ground={world.ground}
        />
      )}

      <button type="button" className="mode-toggle" onClick={() => setEditing((on) => !on)}>
        {editing ? '▶ Walk' : '✎ Edit'}
      </button>

      {!editing && (
        <p className="hint">
          <b>WASD</b> / arrows move · <b>Shift</b> run · <b>Space</b> jump · <b>drag</b> to look
        </p>
      )}
    </>
  )
}
