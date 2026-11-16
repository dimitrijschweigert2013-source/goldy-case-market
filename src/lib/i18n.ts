import { useCallback, useSyncExternalStore } from "react";

export type Lang = "en" | "de" | "ru";
export const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "de", label: "Deutsch" },
  { id: "ru", label: "Русский" },
];
const LOCALE: Record<Lang, string> = { en: "en-US", de: "de-DE", ru: "ru-RU" };

const en = {
  "nav.cases": "Cases",
  "nav.upgrader": "Upgrader",
  "nav.inventory": "Inventory",
  "nav.language": "Language",
  "up.stake": "Your stake",
  "up.clear": "Clear",
  "up.pickSkins": "Pick skins below",
  "up.value": "Value",
  "up.target": "Target",
  "up.pickTarget": "Pick a target below",
  "up.chance": "Chance",
  "up.multi": "Multi",
  "up.spinning": "Spinning…",
  "up.upgrade": "Upgrade",
  "up.targetTooLow": "The target must be worth more than your stake (min. 1% chance).",
  "up.inventory": "Inventory",
  "up.invEmpty": "Your inventory is empty – open a case.",
  "up.chooseTarget": "Choose target",
  "up.search": "Search…",
  "up.flipSort": "Flip sorting",
  "up.won": "You won!",
  "up.lost": "You lost",
  "up.footer": "Just for fun – no real items, no real money. Values are approximate in-game values.",
  "wheel.won": "Won",
  "wheel.lost": "Lost",
  "wheel.hint": "Pick skins from your inventory and a target",
  "cases.title": "Cases",
  "cases.bannerTitle": "Open cases, win godlies",
  "cases.bannerText": "From Penny to Ancient – every case shows its exact drop chances.",
  "cases.free": "Free",
  "cases.freeUsed": "Already opened",
  "cases.freeOnce": "1× free",
  "cases.possible": "{n} possible skins",
  "cases.youWon": "You won:",
  "cases.inInventory": "now in your inventory",
  "cases.notEnough": "Not enough Robux",
  "cases.opening": "Opening…",
  "cases.openFree": "Open for free",
  "cases.openFor": "Open for",
  "cases.contents": "Contents",
  "cases.all": "All cases",
  "cases.unboxed": "Unboxed!",
  "inv.title": "Inventory",
  "inv.deselect": "Deselect",
  "inv.selectAll": "Select all",
  "inv.sellFor": "Sell {n} for",
  "inv.pickToSell": "Select skins to sell",
  "inv.empty": "Still empty – open a case.",
  "inv.tapHint": "Tap skins to select them.",
};
export type TKey = keyof typeof en;

const de: Record<TKey, string> = {
  "nav.cases": "Cases",
  "nav.upgrader": "Upgrader",
  "nav.inventory": "Inventar",
  "nav.language": "Sprache",
  "up.stake": "Dein Einsatz",
  "up.clear": "Leeren",
  "up.pickSkins": "Wähle unten Skins aus",
  "up.value": "Wert",
  "up.target": "Ziel",
  "up.pickTarget": "Wähle unten ein Ziel aus",
  "up.chance": "Chance",
  "up.multi": "Multi",
  "up.spinning": "Läuft…",
  "up.upgrade": "Upgrade",
  "up.targetTooLow": "Das Ziel muss mehr wert sein als dein Einsatz (mind. 1% Chance).",
  "up.inventory": "Inventar",
  "up.invEmpty": "Dein Inventar ist leer – öffne ein Case.",
  "up.chooseTarget": "Ziel wählen",
  "up.search": "Suchen…",
  "up.flipSort": "Sortierung umdrehen",
  "up.won": "Gewonnen!",
  "up.lost": "Leider verloren",
  "up.footer": "Nur zum Spaß – keine echten Items, kein echtes Geld. Werte sind ungefähre Spielwerte.",
  "wheel.won": "Gewonnen",
  "wheel.lost": "Verloren",
  "wheel.hint": "Wähle Skins aus deinem Inventar und ein Ziel",
  "cases.title": "Cases",
  "cases.bannerTitle": "Cases öffnen, Godlies gewinnen",
  "cases.bannerText": "Von Penny bis Ancient – jedes Case zeigt seine genauen Chancen.",
  "cases.free": "Gratis",
  "cases.freeUsed": "Bereits geöffnet",
  "cases.freeOnce": "1× gratis",
  "cases.possible": "{n} mögliche Skins",
  "cases.youWon": "Gewonnen:",
  "cases.inInventory": "liegt jetzt in deinem Inventar",
  "cases.notEnough": "Nicht genug Robux",
  "cases.opening": "Öffnet…",
  "cases.openFree": "Gratis öffnen",
  "cases.openFor": "Öffnen für",
  "cases.contents": "Inhalt",
  "cases.all": "Alle Cases",
  "cases.unboxed": "Gezogen!",
  "inv.title": "Inventar",
  "inv.deselect": "Abwählen",
  "inv.selectAll": "Alle auswählen",
  "inv.sellFor": "{n} verkaufen für",
  "inv.pickToSell": "Skins auswählen zum Verkaufen",
  "inv.empty": "Noch leer – öffne ein Case.",
  "inv.tapHint": "Tippe auf Skins, um sie auszuwählen.",
};

const ru: Record<TKey, string> = {
  "nav.cases": "Кейсы",
  "nav.upgrader": "Апгрейд",
  "nav.inventory": "Инвентарь",
  "nav.language": "Язык",
  "up.stake": "Твоя ставка",
  "up.clear": "Очистить",
  "up.pickSkins": "Выбери скины ниже",
  "up.value": "Цена",
  "up.target": "Цель",
  "up.pickTarget": "Выбери цель ниже",
  "up.chance": "Шанс",
  "up.multi": "Множ.",
  "up.spinning": "Крутится…",
  "up.upgrade": "Апгрейд",
  "up.targetTooLow": "Цель должна стоить больше ставки (мин. 1% шанса).",
  "up.inventory": "Инвентарь",
  "up.invEmpty": "Инвентарь пуст – открой кейс.",
  "up.chooseTarget": "Выбрать цель",
  "up.search": "Поиск…",
  "up.flipSort": "Сменить сортировку",
  "up.won": "Победа!",
  "up.lost": "Не повезло",
  "up.footer": "Только для веселья – никаких реальных предметов и денег. Цены примерные.",
  "wheel.won": "Победа",
  "wheel.lost": "Проигрыш",
  "wheel.hint": "Выбери скины из инвентаря и цель",
  "cases.title": "Кейсы",
  "cases.bannerTitle": "Открывай кейсы, выигрывай годли",
  "cases.bannerText": "От Penny до Ancient – у каждого кейса видны точные шансы.",
  "cases.free": "Бесплатно",
  "cases.freeUsed": "Уже открыт",
  "cases.freeOnce": "1× бесплатно",
  "cases.possible": "{n} возможных скинов",
  "cases.youWon": "Выигрыш:",
  "cases.inInventory": "уже в твоём инвентаре",
  "cases.notEnough": "Недостаточно Robux",
  "cases.opening": "Открываем…",
  "cases.openFree": "Открыть бесплатно",
  "cases.openFor": "Открыть за",
  "cases.contents": "Содержимое",
  "cases.all": "Все кейсы",
  "cases.unboxed": "Выпало!",
  "inv.title": "Инвентарь",
  "inv.deselect": "Снять выбор",
  "inv.selectAll": "Выбрать все",
  "inv.sellFor": "Продать {n} за",
  "inv.pickToSell": "Выбери скины для продажи",
  "inv.empty": "Пока пусто – открой кейс.",
  "inv.tapHint": "Нажми на скины, чтобы выбрать их.",
};

export const DICT: Record<Lang, Record<TKey, string>> = { en, de, ru };

export function translate(lang: Lang, key: TKey, vars?: Record<string, string | number>) {
  let s = DICT[lang][key] ?? en[key];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

const KEY = "mysterydrop-lang-v1";
const listeners = new Set<() => void>();
const isLang = (v: unknown): v is Lang => v === "en" || v === "de" || v === "ru";
const read = (): Lang => {
  const v = localStorage.getItem(KEY);
  return isLang(v) ? v : "en";
};

/** Locale for number formatting outside React (e.g. toasts). */
export function currentLocale() {
  return typeof localStorage === "undefined" ? LOCALE.en : LOCALE[read()];
}

/** Current UI language (English by default, saved per browser). */
export function useLang() {
  const lang = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => "en" as Lang,
  );
  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(KEY, l);
    document.documentElement.lang = l;
    listeners.forEach((fn) => fn());
  }, []);
  const t = useCallback((key: TKey, vars?: Record<string, string | number>) => translate(lang, key, vars), [lang]);
  const fmt = useCallback((n: number) => n.toLocaleString(LOCALE[lang]), [lang]);
  return { lang, setLang, t, fmt };
}
