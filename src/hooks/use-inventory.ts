import { useCallback, useSyncExternalStore } from "react";
import { FREE_POOL, STARTER_SKINS } from "@/lib/skins";

export type InvItem = { uid: string; skinId: string };

const KEY = "mm2-upgrader-inventory-v1";
const EMPTY: InvItem[] = [];
const listeners = new Set<() => void>();

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const starter = (): InvItem[] => STARTER_SKINS.map((skinId) => ({ uid: uid(), skinId }));

let cacheRaw: string | null = null;
let cacheItems: InvItem[] = EMPTY;

function read(): InvItem[] {
  let raw = localStorage.getItem(KEY);
  if (raw === null) {
    raw = JSON.stringify(starter());
    localStorage.setItem(KEY, raw);
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cacheItems = JSON.parse(raw) as InvItem[];
    } catch {
      cacheItems = starter();
    }
  }
  return cacheItems;
}

/** Saves right away, so a result is kept even if the page is left mid-animation. */
function write(items: InvItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
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

/** Shared inventory for every page (per browser, just for fun). */
export function useInventory() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);

  const remove = useCallback((uids: string[]) => {
    write(read().filter((i) => !uids.includes(i.uid)));
  }, []);

  /** Adds a skin and returns its new uid. */
  const add = useCallback((skinId: string) => {
    const id = uid();
    write([{ uid: id, skinId }, ...read()]);
    return id;
  }, []);

  const claimFree = useCallback(() => {
    const skinId = FREE_POOL[Math.floor(Math.random() * FREE_POOL.length)] ?? "default-knife";
    write([{ uid: uid(), skinId }, ...read()]);
    return skinId;
  }, []);

  const reset = useCallback(() => write(starter()), []);

  return { items, ready, add, remove, claimFree, reset };
}
