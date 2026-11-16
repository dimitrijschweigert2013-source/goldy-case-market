import { useCallback, useSyncExternalStore } from "react";

const KEY = "mysterydrop-robux-v2";
/** New players start empty and add balance via deposit or promo code. */
export const START_BALANCE = 0;
const listeners = new Set<() => void>();

function read(): number {
  const raw = localStorage.getItem(KEY);
  const n = raw === null ? START_BALANCE : Number(raw);
  return Number.isFinite(n) ? n : START_BALANCE;
}
function write(n: number) {
  localStorage.setItem(KEY, String(n));
  listeners.forEach((l) => l());
}

/** Shared Robux balance (per browser). */
export function useWallet() {
  const balance = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => START_BALANCE,
  );
  const spend = useCallback((n: number) => {
    const cur = read();
    if (cur < n) return false;
    write(cur - n);
    return true;
  }, []);
  const earn = useCallback((n: number) => write(read() + n), []);
  return { balance, spend, earn };
}
