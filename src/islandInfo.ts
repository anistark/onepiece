// Curated, per-island copy for the About panel. Keyed by the world file the app loads.
// Material first (about the place), then its One Piece significance, then fun facts.
// Each new island adds an entry here.

export interface Contributor {
  /** GitHub username (also used to build the profile link). */
  name: string
  url: string
}

export interface IslandInfo {
  title: string
  subtitle: string
  description: string
  significance: string[]
  funFacts: string[]
  contributors: Contributor[]
  license: string
}

export const islandInfo: Record<string, IslandInfo> = {
  '/dawn-island.world.json': {
    title: 'Dawn Island',
    subtitle: 'Foosha Village · East Blue',
    description: `Foosha Village is a sleepy seaside town on the northern coast of Dawn Island. Red-roofed houses gather around the windmill on the green, and a path runs down to a small harbour where fishing boats lie moored. Behind the village the land climbs through orchard and forest to Mount Colubo, the island's high inland peak. It is a quiet, out-of-the-way place where everyone knows everyone, and the sea is never far.`,
    significance: [
      `Foosha Village is Monkey D. Luffy's hometown, where he grows up and where his voyage to become King of the Pirates begins.`,
      `It is where Luffy meets "Red-Haired" Shanks, accidentally eats the Gum-Gum Devil Fruit, and is entrusted with the straw hat he vows to return one day.`,
    ],
    funFacts: [
      `The straw hat (and this site's mark) was Shanks's, lent to Luffy with a promise to give it back once he becomes a great pirate.`,
      `Mount Colubo, rising behind the village, is where Luffy was raised among mountain bandits alongside Ace and Sabo.`,
      `Dawn Island sits in the East Blue, the gentlest of the four seas, yet it is the cradle of three of the era's most famous brothers.`,
      `"Dawn" is no accident: the island opens the whole adventure, and the very first chapter is titled "Romance Dawn".`,
    ],
    contributors: [{ name: 'anistark', url: 'https://github.com/anistark' }],
    license: 'World content CC BY 4.0 · code MIT',
  },
  '/east-blue.world.json': {
    title: 'East Blue',
    subtitle: 'The open sea · take the helm',
    description: `Open water to the horizon. Take the helm of a small sailboat — steer with WASD or the arrow keys — and pick a heading: south to the port at Foosha, on Dawn Island, where the red roofs wait beyond the dock; or north to the anchorage below the pale, grinning crag of Skull Island. Bring the boat alongside a port and go ashore. The swell rolls, gulls wheel overhead, and the far sea melts into the sky.`,
    significance: [
      `The East Blue is the sea where it all begins: Monkey D. Luffy sets out from here, and one by one gathers the first of his crew — Zoro, Nami, Usopp, and Sanji — before the Grand Line.`,
      `Called "the weakest sea," it is the calmest and least dangerous of the four blues, yet it produced an outsized share of the era's great pirates.`,
    ],
    funFacts: [
      `Despite its gentle reputation, the East Blue is the birthplace of much of the Straw Hat crew and several legendary figures.`,
      `Each of the four seas — East, West, North, South Blue — is separated from the others by the Red Line and the Grand Line that cross at its center.`,
      `Sailing here is "discrete": each island is its own world file, and the ports stitch them together — board a boat at one, go ashore at the next.`,
    ],
    contributors: [{ name: 'anistark', url: 'https://github.com/anistark' }],
    license: 'World content CC BY 4.0 · code MIT',
  },
  '/skull-island.world.json': {
    title: 'Skull Island',
    subtitle: 'Pirate haunt · East Blue',
    description: `A torch-lit pirate port under a low dusk sun, north across the East Blue from Dawn Island. From the anchorage a rough main street runs up between bunkhouses to The Rusty Anchor tavern and a smuggler's stall, and a camp smoulders out on the moor's edge under a black flag. Past a ruined arch the trail climbs to the island's namesake: a bone-white crag weathered into a giant skull, hollow-eyed, teeth bared at the sea.`,
    significance: [
      `An original stop for this voyage, not a canon location — but the skull is the oldest sign in piracy: every crew in One Piece sails under one, from the Straw Hats' jolly roger on down.`,
      `It tips its hat to Hachinosu, the skull-shaped "Pirate Island" of the New World — a lawless pirate haven whose rock face grins just like this one.`,
    ],
    funFacts: [
      `The skull is pure procedure — cranium, brow, sunken sockets, nasal cavity, cheekbones, and a broken grin, all low-poly geometry weathered by a seed. No models, no textures; squint and it stares back.`,
      `The port burns torches, not lamps: whale oil is for Marine towns. Every flame on the island flickers on its own rhythm.`,
      `Both boats at the dock ride with their sails down and the tavern keeps its fires lit — pirates are always in port, just never the ones you're looking for.`,
    ],
    contributors: [{ name: 'anistark', url: 'https://github.com/anistark' }],
    license: 'World content CC BY 4.0 · code MIT',
  },
}
