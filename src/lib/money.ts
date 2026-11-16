/** 1 Robux is worth exactly 1 US cent. */
export const ROBUX_PER_USD = 100;

export function usdToRobux(usd: number): number {
  return Math.round(usd * ROBUX_PER_USD);
}

export function robuxToUsd(robux: number): number {
  return robux / ROBUX_PER_USD;
}

/** Smallest crypto deposit in US dollars. */
export const MIN_DEPOSIT_USD = 1;

export const COINS = [
  { id: "btc", name: "Bitcoin", symbol: "BTC" },
  { id: "eth", name: "Ethereum", symbol: "ETH" },
  { id: "ltc", name: "Litecoin", symbol: "LTC" },
  { id: "usdt", name: "Tether", symbol: "USDT" },
  { id: "sol", name: "Solana", symbol: "SOL" },
] as const;
export type CoinId = (typeof COINS)[number]["id"];

/** Robux credited for a crypto deposit of `usd` dollars; 0 below the minimum. */
export function cryptoDepositRobux(usd: number): number {
  if (!Number.isFinite(usd) || usd < MIN_DEPOSIT_USD) return 0;
  return usdToRobux(usd);
}
