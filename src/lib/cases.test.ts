import { describe, expect, it } from "vitest";
import { CASES, PRICE_MARKUP, RETURN_RATE, casePrice, rollDrop } from "./cases";

describe("cases", () => {
  it("has 12 paid cases, cheapest first", () => {
    expect(CASES).toHaveLength(12);
    for (let i = 1; i < CASES.length; i++) expect(CASES[i]!.price).toBeGreaterThanOrEqual(CASES[i - 1]!.price);
  });
  it("there is no free case", () => {
    expect(CASES.every((c) => c.price > 0 && c.id !== "free-case")).toBe(true);
  });
  it("every case lists its most expensive drop first", () => {
    for (const c of CASES)
      for (let i = 1; i < c.drops.length; i++) expect(c.drops[i - 1]!.skin.value).toBeGreaterThanOrEqual(c.drops[i]!.skin.value);
  });
  it("chances sum to 1 in every case", () => {
    for (const c of CASES) expect(c.drops.reduce((a, d) => a + d.chance, 0)).toBeCloseTo(1);
  });
  it("price returns at most 90% on average", () => {
    for (const c of CASES) {
      const ev = c.drops.reduce((a, d) => a + d.skin.value * d.chance, 0);
      expect(ev / c.price).toBeLessThanOrEqual(RETURN_RATE);
    }
  });
  it("every case costs 20% more than its base price", () => {
    expect(PRICE_MARKUP).toBe(1.2);
    for (const c of CASES) {
      const ev = c.drops.reduce((a, d) => a + d.skin.value * d.chance, 0);
      expect(c.price).toBeGreaterThanOrEqual((ev / RETURN_RATE) * 1.2);
      expect(c.price).toBeLessThan((ev / RETURN_RATE) * 1.2 + 5);
    }
  });
  it("a pool worth 90 on average costs 120 instead of 100", () => {
    const skin = CASES[0]!.drops[0]!.skin;
    expect(casePrice([{ skin: { ...skin, value: 90 }, chance: 1 }])).toBe(120);
  });
  it("roll 0 gives the most expensive, roll near 1 the cheapest", () => {
    const c = CASES[0]!;
    expect(rollDrop(c.drops, 0).id).toBe(c.drops[0]!.skin.id);
    expect(rollDrop(c.drops, 0.999999).id).toBe(c.drops[c.drops.length - 1]!.skin.id);
  });
});
