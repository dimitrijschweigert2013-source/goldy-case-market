/** One thing the player did. Skins are stored by id, money in Robux. */
export type HistoryEntry =
  | { id: string; at: number; kind: "case"; caseId: string; caseName: string; price: number; skinId: string }
  | { id: string; at: number; kind: "upgrade"; stake: string[]; targetId: string; chance: number; won: boolean }
  | { id: string; at: number; kind: "sell"; skinIds: string[]; amount: number }
  | { id: string; at: number; kind: "deposit"; coin: string; amount: number }
  | { id: string; at: number; kind: "promo"; code: string; amount: number };

export type NewHistoryEntry = HistoryEntry extends infer E ? (E extends HistoryEntry ? Omit<E, "id" | "at"> : never) : never;

/** Only the newest entries are kept. */
export const HISTORY_LIMIT = 200;

/** Adds an entry on top (newest first) and drops the oldest past the limit. */
export function pushEntry(list: HistoryEntry[], entry: HistoryEntry, limit = HISTORY_LIMIT): HistoryEntry[] {
  return [entry, ...list].slice(0, limit);
}

/** Robux change caused by an entry (negative = spent). Skin values come from `valueOf`. */
export function robuxDelta(e: HistoryEntry, valueOf: (skinId: string) => number): number {
  switch (e.kind) {
    case "case":
      return -e.price;
    case "upgrade": {
      const stake = e.stake.reduce((s, id) => s + valueOf(id), 0);
      return e.won ? valueOf(e.targetId) - stake : -stake;
    }
    default:
      return e.amount;
  }
}
