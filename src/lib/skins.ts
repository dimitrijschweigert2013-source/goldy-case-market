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
  /** Price in Robux (1 Robux = 1 euro cent), from StarPets market prices. */
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

// Real item pictures (from the MM2 wiki), bundled with the app so they work on any host (Lovable, Vercel, ...).
const images = import.meta.glob<string>("../assets/skins/*.webp", { eager: true, import: "default" });
const img = (id: string) => images[`../assets/skins/${id}.webp`] ?? "";

/**
 * Each row: rank (frozen price snapshot, picks case pools) and price in Robux.
 * Prices are starpets.gg/mm2 EUR prices 1:1 (1 Robux = 1 euro cent); skins StarPets doesn't sell are estimates.
 */
type Row = [id: string, name: string, tier: Tier, kind: Skin["kind"], rank: number, robux: number];

const ROWS: Row[] = [
  ["default-gun", "Default Gun", "common", "Waffe", 3, 3],
  ["default-knife", "Default Knife", "common", "Messer", 3, 3],
  ["neon", "Neon", "common", "Messer", 17, 17],
  ["camo", "Camo Gun", "uncommon", "Waffe", 5, 5],
  ["sweater", "Sweater", "uncommon", "Messer", 5, 5],
  ["icicles", "Icicles", "rare", "Messer", 8, 8],
  ["rainbow", "Rainbow", "rare", "Messer", 5, 5],
  ["rainbow-gun", "Rainbow Gun", "godly", "Waffe", 898, 898],
  ["galaxy", "Galaxy", "rare", "Messer", 6, 6],
  ["splitter", "Splitter", "vintage", "Messer", 18, 18],
  ["blood", "Blood", "vintage", "Messer", 29, 29],
  ["ghost", "Ghost", "vintage", "Messer", 21, 21],
  ["golden", "Golden", "vintage", "Waffe", 28, 28],
  ["gingermint", "Gingermint", "godly", "Waffe", 50, 50],
  ["pixel", "Pixel", "godly", "Messer", 70, 70],
  ["peppermint", "Peppermint", "godly", "Messer", 31, 31],
  ["snowflake", "Snowflake", "godly", "Messer", 27, 27],
  ["heartblade", "Heartblade", "godly", "Messer", 203, 203],
  ["bauble", "Bauble", "godly", "Waffe", 1670, 1670],
  ["blossom", "Blossom", "godly", "Waffe", 2298, 2298],
  ["handsaw", "Handsaw", "godly", "Messer", 31, 31],
  ["lugercane", "Lugercane", "godly", "Waffe", 59, 59],
  ["sunset", "Sunset", "godly", "Messer", 1439, 1439],
  ["ginger-luger", "Ginger Luger", "godly", "Waffe", 68, 68],
  ["nightblade", "Nightblade", "godly", "Messer", 95, 95],
  ["green-luger", "Green Luger", "godly", "Waffe", 59, 59],
  ["red-luger", "Red Luger", "godly", "Waffe", 109, 109],
  ["flames", "Flames", "godly", "Messer", 31, 31],
  ["makeshift", "Makeshift", "godly", "Waffe", 83, 83],
  ["ice-shard", "Ice Shard", "godly", "Messer", 34, 34],
  ["plasmabeam", "Plasmabeam", "godly", "Waffe", 65, 65],
  ["eternal", "Eternal", "godly", "Messer", 31, 31],
  ["amerilaser", "Amerilaser", "godly", "Waffe", 78, 78],
  ["candy", "Candy", "godly", "Messer", 293, 293],
  ["sugar", "Sugar", "godly", "Waffe", 126, 126],
  ["winters-edge", "Winter's Edge", "godly", "Messer", 27, 27],
  ["bioblade", "Bioblade", "godly", "Messer", 43, 43],
  ["hallows-blade", "Hallow's Blade", "godly", "Messer", 34, 34],
  ["clockwork", "Clockwork", "godly", "Messer", 36, 36],
  ["elderwood-revolver", "Elderwood Revolver", "godly", "Waffe", 130, 130],
  ["virtual", "Virtual", "godly", "Messer", 38, 38],
  ["swirly-blade", "Swirly Blade", "godly", "Messer", 40, 40],
  ["swirly-gun", "Swirly Gun", "godly", "Waffe", 70, 70],
  ["blaster", "Blaster", "godly", "Waffe", 61, 61],
  ["battleaxe", "Battleaxe", "godly", "Messer", 77, 77],
  ["battleaxe-ii", "Battleaxe II", "godly", "Messer", 56, 56],
  ["iceflake", "Iceflake", "godly", "Messer", 44, 44],
  ["ice-dragon", "Ice Dragon", "godly", "Messer", 31, 31],
  ["xmas", "Xmas", "godly", "Messer", 56, 56],
  ["spider", "Spider", "godly", "Messer", 31, 31],
  ["iceblaster", "Iceblaster", "godly", "Waffe", 107, 107],
  ["hallowgun", "Hallowgun", "godly", "Waffe", 56, 56],
  ["hallows-edge", "Hallow's Edge", "godly", "Messer", 26, 26],
  ["pumpking", "Pumpking", "godly", "Messer", 23, 23],
  ["waves", "Waves", "godly", "Messer", 486, 486],
  ["ocean", "Ocean", "godly", "Waffe", 533, 533],
  ["nebula", "Nebula", "godly", "Messer", 61, 61],
  ["saw", "Saw", "godly", "Messer", 23, 23],
  ["gemstone", "Gemstone", "godly", "Messer", 48, 48],
  ["fang", "Fang", "godly", "Messer", 35, 35],
  ["luger", "Luger", "godly", "Waffe", 77, 77],
  ["deathshard", "Deathshard", "godly", "Messer", 57, 57],
  ["boneblade", "Boneblade", "godly", "Messer", 32, 32],
  ["laser", "Laser", "godly", "Waffe", 83, 83],
  ["gingerblade", "Gingerblade", "godly", "Messer", 36, 36],
  ["shark", "Shark", "godly", "Waffe", 59, 59],
  ["slasher", "Slasher", "godly", "Messer", 34, 34],
  ["seer", "Seer", "godly", "Messer", 31, 31],
  ["tides", "Tides", "godly", "Messer", 33, 33],
  ["heat", "Heat", "godly", "Messer", 43, 43],
  ["lightbringer", "Lightbringer", "godly", "Waffe", 103, 103],
  ["darkbringer", "Darkbringer", "godly", "Waffe", 98, 98],
  ["vampires-edge", "Vampire's Edge", "godly", "Messer", 60, 60],
  ["candleflame", "Candleflame", "godly", "Messer", 86, 86],
  ["bat", "Bat", "godly", "Messer", 380, 380],
  ["chroma-luger", "Chroma Luger", "chroma", "Waffe", 172, 172],
  ["turkey", "Turkey", "godly", "Messer", 4284, 4284],
  ["sakura", "Sakura", "godly", "Messer", 2414, 2414],
  ["chroma-laser", "Chroma Laser", "chroma", "Waffe", 146, 146],
  ["chroma-shark", "Chroma Shark", "chroma", "Waffe", 102, 102],
  ["evergreen", "Evergreen", "godly", "Messer", 5866, 5866],
  ["chroma-fang", "Chroma Fang", "chroma", "Messer", 59, 59],
  ["chroma-slasher", "Chroma Slasher", "chroma", "Messer", 60, 60],
  ["chroma-saw", "Chroma Saw", "chroma", "Messer", 66, 66],
  ["evergun", "Evergun", "godly", "Waffe", 8084, 8084],
  ["chroma-seer", "Chroma Seer", "chroma", "Messer", 86, 86],
  ["chroma-tides", "Chroma Tides", "chroma", "Messer", 61, 61],
  ["chroma-heat", "Chroma Heat", "chroma", "Messer", 62, 62],
  ["chroma-boneblade", "Chroma Boneblade", "chroma", "Messer", 57, 57],
  ["constellation", "Constellation", "godly", "Waffe", 5560, 5560],
  ["chroma-gemstone", "Chroma Gemstone", "chroma", "Messer", 81, 81],
  ["chroma-deathshard", "Chroma Deathshard", "chroma", "Messer", 73, 73],
  ["chroma-gingerblade", "Chroma Gingerblade", "chroma", "Messer", 74, 74],
  ["chroma-lightbringer", "Chroma Lightbringer", "chroma", "Waffe", 192, 192],
  ["chroma-darkbringer", "Chroma Darkbringer", "chroma", "Waffe", 192, 192],
  ["chroma-candleflame", "Chroma Candleflame", "chroma", "Messer", 138, 138],
  ["swirly-axe", "Swirly Axe", "ancient", "Messer", 116, 116],
  ["logchopper", "Logchopper", "ancient", "Messer", 70, 70],
  ["travelers-gun", "Traveler's Gun", "godly", "Waffe", 9927, 9927],
  ["hallowscythe", "Hallowscythe", "ancient", "Messer", 74, 74],
  ["corrupt", "Corrupt", "unique", "Messer", 661, 661],
  ["icewing", "Icewing", "ancient", "Messer", 61, 61],
  ["icepiercer", "Icepiercer", "ancient", "Messer", 528, 528],
  ["elderwood-scythe", "Elderwood Scythe", "ancient", "Messer", 135, 135],
  ["travelers-axe", "Traveler's Axe", "ancient", "Messer", 14206, 14206],
  ["batwing", "Batwing", "ancient", "Messer", 171, 171],
  ["icebreaker", "Icebreaker", "ancient", "Messer", 179, 179],
  ["niks-scythe", "Nik's Scythe", "ancient", "Messer", 690, 690],
  ["harvester", "Harvester", "ancient", "Messer", 683, 683],
];

export const SKINS: Skin[] = ROWS.map(([id, name, tier, kind, rank, robux]) => ({
  id,
  name,
  tier,
  kind,
  value: robux,
  rank,
  image: img(id),
})).sort((a, b) => a.value - b.value);

export const SKIN_BY_ID: Record<string, Skin> = Object.fromEntries(SKINS.map((s) => [s.id, s]));

export const STARTER_SKINS = ["default-knife", "camo", "blood", "galaxy", "pixel", "luger"];
