import { describe, expect, it } from "vitest";
import { sellPrice } from "./sell";
import { SKINS } from "./skins";

describe("sell", () => {
  it("pays the full value of one skin", () => {
    const s = SKINS[0]!;
    expect(sellPrice([s.id])).toBe(s.value);
  });
  it("adds up several skins", () => {
    const [a, b] = [SKINS[0]!, SKINS[1]!];
    expect(sellPrice([a.id, b.id, a.id])).toBe(a.value * 2 + b.value);
  });
  it("unknown skins are worth nothing", () => expect(sellPrice(["nope"])).toBe(0));
});
