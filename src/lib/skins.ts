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
  value: number;
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

/** Skin values are shown in Robux (R$), estimated from StarPets market prices. */
const ROBUX_PER_POINT = 10;

type Row = [id: string, name: string, tier: Tier, kind: Skin["kind"], value: number];

const ROWS: Row[] = [
  ["default-gun", "Default Gun", "common", "Waffe", 1],
  ["default-knife", "Default Knife", "common", "Messer", 1],
  ["neon", "Neon", "common", "Messer", 2],
  ["camo", "Camo Gun", "uncommon", "Waffe", 3],
  ["sweater", "Sweater", "uncommon", "Messer", 3],
  ["icicles", "Icicles", "rare", "Messer", 6],
  ["rainbow", "Rainbow", "rare", "Messer", 7],
  ["rainbow-gun", "Rainbow Gun", "rare", "Waffe", 7],
  ["galaxy", "Galaxy", "rare", "Messer", 8],
  ["splitter", "Splitter", "vintage", "Messer", 11],
  ["blood", "Blood", "vintage", "Messer", 12],
  ["ghost", "Ghost", "vintage", "Messer", 12],
  ["golden", "Golden", "vintage", "Waffe", 14],
  ["gingermint", "Gingermint", "godly", "Waffe", 15],
  ["pixel", "Pixel", "godly", "Messer", 15],
  ["peppermint", "Peppermint", "godly", "Messer", 16],
  ["snowflake", "Snowflake", "godly", "Messer", 16],
  ["heartblade", "Heartblade", "godly", "Messer", 17],
  ["bauble", "Bauble", "godly", "Waffe", 18],
  ["blossom", "Blossom", "godly", "Waffe", 18],
  ["handsaw", "Handsaw", "godly", "Messer", 18],
  ["lugercane", "Lugercane", "godly", "Waffe", 19],
  ["sunset", "Sunset", "godly", "Messer", 19],
  ["ginger-luger", "Ginger Luger", "godly", "Waffe", 20],
  ["nightblade", "Nightblade", "godly", "Messer", 20],
  ["green-luger", "Green Luger", "godly", "Waffe", 21],
  ["red-luger", "Red Luger", "godly", "Waffe", 21],
  ["flames", "Flames", "godly", "Messer", 22],
  ["makeshift", "Makeshift", "godly", "Waffe", 22],
  ["ice-shard", "Ice Shard", "godly", "Messer", 23],
  ["plasmabeam", "Plasmabeam", "godly", "Waffe", 24],
  ["eternal", "Eternal", "godly", "Messer", 25],
  ["amerilaser", "Amerilaser", "godly", "Waffe", 26],
  ["candy", "Candy", "godly", "Messer", 26],
  ["sugar", "Sugar", "godly", "Waffe", 27],
  ["winters-edge", "Winter's Edge", "godly", "Messer", 27],
  ["bioblade", "Bioblade", "godly", "Messer", 28],
  ["hallows-blade", "Hallow's Blade", "godly", "Messer", 29],
  ["clockwork", "Clockwork", "godly", "Messer", 30],
  ["elderwood-revolver", "Elderwood Revolver", "godly", "Waffe", 30],
  ["virtual", "Virtual", "godly", "Messer", 31],
  ["swirly-blade", "Swirly Blade", "godly", "Messer", 32],
  ["swirly-gun", "Swirly Gun", "godly", "Waffe", 33],
  ["blaster", "Blaster", "godly", "Waffe", 34],
  ["battleaxe", "Battleaxe", "godly", "Messer", 35],
  ["battleaxe-ii", "Battleaxe II", "godly", "Messer", 36],
  ["iceflake", "Iceflake", "godly", "Messer", 36],
  ["ice-dragon", "Ice Dragon", "godly", "Messer", 37],
  ["xmas", "Xmas", "godly", "Messer", 38],
  ["spider", "Spider", "godly", "Messer", 40],
  ["iceblaster", "Iceblaster", "godly", "Waffe", 41],
  ["hallowgun", "Hallowgun", "godly", "Waffe", 42],
  ["hallows-edge", "Hallow's Edge", "godly", "Messer", 44],
  ["pumpking", "Pumpking", "godly", "Messer", 45],
  ["waves", "Waves", "godly", "Messer", 46],
  ["ocean", "Ocean", "godly", "Waffe", 48],
  ["nebula", "Nebula", "godly", "Messer", 50],
  ["saw", "Saw", "godly", "Messer", 52],
  ["gemstone", "Gemstone", "godly", "Messer", 55],
  ["fang", "Fang", "godly", "Messer", 58],
  ["luger", "Luger", "godly", "Waffe", 60],
  ["deathshard", "Deathshard", "godly", "Messer", 65],
  ["boneblade", "Boneblade", "godly", "Messer", 68],
  ["laser", "Laser", "godly", "Waffe", 70],
  ["gingerblade", "Gingerblade", "godly", "Messer", 75],
  ["shark", "Shark", "godly", "Waffe", 80],
  ["slasher", "Slasher", "godly", "Messer", 85],
  ["seer", "Seer", "godly", "Messer", 90],
  ["tides", "Tides", "godly", "Messer", 95],
  ["heat", "Heat", "godly", "Messer", 100],
  ["lightbringer", "Lightbringer", "godly", "Waffe", 110],
  ["darkbringer", "Darkbringer", "godly", "Waffe", 115],
  ["vampires-edge", "Vampire's Edge", "godly", "Messer", 130],
  ["candleflame", "Candleflame", "godly", "Messer", 140],
  ["bat", "Bat", "godly", "Messer", 150],
  ["chroma-luger", "Chroma Luger", "chroma", "Waffe", 180],
  ["turkey", "Turkey", "godly", "Messer", 190],
  ["sakura", "Sakura", "godly", "Messer", 200],
  ["chroma-laser", "Chroma Laser", "chroma", "Waffe", 220],
  ["chroma-shark", "Chroma Shark", "chroma", "Waffe", 240],
  ["evergreen", "Evergreen", "godly", "Messer", 250],
  ["chroma-fang", "Chroma Fang", "chroma", "Messer", 260],
  ["chroma-slasher", "Chroma Slasher", "chroma", "Messer", 280],
  ["chroma-saw", "Chroma Saw", "chroma", "Messer", 300],
  ["evergun", "Evergun", "godly", "Waffe", 300],
  ["chroma-seer", "Chroma Seer", "chroma", "Messer", 320],
  ["chroma-tides", "Chroma Tides", "chroma", "Messer", 340],
  ["chroma-heat", "Chroma Heat", "chroma", "Messer", 360],
  ["chroma-boneblade", "Chroma Boneblade", "chroma", "Messer", 400],
  ["constellation", "Constellation", "godly", "Waffe", 400],
  ["chroma-gemstone", "Chroma Gemstone", "chroma", "Messer", 420],
  ["chroma-deathshard", "Chroma Deathshard", "chroma", "Messer", 450],
  ["chroma-gingerblade", "Chroma Gingerblade", "chroma", "Messer", 480],
  ["chroma-lightbringer", "Chroma Lightbringer", "chroma", "Waffe", 500],
  ["chroma-darkbringer", "Chroma Darkbringer", "chroma", "Waffe", 520],
  ["chroma-candleflame", "Chroma Candleflame", "chroma", "Messer", 600],
  ["swirly-axe", "Swirly Axe", "ancient", "Messer", 650],
  ["logchopper", "Logchopper", "ancient", "Messer", 700],
  ["travelers-gun", "Traveler's Gun", "godly", "Waffe", 700],
  ["hallowscythe", "Hallowscythe", "ancient", "Messer", 750],
  ["corrupt", "Corrupt", "unique", "Messer", 900],
  ["icewing", "Icewing", "ancient", "Messer", 1000],
  ["icepiercer", "Icepiercer", "ancient", "Messer", 1050],
  ["elderwood-scythe", "Elderwood Scythe", "ancient", "Messer", 1100],
  ["travelers-axe", "Traveler's Axe", "ancient", "Messer", 1300],
  ["batwing", "Batwing", "ancient", "Messer", 1400],
  ["icebreaker", "Icebreaker", "ancient", "Messer", 1600],
  ["niks-scythe", "Nik's Scythe", "ancient", "Messer", 2000],
  ["harvester", "Harvester", "ancient", "Messer", 3000],
];

export const SKINS: Skin[] = ROWS.map(([id, name, tier, kind, value]) => ({
  id,
  name,
  tier,
  kind,
  value: value * ROBUX_PER_POINT,
  image: img(id),
})).sort((a, b) => a.value - b.value);

export const SKIN_BY_ID: Record<string, Skin> = Object.fromEntries(SKINS.map((s) => [s.id, s]));

export const STARTER_SKINS = ["default-knife", "camo", "blood", "galaxy", "pixel", "luger"];

/** Skins handed out by the free button: only the cheap tiers. */
export const FREE_POOL = SKINS.filter((s) => s.value <= 120).map((s) => s.id);
