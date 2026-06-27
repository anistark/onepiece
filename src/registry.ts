// Name → component map for data-driven rendering (the *.world.json files).
// The components themselves are copy-first Runek source under src/runek; they
// import the runtime from the `@runek/core` npm package. See `just vendor` to
// refresh them from the registry.
import type { ComponentRegistry } from '@runek/core'
import { Arch } from './runek/Arch'
import { Barrel } from './runek/Barrel'
import { Bed } from './runek/Bed'
import { Bench } from './runek/Bench'
import { Birds } from './runek/Birds'
import { Bookshelf } from './runek/Bookshelf'
import { Bridge } from './runek/Bridge'
import { Bush } from './runek/Bush'
import { Campfire } from './runek/Campfire'
import { Chair } from './runek/Chair'
import { Clock } from './runek/Clock'
import { Clouds } from './runek/Clouds'
import { Crate } from './runek/Crate'
import { Dock } from './runek/Dock'
import { Door } from './runek/Door'
import { Fence } from './runek/Fence'
import { Flag } from './runek/Flag'
import { Floor } from './runek/Floor'
import { Flowers } from './runek/Flowers'
import { Fountain } from './runek/Fountain'
import { Grass } from './runek/Grass'
import { Hedge } from './runek/Hedge'
import { House } from './runek/House'
import { Lake } from './runek/Lake'
import { Lamp } from './runek/Lamp'
import { LightRig } from './runek/LightRig'
import { Ocean } from './runek/Ocean'
import { Path } from './runek/Path'
import { Pillar } from './runek/Pillar'
import { Plant } from './runek/Plant'
import { Player } from './runek/Player'
import { Rocks } from './runek/Rocks'
import { Roof } from './runek/Roof'
import { Room } from './runek/Room'
import { Rug } from './runek/Rug'
import { Sailboat } from './runek/Sailboat'
import { Shelf } from './runek/Shelf'
import { Shore } from './runek/Shore'
import { Sign } from './runek/Sign'
import { Sky } from './runek/Sky'
import { Staircase } from './runek/Staircase'
import { Table } from './runek/Table'
import { Terrain } from './runek/Terrain'
import { Trees } from './runek/Trees'
import { Wall } from './runek/Wall'
import { Well } from './runek/Well'
import { Windmill } from './runek/Windmill'
import { Window } from './runek/Window'

export const registry: ComponentRegistry = {
  Arch,
  Barrel,
  Bed,
  Bench,
  Birds,
  Bookshelf,
  Bridge,
  Bush,
  Campfire,
  Chair,
  Clock,
  Clouds,
  Crate,
  Dock,
  Door,
  Fence,
  Flag,
  Floor,
  Flowers,
  Fountain,
  Grass,
  Hedge,
  House,
  Lake,
  Lamp,
  LightRig,
  Ocean,
  Path,
  Pillar,
  Plant,
  Player,
  Rocks,
  Roof,
  Room,
  Rug,
  Sailboat,
  Shelf,
  Shore,
  Sign,
  Sky,
  Staircase,
  Table,
  Terrain,
  Trees,
  Wall,
  Well,
  Windmill,
  Window,
}
