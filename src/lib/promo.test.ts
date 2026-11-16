import { describe, expect, it } from "vitest";
import { redeemPromo } from "./promo";

describe("promo codes", () => {
  it("a known code gives its Robux, case-insensitive", () => {
    expect(redeemPromo(" welcome ", [])).toEqual({ ok: true, code: "WELCOME", amount: 100 });
  });
  it("a code works only once", () => {
    expect(redeemPromo("WELCOME", ["WELCOME"])).toEqual({ ok: false, reason: "used" });
  });
  it("an unknown code gives nothing", () => {
    expect(redeemPromo("NOPE", [])).toEqual({ ok: false, reason: "unknown" });
  });
});
