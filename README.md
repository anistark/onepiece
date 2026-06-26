# One Piece

A walkable, sailable procedural world inspired by the **One Piece** anime, built entirely from [Runek](https://runek.nullorder.org/) components. The sea and every island generate themselves from code, and the
world grows one island at a time.

> A **fan homage**. Not affiliated with, endorsed by, or sponsored by Eiichiro Oda,
> Shueisha, or Toei Animation. All trademarks belong to their respective owners.
> The code here is original procedural geometry; it ships no copyrighted assets.

## Walk it

```sh
just install
just dev      # → http://localhost:5173
```

**WASD** / arrows move · **Shift** run · **Space** jump · **drag** to look.
The **✎ Edit** toggle switches to an orbit-camera editor: click a component to
select it, move/rotate with gizmos, add/duplicate/delete nodes, undo with ⌘Z,
and export the world back to JSON.

## Each island is a file

Every island lives in `public/*.world.json` — a list of `{ type, props }` nodes
plus world-level identity (`meta`, `source`), `palette`, `fog`, and a pinned
`time` of day. Components are pure, deterministic functions of their props
(`seed` included), so the same file renders the same place on every machine.

The roadmap (East Blue, one island at a time): a starter shakedown isle →
Foosha Village → and onward across the sea.

## Runek source

This app consumes Runek the way any app does: the runtime is the published
[`@runek/core`](https://www.npmjs.com/package/@runek/core) npm dependency, and
component source is **copied** under [`src/runek/`](./src/runek) via the
[`@runek/cli`](https://www.npmjs.com/package/@runek/cli) CLI and owned by this
repo (shadcn-style). To refresh the components:

```sh
just vendor                  # pulls from the live registry (runek.nullorder.org/r)
just vendor-local            # pulls from a local ../runek checkout (unreleased work)
just vendor-local /path/to/runek
```

The copied components import `@runek/core` from npm, so nothing is rewritten on
the way in (see [`runek.config.json`](./runek.config.json)). Generic primitives
this world needs (ocean, windmill, dock, sailboat, lighthouse, …) are contributed
back upstream to Runek; the One Piece identity stays here, in the world files.

## License

[MIT](./LICENSE) © nullorder
