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
    description: `Open water to the horizon. Take the helm of a small sailboat — steer with WASD or the arrow keys — and make for the port at Foosha, on Dawn Island, where the red roofs wait beyond the dock. Bring the boat alongside and go ashore. The swell rolls, gulls wheel overhead, and the far sea melts into the sky.`,
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
}
