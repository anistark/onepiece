# One Piece — a procedural sea of islands built from Runek. Run `just` (or
# `just --list`) to see all recipes.

# Every renderable component pulled from the Runek registry. `@runek/core` is an
# npm dependency (package.json), not vendored — components import it directly.
components := "player terrain room house wall floor roof door window staircase table chair clock sign signpost lamp rug shelf bookshelf lake ocean shore sailboat fountain rocks sky clouds grass trees bush flowers hedge lightrig fence flag bridge dock arch pillar well windmill path bench bed crate barrel plant campfire birds"

# List available recipes
default:
    @just --list

# Install dependencies
install:
    pnpm install

# Run the dev server
dev:
    pnpm dev

# Type-check then build for production
build:
    pnpm build

# Preview the production build
preview:
    pnpm preview

# Type-check only
typecheck:
    pnpm typecheck

# Full verification gate: typecheck + build
check: build

# Re-pull Runek component source into src/runek from the live registry,
# overwriting local copies. Components import `@runek/core` (the npm package),
# so imports are kept verbatim and core is never vendored.
vendor:
    npx @runek/cli@latest add --overwrite --no-install {{components}}

# Same, but from a local runek checkout — for co-developing unreleased components.
vendor-local RUNEK="../runek":
    node {{RUNEK}}/packages/cli/src/index.ts add --overwrite --no-install \
        --registry {{RUNEK}}/registry {{components}}

# Remove build output and installed dependencies
clean:
    rm -rf node_modules dist .vite
