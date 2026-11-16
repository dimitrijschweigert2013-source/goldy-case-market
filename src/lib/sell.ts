import { SKIN_BY_ID } from "@/lib/skins";

/** Selling pays out the skin's full Robux value. */
export const SELL_RATE = 1;

export function sellPrice(skinIds: string[]): number {
  return skinIds.reduce((sum, id) => sum + Math.floor((SKIN_BY_ID[id]?.value ?? 0) * SELL_RATE), 0);
}
