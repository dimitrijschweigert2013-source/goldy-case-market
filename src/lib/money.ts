/** 1 Robux is worth exactly 1 euro cent, the same as StarPets prices. */
export const ROBUX_PER_EUR = 100;

export function eurToRobux(eur: number): number {
  return Math.round(eur * ROBUX_PER_EUR);
}

export function robuxToEur(robux: number): number {
  return robux / ROBUX_PER_EUR;
}

/** Smallest crypto deposit in euros. */
export const MIN_DEPOSIT_EUR = 1;

/** Coins we take. `gecko` is the CoinGecko id used for live euro prices. */
export const COINS = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", gecko: "bitcoin" },
  { id: "ltc", name: "Litecoin", symbol: "LTC", gecko: "litecoin" },
] as const;
export type CoinId = (typeof COINS)[number]["id"];

/** Robux credited for a crypto deposit of `eur` euros; 0 below the minimum. */
export function cryptoDepositRobux(eur: number): number {
  if (!Number.isFinite(eur) || eur < MIN_DEPOSIT_EUR) return 0;
  return eurToRobux(eur);
}

/** How many coins to send for `eur` euros at a live price of `eurPerCoin`, rounded up to 8 decimals. */
export function coinsToSend(eur: number, eurPerCoin: number): number {
  if (!Number.isFinite(eur) || !(eurPerCoin > 0) || eur <= 0) return 0;
  return Math.ceil((eur / eurPerCoin) * 1e8) / 1e8;
}
