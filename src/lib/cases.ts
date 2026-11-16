import { SKINS, type Skin } from "@/lib/skins";

export type CaseDef = {
  id: string;
  name: string;
  tier: Skin["tier"];
  image: string;
  price: number;
  /** Drop pool with chances that sum to 1, most expensive first. */
  drops: { skin: Skin; chance: number }[];
};

const images = import.meta.glob<string>("../assets/cases/*.webp", { eager: true, import: "default" });
const caseImg = (id: string) => images[`../assets/cases/${id}.webp`] ?? "";

/** The house keeps this share: price = expected value / RETURN_RATE. */
export const RETURN_RATE = 0.9;

export function buildDrops(pool: Skin[]) {
  const weights = pool.map((s) => 1 / Math.pow(s.value, 1.3));
  const total = weights.reduce((a, b) => a + b, 0);
  return pool
    .map((skin, i) => ({ skin, chance: (weights[i] ?? 0) / total }))
    .sort((a, b) => b.skin.value - a.skin.value);
}

export function casePrice(drops: { skin: Skin; chance: number }[]) {
  const ev = drops.reduce((sum, d) => sum + d.skin.value * d.chance, 0);
  return Math.ceil(ev / RETURN_RATE / 5) * 5;
}

/** Picks a drop for a roll in [0, 1). */
export function rollDrop(drops: { skin: Skin; chance: number }[], roll: number): Skin {
  let acc = 0;
  for (const d of drops) {
    acc += d.chance;
    if (roll < acc) return d.skin;
  }
  return drops[drops.length - 1]!.skin;
}

const def = (id: string, name: string, tier: Skin["tier"], filter: (s: Skin) => boolean): CaseDef => {
  const drops = buildDrops(SKINS.filter(filter));
  return { id, name, tier, image: caseImg(id), drops, price: casePrice(drops) };
};

/** Case pools are picked by rarity rank, so they stay stable when market prices move. */
const WINTER = /ice|snow|xmas|ginger|pepper|ever|sweater|winter|bauble|candy|sugar|lugercane|icicle|turkey/;
const HALLOWEEN = /hallow|pump|bat|vampire|candle|spider|harvester|ghost|blood|corrupt|night|bone|death|logchopper|elderwood/;

/** All paid cases, cheapest first. */
export const CASES: CaseDef[] = [
  // Penny Case: everything up to Galaxy.
  def("penny-case", "Penny Case", "common", (s) => s.rank <= 80),
  def("bronze-case", "Bronze Case", "uncommon", (s) => s.rank >= 20 && s.rank <= 150),
  def("starter-case", "Starter Case", "rare", (s) => s.rank <= 400),
  def("winter-case", "Winter Case", "uncommon", (s) => WINTER.test(s.id) && s.rank <= 3000),
  def("halloween-case", "Halloween Case", "vintage", (s) => HALLOWEEN.test(s.id) && s.rank >= 100),
  def("vintage-case", "Vintage Case", "vintage", (s) => s.rank >= 200 && s.rank <= 1200),
  def("gun-case", "Gun Case", "rare", (s) => s.kind === "Waffe" && s.rank >= 150),
  def("knife-case", "Knife Case", "godly", (s) => s.kind === "Messer" && s.rank >= 400 && s.rank <= 3000),
  def("godly-case", "Godly Case", "godly", (s) => s.tier === "godly"),
  def("chroma-case", "Chroma Case", "chroma", (s) => s.tier === "chroma" || (s.tier === "godly" && s.rank >= 600)),
  def("unique-case", "Unique Case", "unique", (s) => s.rank >= 1500),
  def("ancient-case", "Ancient Case", "ancient", (s) => s.rank >= 3000),
].sort((a, b) => a.price - b.price);
