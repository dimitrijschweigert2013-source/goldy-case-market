import { describe, expect, it } from "vitest";
import { isTargetAllowed, isWin, landingSpot, nextRotation, realChance, upgradeChance } from "./upgrade";

describe("upgradeChance", () => {
  it("gives 90% of the value ratio", () => {
    expect(upgradeChance(10, 100)).toBeCloseTo(0.09);
  });
  it("never goes above 80%", () => {
    expect(upgradeChance(99, 100)).toBe(0.8);
  });
  it("is zero when the target is not worth more than the stake", () => {
    expect(upgradeChance(100, 100)).toBe(0);
  });
  it("blocks targets below 1% chance", () => {
    expect(isTargetAllowed(1, 3000)).toBe(false);
    expect(isTargetAllowed(1, 50)).toBe(true);
  });
});

describe("shown vs real chance", () => {
  it("a shown 40% is really 30%", () => {
    expect(realChance(0.4)).toBeCloseTo(0.3);
  });
  it("a shown 80% is really 60%", () => {
    expect(realChance(0.8)).toBeCloseTo(0.6);
  });
});

describe("spin", () => {
  it("wins only when the roll is inside the chance", () => {
    expect(isWin(0.2, 0.25)).toBe(true);
    expect(isWin(0.3, 0.25)).toBe(false);
  });
  it("a win lands inside the green arc, a loss outside it", () => {
    for (const r of [0, 0.5, 0.999]) {
      expect(landingSpot(true, 0.4, r)).toBeLessThan(0.4);
      expect(landingSpot(false, 0.4, r)).toBeGreaterThan(0.4);
      expect(landingSpot(false, 0.4, r)).toBeLessThan(1);
    }
  });
  it("points the pointer at the roll's spot on the ring", () => {
    expect(nextRotation(0, 0.25) % 360).toBe(90);
    expect(nextRotation(500, 0.5) % 360).toBe(180);
  });
  it("always spins forward", () => {
    expect(nextRotation(800, 0.1)).toBeGreaterThan(800);
  });
});
