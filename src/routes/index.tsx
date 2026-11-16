import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { sfx } from "@/lib/sound";
import { notifySkin } from "@/components/mm2/notify";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Backpack,
  Percent,
  Search,
  Target,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkinCard } from "@/components/mm2/SkinCard";
import { UpgradeWheel } from "@/components/mm2/UpgradeWheel";
import { useInventory } from "@/hooks/use-inventory";
import { SKINS, SKIN_BY_ID, TIER_LABEL, type Skin } from "@/lib/skins";
import { isTargetAllowed, isWin, landingSpot, nextRotation, realChance, upgradeChance } from "@/lib/upgrade";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Robux } from "@/components/mm2/Robux";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MysteryDrop – MM2 Skin Upgrader" },
      {
        name: "description",
        content:
          "Stake your MM2 knives and guns, pick a target and let the pointer decide. Godlies, Chromas and Ancients – just for fun.",
      },
      { property: "og:title", content: "MysteryDrop – MM2 Skin Upgrader" },
      {
        property: "og:description",
        content: "Stake your MM2 skins and let the pointer decide – just for fun.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UpgraderPage,
});

const SPIN_MS = 7000;
const MULTIPLIERS = [1.5, 2, 3, 5, 10];

function UpgraderPage() {
  const inv = useInventory();
  const { t, fmt } = useLang();
  const [spinStake, setSpinStake] = useState<Skin[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [query, setQuery] = useState("");
  const [lastChance, setLastChance] = useState(0);
  const [sortDesc, setSortDesc] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedSkins = inv.items
    .filter((i) => selected.includes(i.uid))
    .map((i) => SKIN_BY_ID[i.skinId])
    .filter((s): s is Skin => Boolean(s));
  const stakeValue = selectedSkins.reduce((sum, s) => sum + s.value, 0);
  // While spinning the stake is already gone from the inventory, so show the snapshot.
  const shownStake = spinning ? spinStake : selectedSkins;
  const shownStakeValue = shownStake.reduce((sum, s) => sum + s.value, 0);
  const visibleItems = inv.items.filter((i) => !hidden.includes(i.uid));
  const totalValue = inv.items.reduce((s, i) => s + (SKIN_BY_ID[i.skinId]?.value ?? 0), 0);

  const target = targetId ? SKIN_BY_ID[targetId] : undefined;
  const validTarget = target && isTargetAllowed(stakeValue, target.value) ? target : undefined;
  const chance = validTarget ? upgradeChance(stakeValue, validTarget.value) : 0;
  const multiplier = validTarget && stakeValue ? validTarget.value / stakeValue : 0;

  const targets = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = SKINS.filter((s) => (q ? s.name.toLowerCase().includes(q) : true));
    return sortDesc ? [...list].reverse() : list;
  }, [query, sortDesc]);

  const reset = () => setResult(null);

  const toggle = (uid: string) => {
    if (spinning) return;
    reset();
    setSelected((prev) => (prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]));
  };

  const pickMultiplier = (m: number) => {
    if (!stakeValue || spinning) return;
    const goal = stakeValue * m;
    let best: Skin | null = null;
    for (const s of SKINS) {
      if (!isTargetAllowed(stakeValue, s.value)) continue;
      if (!best || Math.abs(s.value - goal) < Math.abs(best.value - goal)) best = s;
    }
    if (best) {
      reset();
      setTargetId(best.id);
    }
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const spin = () => {
    if (!validTarget || spinning || !selected.length) return;
    // The real odds are lower than the shown chance; the pointer then lands to match.
    const won = isWin(Math.random(), realChance(chance));
    const spot = landingSpot(won, chance, Math.random());
    const prize = validTarget;
    // Save the outcome first, then play the animation, so leaving the page can't lose or dupe skins.
    setSpinStake(selectedSkins);
    inv.remove(selected);
    setSelected([]);
    const newUid = won ? inv.add(prize.id) : null;
    setHidden(newUid ? [newUid] : []);
    reset();
    setLastChance(chance);
    setSpinning(true);
    setRotation((prev) => nextRotation(prev, spot));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSpinning(false);
      setSpinStake([]);
      setHidden([]);
      if (won) {
        setResult("win");
        sfx.win();
        notifySkin("win", t("up.won"), prize);
      } else {
        setResult("lose");
        sfx.lose();
        notifySkin("lose", t("up.lost"), prize);
      }
    }, SPIN_MS + 150);
  };


  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Upgrade stage */}
      <section className="panel grid gap-4 p-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:p-6">
        {/* Stake */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Backpack className="h-3.5 w-3.5" /> {t("up.stake")}
            </span>
            {selected.length > 0 && !spinning && (
              <button
                type="button"
                onClick={() => {
                  setSelected([]);
                  reset();
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-3 w-3" /> {t("up.clear")}
              </button>
            )}
          </div>
          <div className="mx-auto aspect-square w-full max-w-[260px] rounded-lg border border-border bg-surface p-2 shadow-inner">
            <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => {
                const overflow = shownStake.length > 9 && i === 8;
                const s = overflow ? undefined : shownStake[i];
                if (overflow) {
                  return (
                    <div key={i} className="grid place-items-center rounded-md bg-secondary font-display text-sm font-semibold">
                      +{shownStake.length - 8}
                    </div>
                  );
                }
                return s ? (
                  <div
                    key={i}
                    data-tier={s.tier}
                    title={s.name}
                    className="skin-glow grid place-items-center rounded-md border border-border/60"
                  >
                    <img src={s.image} alt={s.name} className="h-[80%] w-[80%] object-contain" />
                  </div>
                ) : (
                  <div key={i} className="rounded-md border border-dashed border-border/70 bg-background/40" />
                );
              })}
            </div>
          </div>
          {shownStake.length === 0 && (
            <span className="-mt-1 text-center text-xs text-muted-foreground">{t("up.pickSkins")}</span>
          )}
          <Stat icon={<Robux className="h-3.5 w-3.5" />} label={t("up.value")} value={fmt(shownStakeValue)} />
        </div>

        {/* Wheel */}
        <div className="flex w-full flex-col items-center gap-4 md:w-[340px]">
          <UpgradeWheel
            chance={spinning || result ? lastChance : chance}
            rotation={rotation}
            spinning={spinning}
            target={target}
            result={result}
            spinMs={SPIN_MS}
          />
          <div className="flex flex-wrap justify-center gap-1.5">
            {MULTIPLIERS.map((m) => (
              <Button
                key={m}
                size="sm"
                variant="chip"
                className="h-7 px-2.5 font-display tabular-nums"
                disabled={!stakeValue || spinning}
                onClick={() => pickMultiplier(m)}
              >
                x{m}
              </Button>
            ))}
          </div>
          <Button
            variant="gold"
            size="xl"
            className="w-full"
            disabled={!validTarget || !selected.length || spinning}
            onClick={spin}
          >
            <Zap /> {spinning ? t("up.spinning") : t("up.upgrade")}
          </Button>
        </div>

        {/* Target */}
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Target className="h-3.5 w-3.5" /> {t("up.target")}
          </span>
          <div className="mx-auto aspect-square w-full max-w-[260px] rounded-lg border border-border bg-surface p-2 shadow-inner">
            <div
              data-tier={target?.tier}
              className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border/70 bg-background/40 p-3 text-center",
                target && "skin-glow border-solid border-border/60",
              )}
            >
              {target ? (
                <>
                  <img src={target.image} alt={target.name} className="h-[62%] w-[62%] object-contain drop-shadow-[0_8px_12px_rgb(0_0_0/0.5)]" />
                  <div className="tier-text text-[10px] font-semibold uppercase tracking-wider">
                    {TIER_LABEL[target.tier]}
                  </div>
                  <div className="font-display text-lg font-semibold leading-tight">{target.name}</div>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">{t("up.pickTarget")}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat icon={<Robux className="h-3.5 w-3.5" />} label={t("up.value")} value={target ? fmt(target.value) : "–"} />
            <Stat icon={<Percent className="h-3.5 w-3.5" />} label={t("up.chance")} value={validTarget ? `${(chance * 100).toFixed(1)}%` : "–"} />
            <Stat icon={<TrendingUp className="h-3.5 w-3.5" />} label={t("up.multi")} value={validTarget ? `x${multiplier.toFixed(2)}` : "–"} />
          </div>
        </div>
      </section>

      {target && !validTarget && stakeValue > 0 && !spinning && (
        <p className="mt-3 text-center text-sm text-lose">
          {t("up.targetTooLow")}
        </p>
      )}

      {/* Lists */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 text-base">
                <Backpack className="h-4 w-4 text-gold" /> {t("up.inventory")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {visibleItems.length} Skins · <Robux className="inline h-3 w-3" /> {fmt(totalValue)}
              </p>
            </div>
          </div>
          {inv.ready && visibleItems.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t("up.invEmpty")}
            </div>
          ) : (
            <div className="scrollbar-thin grid max-h-[560px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
              {[...visibleItems]
                .sort((a, b) => (SKIN_BY_ID[b.skinId]?.value ?? 0) - (SKIN_BY_ID[a.skinId]?.value ?? 0))
                .map((item) => {
                const skin = SKIN_BY_ID[item.skinId];
                if (!skin) return null;
                return (
                  <SkinCard
                    key={item.uid}
                    skin={skin}
                    active={selected.includes(item.uid)}
                    disabled={spinning}
                    onClick={() => toggle(item.uid)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-gold" /> {t("up.chooseTarget")}
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="relative w-40">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("up.search")}
                  className="h-8 pl-8 text-sm"
                />
              </div>
              <Button
                size="icon"
                variant="chip"
                className="h-8 w-8"
                aria-label={t("up.flipSort")}
                onClick={() => setSortDesc((v) => !v)}
              >
                {sortDesc ? <ArrowDownWideNarrow /> : <ArrowUpWideNarrow />}
              </Button>
            </div>
          </div>
          <div className="scrollbar-thin grid max-h-[560px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
            {targets.map((skin) => {
              const allowed = stakeValue > 0 && isTargetAllowed(stakeValue, skin.value);
              return (
                <SkinCard
                  key={skin.id}
                  skin={skin}
                  active={targetId === skin.id}
                  disabled={!allowed || spinning}
                  onClick={() => {
                    reset();
                    setTargetId(skin.id);
                  }}
                  badge={
                    allowed ? (
                      <span className="rounded-sm bg-background/80 px-1 text-[10px] font-semibold tabular-nums text-win">
                        {(upgradeChance(stakeValue, skin.value) * 100).toFixed(1)}%
                      </span>
                    ) : null
                  }
                />
              );
            })}
          </div>
        </div>
      </section>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {t("up.footer")}
      </p>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="font-display text-base font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
