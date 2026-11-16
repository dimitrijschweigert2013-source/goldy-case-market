import { describe, expect, it } from "vitest";
import { COINS, coinsToSend, cryptoDepositRobux, eurToRobux, robuxToEur } from "./money";

describe("money", () => {
  it("1 Robux is 1 euro cent", () => {
    expect(eurToRobux(0.01)).toBe(1);
    expect(eurToRobux(1)).toBe(100);
    expect(robuxToEur(250)).toBe(2.5);
  });
  it("crypto deposit of 5 € gives 500 Robux", () => expect(cryptoDepositRobux(5)).toBe(500));
  it("crypto deposit below 1 € gives nothing", () => expect(cryptoDepositRobux(0.5)).toBe(0));
  it("only Bitcoin and Litecoin are offered", () => expect(COINS.map((c) => c.symbol)).toEqual(["BTC", "LTC"]));
  it("10 € at 50,000 € per BTC means sending 0.0002 BTC", () => expect(coinsToSend(10, 50000)).toBe(0.0002));
  it("coin amount rounds up so the deposit is never short", () => expect(coinsToSend(10, 30000)).toBe(0.00033334));
  it("no live price means no amount", () => expect(coinsToSend(10, 0)).toBe(0));
});
