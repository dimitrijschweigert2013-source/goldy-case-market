import { describe, expect, it } from "vitest";
import { CASES, FREE_CASE, RETURN_RATE, rollDrop } from "./cases";

const byId = (id: string) => CASES.find((c) => c.id === id)!;

describe("cases", () => {
  it("has 12 paid cases, cheapest first", () => {
    expect(CASES).toHaveLength(12);
    for (let i = 1; i < CASES.length; i++) expect(CASES[i]!.price).toBeGreaterThanOrEqual(CASES[i - 1]!.price);
  });
  it("free case has the cheap pool, best drop worth 30", () => {
    expect(FREE_CASE.price).toBe(0);
    expect(Math.max(...FREE_CASE.drops.map((d) => d.skin.value))).toBe(30);
  });
  it("penny case goes up to Galaxy", () => {
    expect(byId("penny-case").drops[0]!.skin.id).toBe("galaxy");
  });
  it("chances sum to 1 in every case", () => {
    for (const c of [FREE_CASE, ...CASES]) expect(c.drops.reduce((a, d) => a + d.chance, 0)).toBeCloseTo(1);
  });
  it("price returns at most 90% on average", () => {
    for (const c of CASES) {
      const ev = c.drops.reduce((a, d) => a + d.skin.value * d.chance, 0);
      expect(ev / c.price).toBeLessThanOrEqual(RETURN_RATE);
    }
  });
  it("roll 0 gives the most expensive, roll near 1 the cheapest", () => {
    const c = CASES[0]!;
    expect(rollDrop(c.drops, 0).id).toBe(c.drops[0]!.skin.id);
    expect(rollDrop(c.drops, 0.999999).id).toBe(c.drops[c.drops.length - 1]!.skin.id);
  });
});
