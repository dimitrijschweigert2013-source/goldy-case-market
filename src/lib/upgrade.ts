/** Share of the stake/target ratio the player gets as win chance. */
export const HOUSE_FACTOR = 0.9;
export const MAX_CHANCE = 0.8;
export const MIN_CHANCE = 0.01;

/** Win chance (0..1) for upgrading a stake worth `stakeValue` into a target worth `targetValue`. */
export function upgradeChance(stakeValue: number, targetValue: number): number {
  if (stakeValue <= 0 || targetValue <= stakeValue) return 0;
  const raw = (stakeValue / targetValue) * HOUSE_FACTOR;
  return Math.min(MAX_CHANCE, raw);
}

export function isTargetAllowed(stakeValue: number, targetValue: number): boolean {
  return upgradeChance(stakeValue, targetValue) >= MIN_CHANCE;
}

/** A roll in [0,1) wins when it lands inside the green arc that starts at the top. */
export function isWin(roll: number, chance: number): boolean {
  return roll < chance;
}

/**
 * Pointer rotation (degrees, clockwise from the top) that lands the pointer on the roll's
 * position on the fixed ring, always spinning forward several full turns.
 */
export function nextRotation(prev: number, roll: number, turns = 5): number {
  const base = Math.ceil(prev / 360) * 360;
  return base + turns * 360 + roll * 360;
}

/** Real odds are this share of the chance shown to the player (shown 40% → real 30%). */
export const REAL_SHARE = 0.75;

/** The actual win chance behind a shown chance. */
export function realChance(shown: number): number {
  return shown * REAL_SHARE;
}

/**
 * Where the pointer should stop (0..1 around the ring) once the outcome is already decided:
 * inside the green arc for a win, outside it for a loss. `r` is a random number in [0,1).
 */
export function landingSpot(won: boolean, shown: number, r: number): number {
  const t = 0.04 + r * 0.92;
  return won ? t * shown : shown + t * (1 - shown);
}

/** Quick-pick buttons under the wheel. */
export const QUICK_MULTIPLIERS = [2, 4, 8];
export const QUICK_CHANCES = [0.35, 0.55, 0.75];

/**
 * Best target for a quick-pick button: the allowed skin whose multiplier (target / stake)
 * or whose win chance is closest to the wanted one. Returns null when nothing fits.
 */
export function pickTarget<T extends { value: number }>(
  stakeValue: number,
  skins: readonly T[],
  want: { multiplier: number } | { chance: number },
): T | null {
  if (stakeValue <= 0) return null;
  let best: T | null = null;
  let bestDiff = Infinity;
  for (const s of skins) {
    if (!isTargetAllowed(stakeValue, s.value)) continue;
    const diff =
      "multiplier" in want
        ? Math.abs(s.value / stakeValue - want.multiplier)
        : Math.abs(upgradeChance(stakeValue, s.value) - want.chance);
    if (diff < bestDiff) {
      best = s;
      bestDiff = diff;
    }
  }
  return best;
}
