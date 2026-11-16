import { describe, expect, it } from "vitest";
import { cryptoDepositRobux, robuxToUsd, usdToRobux } from "./money";

describe("money", () => {
  it("1 Robux is 1 cent", () => {
    expect(usdToRobux(0.01)).toBe(1);
    expect(usdToRobux(1)).toBe(100);
    expect(robuxToUsd(250)).toBe(2.5);
  });
  it("crypto deposit of $5 gives 500 Robux", () => expect(cryptoDepositRobux(5)).toBe(500));
  it("crypto deposit below $1 gives nothing", () => expect(cryptoDepositRobux(0.5)).toBe(0));
});
