import { useCallback, useSyncExternalStore } from "react";
import { pushEntry, type HistoryEntry, type NewHistoryEntry } from "@/lib/history";

const KEY = "mysterydrop-history-v1";
const EMPTY: HistoryEntry[] = [];
const listeners = new Set<() => void>();
let cacheRaw: string | null = null;
let cacheList: HistoryEntry[] = EMPTY;

function read(): HistoryEntry[] {
  const raw = localStorage.getItem(KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cacheList = raw ? (JSON.parse(raw) as HistoryEntry[]) : EMPTY;
    } catch {
      cacheList = EMPTY;
    }
  }
  return cacheList;
}

function write(list: HistoryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  listeners.forEach((l) => l());
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);

/** Saves an entry right away (works outside React too). */
export function logHistory(e: NewHistoryEntry) {
  write(pushEntry(read(), { ...e, id: newId(), at: Date.now() } as HistoryEntry));
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => e.key === KEY && l();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/** Everything this browser did: case drops, upgrades, sales, deposits, promo codes. */
export function useHistory() {
  const entries = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const clear = useCallback(() => write([]), []);
  return { entries, ready, clear };
}
