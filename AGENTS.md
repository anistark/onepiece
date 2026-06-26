# AGENTS.md

Guidelines for AI agents (Claude Code, pi, opencode, Kilo Code, Cursor, and others)
working in this repository. Read this fully before making changes.

## What this is

**One Piece** is a walkable and **sailable** procedural world inspired by the One Piece
anime, built entirely from [Runek](https://github.com/nullorder/runek) components
("shadcn for 3D worlds"). The sea and every island generate themselves from props and a
`seed`: no models, no textures, no CDN. The world grows one island at a time, and any
generic primitive an island needs is contributed back upstream to Runek.

> **This is a fan homage.** Not affiliated with, endorsed by, or sponsored by Eiichiro
> Oda, Shueisha, or Toei Animation. Ship no copyrighted assets. Keep the homage in the
> composition (the world files), never in code that leaves this repo.

Each island is **data**: a `public/*.world.json` file (component nodes plus world-level
identity `meta`, `palette`, `fog`, `time`, `ground`, `avatar`). The app shell just loads a
world file and renders it via `<WorldRenderer>` (walk) or `<WorldEditor>` (edit). It
consumes Runek the same way [Helicon](https://github.com/nullorder/helicon) does.

## Read the plan first

If a `plan/` directory is present, it holds the maintainer's internal, versioned roadmap
and current priorities. It is **git-ignored** (local only) and may differ per contributor.
When present, **read it before starting and follow it on priority** (`plan/roadmap.md` is
the source of truth for what version we are on and what is next). If it is absent, fall
back to this file and ask.

## The two boundaries (never cross these)

1. **The procedural moat.** Geometry comes from props plus a `seed`. No `.glb`, no
   textures, no HDRs, no runtime fetches, no CDN. Anything that needs a binary asset or a
   server is wrong. (Islands, ocean, ships, windmills, lighthouses, palms, cliffs are all
   buildable procedurally, that is the whole point.)
2. **Runek stays IP-neutral; this app owns the One Piece-ness.** Runek is a public MIT
   library, so **only generic, reusable primitives go upstream**, named generically
   (`Sailboat`, not a character or ship name; `Windmill`, not a village name). The One
   Piece identity lives entirely here, as **composition**: the island world files, their
   palettes, their arrangement. Never push IP-specific names or shapes into Runek.

## Repository layout

```
index.html, vite.config.ts       Vite + React app shell
src/
  main.tsx, App.tsx, index.css    the app: load a world JSON, Walk/Edit toggle
  registry.ts                     name -> component map for data-driven rendering
  runek/                          copy-first Runek component source (one file each)
public/*.world.json               the islands, the main thing this repo grows
runek.config.json                 Runek CLI config (registry URL, install dir)
plan/                             internal versioned roadmap (git-ignored), read if present
```

## Runek source (`src/runek/`) is vendored, do not hand-edit it

`src/runek/` holds component source pulled from the Runek registry by the `@runek/cli` CLI
and owned by this repo, shadcn-style. The runtime is **not** vendored: components import
`@runek/core` from npm (a normal dependency). Rules:

- **`just vendor` and `just vendor-local` overwrite everything in `src/runek/`** with
  `--overwrite`. Any local edit there will be clobbered, so do not patch components in
  place.
- **To change a component, change it upstream** in a local `../runek` checkout, then
  re-vendor with `just vendor-local`. Prefer upstreaming fixes to `nullorder/runek`.
- **New components belong upstream too.** When an island needs a primitive Runek lacks,
  build it generic in Runek (see the next section), then vendor it in. After the catalog
  changes, update `src/registry.ts` and the `components` list in the `justfile` to match.
- Bump `@runek/core` like any other dependency (`pnpm update @runek/core`) to pick up
  runtime, editor, and palette improvements.

## Growing the world (islands)

Each island is one `public/*.world.json`: a `nodes` list of `{ type, props }` plus
`palette`, `fog`, `time`, `ground`, `avatar`, and `meta`. Use the in-app **edit** mode
(click-select, gizmos, add/duplicate/delete, undo) and **Export JSON** to round-trip
changes back into the file. Keep worlds deterministic: placement and `seed`s live in the
data; the app code stays free of randomness.

## Contributing a component back to Runek (the growth loop)

When an island needs a primitive Runek does not have yet, build it generic upstream:

1. Write `../runek/packages/components/src/<Name>.tsx` per Runek's `CONTRACT.md` (extends
   `WorldComponentProps`; colors default from `useWorld().palette`; geometry in `useMemo`
   keyed on geometry-affecting props plus `seed`; collider sized to gameplay surface, not
   visual detail; no assets).
2. Export it in `index.ts` and `registry.ts`, and add an index entry to
   `registry/registry.json` (deps are auto-derived, do not hand-write them).
3. From `../runek`: `just registry`, `just gen-docs`, then `just check` (must be green).
4. Back here: add the name to the `justfile` `components` list, `just vendor-local`, import
   it in `src/registry.ts`, and place it in the island world JSON.

Name it generically. The IP-specific shaping stays in this repo's world files.

## Commands

This repo uses [`just`](https://just.systems) as the task runner.

```sh
just              # list all recipes
just install      # install dependencies (pnpm)
just dev          # Vite dev server
just build        # typecheck + production build
just preview      # preview the production build
just typecheck    # tsc --noEmit
just check        # the verification gate (typecheck + build)
just vendor       # re-pull Runek component source from the live registry
just vendor-local # re-pull from a local ../runek checkout (or a given path)
just clean        # remove build output + node_modules
```

Node 24 (pinned via `.nvmrc`), pnpm. **Before handing off a change, run `just check`**, it
must pass. The 3D walk-through itself is a manual visual check (`just dev`).

## Core principles (inherited from Runek, never compromise these)

1. **Procedural-first** geometry from props plus `seed`; no `.glb`, no textures, no CDN.
2. **A world is data**, every component is a pure, deterministic function of its props.
3. **Seeded determinism**, same seed gives the same result, everywhere.
4. **Parametric LOD**, detail scales with props and distance.
5. **Local-first**, no backend; a world deploys as a static site.

## Code conventions

- **TypeScript everywhere.** 1 unit = 1 meter, Y is up, rotations in radians.
- Match the vendored code's style (2-space indent, single quotes). Comment the *why*, not
  the *what*; avoid over-commenting.
- `src/registry.ts` and `src/App.tsx` are owned here; everything under `src/runek/` is not.

## Working agreements

- **Never run `git add` or `git commit` unless explicitly asked.** Leave staging and
  commits to the user.
- Read `plan/` if present and follow it on priority; plan substantial work before writing it.
- Keep the fan-homage framing intact; never ship copyrighted assets, and never push
  IP-specific names or shapes upstream to Runek.
