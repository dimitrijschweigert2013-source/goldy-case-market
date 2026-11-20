import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpCircle, Box, Coins, Gift, History as HistoryIcon, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Robux } from "@/components/mm2/Robux";
import { useHistory } from "@/hooks/use-history";
import { robuxDelta, type HistoryEntry } from "@/lib/history";
import { SKIN_BY_ID } from "@/lib/skins";
import { useLang, type TKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History – MysteryDrop" },
      { name: "description", content: "Every MM2 case you opened, every upgrade, sale and deposit on MysteryDrop." },
      { property: "og:title", content: "History – MysteryDrop" },
      { property: "og:description", content: "Your case drops, upgrades, sales and deposits in one list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

type Filter = "all" | "case" | "upgrade" | "sell" | "money";
const FILTERS: { id: Filter; label: TKey }[] = [
  { id: "all", label: "hist.all" },
  { id: "case", label: "hist.cases" },
  { id: "upgrade", label: "hist.upgrades" },
  { id: "sell", label: "hist.sales" },
  { id: "money", label: "hist.deposits" },
];
const matches = (f: Filter, e: HistoryEntry) =>
  f === "all" || (f === "money" ? e.kind === "deposit" || e.kind === "promo" : e.kind === f);

const valueOf = (id: string) => SKIN_BY_ID[id]?.value ?? 0;

function HistoryPage() {
  const { entries, ready, clear } = useHistory();
  const { t } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const list = entries.filter((e) => matches(filter, e));

  return (
    <main className="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl">
            <HistoryIcon className="h-6 w-6 text-gold" /> {t("hist.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("hist.sub")}</p>
        </div>
        {entries.length > 0 && (
          <Button variant="chip" size="sm" onClick={clear}>
            <Trash2 /> {t("hist.clear")}
          </Button>
        )}
      </div>

      <div className="mb-3 flex gap-1.5 overflow-x-auto">
        {FILTERS.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={filter === f.id ? "gold" : "chip"}
            className="shrink-0"
            onClick={() => setFilter(f.id)}
          >
            {t(f.label)}
          </Button>
        ))}
      </div>

      {ready && list.length === 0 ? (
        <div className="panel p-10 text-center text-sm text-muted-foreground">{t("hist.empty")}</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((e) => (
            <Row key={e.id} e={e} />
          ))}
        </ul>
      )}
    </main>
  );
}

function Row({ e }: { e: HistoryEntry }) {
  const { t, fmt, lang } = useLang();
  const delta = robuxDelta(e, valueOf);
  const when = new Date(e.at).toLocaleString(lang === "en" ? "en-GB" : lang === "de" ? "de-DE" : "ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });

  let icon = <Box className="h-4 w-4" />;
  let title = "";
  let sub = "";
  let skins: string[] = [];
  switch (e.kind) {
    case "case":
      title = t("hist.case", { name: e.caseName });
      skins = [e.skinId];
      sub = SKIN_BY_ID[e.skinId]?.name ?? "";
      break;
    case "upgrade":
      icon = <ArrowUpCircle className="h-4 w-4" />;
      title = e.won ? t("hist.upWin") : t("hist.upLose");
      skins = [...e.stake, e.targetId];
      sub = `${e.stake.map((id) => SKIN_BY_ID[id]?.name ?? id).join(", ")} → ${SKIN_BY_ID[e.targetId]?.name ?? ""} · ${t("hist.chance", { p: (e.chance * 100).toFixed(1) })}`;
      break;
    case "sell":
      icon = <Coins className="h-4 w-4" />;
      title = t("hist.sell", { n: e.skinIds.length });
      skins = e.skinIds;
      break;
    case "deposit":
      icon = <Wallet className="h-4 w-4" />;
      title = t("hist.deposit", { coin: e.coin });
      break;
    case "promo":
      icon = <Gift className="h-4 w-4" />;
      title = t("hist.promo", { code: e.code });
      break;
  }

  return (
    <li className="panel flex items-center gap-3 p-2.5 sm:p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary text-gold">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="truncate text-xs text-muted-foreground">
          {sub ? `${sub} · ` : ""}
          {when}
        </div>
      </div>
      {skins.length > 0 && (
        <div className="hidden shrink-0 items-center gap-1 sm:flex">
          {skins.slice(0, 4).map((id, i) => {
            const s = SKIN_BY_ID[id];
            if (!s) return null;
            const lostTarget = e.kind === "upgrade" && !e.won && i === skins.length - 1;
            return (
              <span
                key={`${id}-${i}`}
                data-tier={s.tier}
                title={s.name}
                className={cn("skin-glow grid h-10 w-10 place-items-center rounded-md border border-border", lostTarget && "opacity-35")}
              >
                <img src={s.image} alt={s.name} className="h-8 w-8 object-contain" />
              </span>
            );
          })}
        </div>
      )}
      <span
        className={cn(
          "flex shrink-0 items-center gap-1 font-display text-sm font-semibold tabular-nums",
          delta >= 0 ? "text-win" : "text-lose",
        )}
      >
        {delta >= 0 ? "+" : "−"}
        <Robux className="h-3.5 w-3.5" />
        {fmt(Math.abs(delta))}
      </span>
    </li>
  );
}
