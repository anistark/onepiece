import type { IslandInfo } from './islandInfo'

export function InfoPanel({ info, onClose }: { info: IslandInfo; onClose: () => void }) {
  return (
    <aside className="info-panel">
      <button type="button" className="info-close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <h2>{info.title}</h2>
      <p className="info-sub">{info.subtitle}</p>
      <p>{info.description}</p>

      <h3>In One Piece</h3>
      <ul>
        {info.significance.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h3>Fun facts</h3>
      <ul>
        {info.funFacts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <h3>Contributors</h3>
      <p className="info-people">
        {info.contributors.map((c, i) => (
          <span key={c.name}>
            {i > 0 ? ', ' : ''}
            <a href={c.url} target="_blank" rel="noopener noreferrer">
              @{c.name}
            </a>
          </span>
        ))}
      </p>

      <h3>License</h3>
      <p>{info.license}</p>

      <p className="info-disclaimer">
        A non-commercial fan homage. Not affiliated with or endorsed by Eiichiro Oda, Shueisha,
        or Toei Animation; One Piece and its characters belong to their respective owners.
      </p>
    </aside>
  )
}
