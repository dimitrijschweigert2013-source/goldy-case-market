import { describe, expect, it } from "vitest";
import { redeemPromo } from "./promo";

describe("promo codes", () => {
  it("HAPPYNEWYEAR gives 5 Robux, case-insensitive", () => {
    expect(redeemPromo(" happynewyear ", [])).toEqual({ ok: true, code: "HAPPYNEWYEAR", amount: 5 });
  });
  it("a code works only once", () => {
    expect(redeemPromo("HAPPYNEWYEAR", ["HAPPYNEWYEAR"])).toEqual({ ok: false, reason: "used" });
  });
  it("the old placeholder codes are gone", () => {
    expect(redeemPromo("WELCOME", [])).toEqual({ ok: false, reason: "unknown" });
  });
  it("an unknown code gives nothing", () => {
    expect(redeemPromo("NOPE", [])).toEqual({ ok: false, reason: "unknown" });
  });
});
