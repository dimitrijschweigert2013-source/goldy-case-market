/** Promo codes and the Robux each one gives. Each code works once per player. */
export const PROMO_CODES: Record<string, number> = {
  WELCOME: 100,
  FOXY: 250,
  MYSTERY: 500,
};

export type PromoResult = { ok: true; code: string; amount: number } | { ok: false; reason: "unknown" | "used" };

export function redeemPromo(input: string, used: string[]): PromoResult {
  const code = input.trim().toUpperCase();
  const amount = PROMO_CODES[code];
  if (!amount) return { ok: false, reason: "unknown" };
  if (used.includes(code)) return { ok: false, reason: "used" };
  return { ok: true, code, amount };
}
