import { describe, expect, it } from "vitest";
import { HISTORY_LIMIT, pushEntry, robuxDelta, type HistoryEntry } from "./history";

const entry = (i: number): HistoryEntry => ({ id: `e${i}`, at: i, kind: "promo", code: "X", amount: 5 });

describe("history", () => {
  it("puts the newest entry first", () => {
    const list = pushEntry(pushEntry([], entry(1)), entry(2));
    expect(list.map((e) => e.id)).toEqual(["e2", "e1"]);
  });
  it("keeps only the newest 200 entries", () => {
    let list: HistoryEntry[] = [];
    for (let i = 0; i < 250; i++) list = pushEntry(list, entry(i));
    expect(HISTORY_LIMIT).toBe(200);
    expect(list).toHaveLength(200);
    expect(list[0]!.id).toBe("e249");
    expect(list[199]!.id).toBe("e50");
  });
  it("a case costs its price", () => {
    const e: HistoryEntry = { id: "a", at: 0, kind: "case", caseId: "c", caseName: "C", price: 60, skinId: "s" };
    expect(robuxDelta(e, () => 999)).toBe(-60);
  });
  it("a won upgrade gains target minus stake, a lost one loses the stake", () => {
    const values: Record<string, number> = { a: 10, b: 20, t: 100 };
    const base = { id: "u", at: 0, kind: "upgrade" as const, stake: ["a", "b"], targetId: "t", chance: 27 };
    expect(robuxDelta({ ...base, won: true }, (id) => values[id]!)).toBe(70);
    expect(robuxDelta({ ...base, won: false }, (id) => values[id]!)).toBe(-30);
  });
  it("sales, deposits and promo codes add their amount", () => {
    expect(robuxDelta({ id: "s", at: 0, kind: "sell", skinIds: ["a"], amount: 8 }, () => 0)).toBe(8);
    expect(robuxDelta({ id: "d", at: 0, kind: "deposit", coin: "BTC", amount: 500 }, () => 0)).toBe(500);
  });
});
