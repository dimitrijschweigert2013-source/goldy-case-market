export type Tier =
  | "common"
  | "uncommon"
  | "rare"
  | "vintage"
  | "godly"
  | "chroma"
  | "unique"
  | "ancient";

export type Skin = {
  id: string;
  name: string;
  tier: Tier;
  kind: "Messer" | "Waffe";
  /** Price in Robux (1 Robux = 1 US cent), from StarPets market prices. */
  value: number;
  /** Rarity rank used to sort skins into case pools (higher = rarer). */
  rank: number;
  image: string;
};

export const TIER_LABEL: Record<Tier, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  vintage: "Vintage",
  godly: "Godly",
  chroma: "Chroma",
  unique: "Unique",
  ancient: "Ancient",
};

export const TIER_ORDER: Tier[] = [
  "common",
  "uncommon",
  "rare",
  "vintage",
  "godly",
  "chroma",
  "unique",
  "ancient",
];

// Real item pictures (from the MM2 wiki), hosted as CDN assets.
const images = import.meta.glob<{ url: string }>("../assets/skins/*.webp.asset.json", {
  eager: true,
  import: "default",
});
const img = (id: string) => images[`../assets/skins/${id}.webp.asset.json`]?.url ?? "";

/**
 * Each row: rarity rank (for case pools) and price in Robux. Prices come from
 * starpets.gg/mm2 (USD × 100, since 1 Robux = 1 cent); skins not listed there are estimates.
 */
type Row = [id: string, name: string, tier: Tier, kind: Skin["kind"], rank: number, robux: number];

const ROWS: Row[] = [
  ["default-gun", "Default Gun", "common", "Waffe", 1, 3],
  ["default-knife", "Default Knife", "common", "Messer", 1, 3],
  ["neon", "Neon", "common", "Messer", 2, 3],
  ["camo", "Camo Gun", "uncommon", "Waffe", 3, 5],
  ["sweater", "Sweater", "uncommon", "Messer", 3, 5],
  ["icicles", "Icicles", "rare", "Messer", 6, 7],
  ["rainbow", "Rainbow", "rare", "Messer", 7, 7],
  ["rainbow-gun", "Rainbow Gun", "rare", "Waffe", 7, 7],
  ["galaxy", "Galaxy", "rare", "Messer", 8, 8],
  ["splitter", "Splitter", "vintage", "Messer", 11, 11],
  ["blood", "Blood", "vintage", "Messer", 12, 12],
  ["ghost", "Ghost", "vintage", "Messer", 12, 12],
  ["golden", "Golden", "vintage", "Waffe", 14, 12],
  ["gingermint", "Gingermint", "godly", "Waffe", 15, 48],
  ["pixel", "Pixel", "godly", "Messer", 15, 48],
  ["peppermint", "Peppermint", "godly", "Messer", 16, 49],
  ["snowflake", "Snowflake", "godly", "Messer", 16, 49],
  ["heartblade", "Heartblade", "godly", "Messer", 17, 225],
  ["bauble", "Bauble", "godly", "Waffe", 18, 52],
  ["blossom", "Blossom", "godly", "Waffe", 18, 52],
  ["handsaw", "Handsaw", "godly", "Messer", 18, 52],
  ["lugercane", "Lugercane", "godly", "Waffe", 19, 62],
  ["sunset", "Sunset", "godly", "Messer", 19, 53],
  ["ginger-luger", "Ginger Luger", "godly", "Waffe", 20, 54],
  ["nightblade", "Nightblade", "godly", "Messer", 20, 54],
  ["green-luger", "Green Luger", "godly", "Waffe", 21, 55],
  ["red-luger", "Red Luger", "godly", "Waffe", 21, 121],
  ["flames", "Flames", "godly", "Messer", 22, 37],
  ["makeshift", "Makeshift", "godly", "Waffe", 22, 56],
  ["ice-shard", "Ice Shard", "godly", "Messer", 23, 58],
  ["plasmabeam", "Plasmabeam", "godly", "Waffe", 24, 59],
  ["eternal", "Eternal", "godly", "Messer", 25, 60],
  ["amerilaser", "Amerilaser", "godly", "Waffe", 26, 80],
  ["candy", "Candy", "godly", "Messer", 26, 309],
  ["sugar", "Sugar", "godly", "Waffe", 27, 135],
  ["winters-edge", "Winter's Edge", "godly", "Messer", 27, 62],
  ["bioblade", "Bioblade", "godly", "Messer", 28, 50],
  ["hallows-blade", "Hallow's Blade", "godly", "Messer", 29, 65],
  ["clockwork", "Clockwork", "godly", "Messer", 30, 66],
  ["elderwood-revolver", "Elderwood Revolver", "godly", "Waffe", 30, 126],
  ["virtual", "Virtual", "godly", "Messer", 31, 67],
  ["swirly-blade", "Swirly Blade", "godly", "Messer", 32, 68],
  ["swirly-gun", "Swirly Gun", "godly", "Waffe", 33, 70],
  ["blaster", "Blaster", "godly", "Waffe", 34, 71],
  ["battleaxe", "Battleaxe", "godly", "Messer", 35, 78],
  ["battleaxe-ii", "Battleaxe II", "godly", "Messer", 36, 73],
  ["iceflake", "Iceflake", "godly", "Messer", 36, 73],
  ["ice-dragon", "Ice Dragon", "godly", "Messer", 37, 74],
  ["xmas", "Xmas", "godly", "Messer", 38, 76],
  ["spider", "Spider", "godly", "Messer", 40, 78],
  ["iceblaster", "Iceblaster", "godly", "Waffe", 41, 115],
  ["hallowgun", "Hallowgun", "godly", "Waffe", 42, 80],
  ["hallows-edge", "Hallow's Edge", "godly", "Messer", 44, 83],
  ["pumpking", "Pumpking", "godly", "Messer", 45, 84],
  ["waves", "Waves", "godly", "Messer", 46, 85],
  ["ocean", "Ocean", "godly", "Waffe", 48, 88],
  ["nebula", "Nebula", "godly", "Messer", 50, 65],
  ["saw", "Saw", "godly", "Messer", 52, 92],
  ["gemstone", "Gemstone", "godly", "Messer", 55, 96],
  ["fang", "Fang", "godly", "Messer", 58, 100],
  ["luger", "Luger", "godly", "Waffe", 60, 81],
  ["deathshard", "Deathshard", "godly", "Messer", 65, 60],
  ["boneblade", "Boneblade", "godly", "Messer", 68, 112],
  ["laser", "Laser", "godly", "Waffe", 70, 114],
  ["gingerblade", "Gingerblade", "godly", "Messer", 75, 120],
  ["shark", "Shark", "godly", "Waffe", 80, 126],
  ["slasher", "Slasher", "godly", "Messer", 85, 132],
  ["seer", "Seer", "godly", "Messer", 90, 138],
  ["tides", "Tides", "godly", "Messer", 95, 144],
  ["heat", "Heat", "godly", "Messer", 100, 44],
  ["lightbringer", "Lightbringer", "godly", "Waffe", 110, 110],
  ["darkbringer", "Darkbringer", "godly", "Waffe", 115, 115],
  ["vampires-edge", "Vampire's Edge", "godly", "Messer", 130, 72],
  ["candleflame", "Candleflame", "godly", "Messer", 140, 240],
  ["bat", "Bat", "godly", "Messer", 150, 408],
  ["chroma-luger", "Chroma Luger", "chroma", "Waffe", 180, 259],
  ["turkey", "Turkey", "godly", "Messer", 190, 290],
  ["sakura", "Sakura", "godly", "Messer", 200, 230],
  ["chroma-laser", "Chroma Laser", "chroma", "Waffe", 220, 288],
  ["chroma-shark", "Chroma Shark", "chroma", "Waffe", 240, 317],
  ["evergreen", "Evergreen", "godly", "Messer", 250, 310],
  ["chroma-fang", "Chroma Fang", "chroma", "Messer", 260, 314],
  ["chroma-slasher", "Chroma Slasher", "chroma", "Messer", 280, 320],
  ["chroma-saw", "Chroma Saw", "chroma", "Messer", 300, 314],
  ["evergun", "Evergun", "godly", "Waffe", 300, 480],
  ["chroma-seer", "Chroma Seer", "chroma", "Messer", 320, 320],
  ["chroma-tides", "Chroma Tides", "chroma", "Messer", 340, 320],
  ["chroma-heat", "Chroma Heat", "chroma", "Messer", 360, 250],
  ["chroma-boneblade", "Chroma Boneblade", "chroma", "Messer", 400, 317],
  ["constellation", "Constellation", "godly", "Waffe", 400, 560],
  ["chroma-gemstone", "Chroma Gemstone", "chroma", "Messer", 420, 314],
  ["chroma-deathshard", "Chroma Deathshard", "chroma", "Messer", 450, 250],
  ["chroma-gingerblade", "Chroma Gingerblade", "chroma", "Messer", 480, 317],
  ["chroma-lightbringer", "Chroma Lightbringer", "chroma", "Waffe", 500, 352],
  ["chroma-darkbringer", "Chroma Darkbringer", "chroma", "Waffe", 520, 206],
  ["chroma-candleflame", "Chroma Candleflame", "chroma", "Messer", 600, 768],
  ["swirly-axe", "Swirly Axe", "ancient", "Messer", 650, 160],
  ["logchopper", "Logchopper", "ancient", "Messer", 700, 71],
  ["travelers-gun", "Traveler's Gun", "godly", "Waffe", 700, 790],
  ["hallowscythe", "Hallowscythe", "ancient", "Messer", 750, 87],
  ["corrupt", "Corrupt", "unique", "Messer", 900, 640],
  ["icewing", "Icewing", "ancient", "Messer", 1000, 65],
  ["icepiercer", "Icepiercer", "ancient", "Messer", 1050, 552],
  ["elderwood-scythe", "Elderwood Scythe", "ancient", "Messer", 1100, 147],
  ["travelers-axe", "Traveler's Axe", "ancient", "Messer", 1300, 420],
  ["batwing", "Batwing", "ancient", "Messer", 1400, 187],
  ["icebreaker", "Icebreaker", "ancient", "Messer", 1600, 192],
  ["niks-scythe", "Nik's Scythe", "ancient", "Messer", 2000, 690],
  ["harvester", "Harvester", "ancient", "Messer", 3000, 712],
];

export const SKINS: Skin[] = ROWS.map(([id, name, tier, kind, rank, robux]) => ({
  id,
  name,
  tier,
  kind,
  value: robux,
  rank: rank * 10,
  image: img(id),
})).sort((a, b) => a.value - b.value);

export const SKIN_BY_ID: Record<string, Skin> = Object.fromEntries(SKINS.map((s) => [s.id, s]));

export const STARTER_SKINS = ["default-knife", "camo", "blood", "galaxy", "pixel", "luger"];
