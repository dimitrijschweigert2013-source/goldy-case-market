import { useCallback, useSyncExternalStore } from "react";
import { redeemPromo } from "@/lib/promo";

const KEY = "mysterydrop-promo-used-v1";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cacheRaw: string | null = null;
let cache: string[] = EMPTY;

function read(): string[] {
  const raw = localStorage.getItem(KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = raw ? (JSON.parse(raw) as string[]) : EMPTY;
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

/** Promo codes this browser has already redeemed. */
export function usePromo() {
  const used = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => EMPTY,
  );
  const redeem = useCallback((input: string) => {
    const res = redeemPromo(input, read());
    if (res.ok) {
      localStorage.setItem(KEY, JSON.stringify([...read(), res.code]));
      listeners.forEach((l) => l());
    }
    return res;
  }, []);
  return { used, redeem };
}
