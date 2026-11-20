import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Backpack, Search, Target, X, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkinCard } from "@/components/mm2/SkinCard";
import { UpgradeWheel } from "@/components/mm2/UpgradeWheel";
import { Robux } from "@/components/mm2/Robux";
import { notifySkin } from "@/components/mm2/notify";
import { useInventory } from "@/hooks/use-inventory";
import { logHistory } from "@/hooks/use-history";
import { SKINS, SKIN_BY_ID, TIER_LABEL, type Skin } from "@/lib/skins";
import {
  QUICK_CHANCES,
  QUICK_MULTIPLIERS,
  isTargetAllowed,
  isWin,
  landingSpot,
  nextRotation,
  pickTarget,
  realChance,
  upgradeChance,
} from "@/lib/upgrade";
import { sfx } from "@/lib/sound";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MysteryDrop – MM2 Skin Upgrader" },
      {
        name: "description",
        content:
          "Stake your MM2 knives and guns, pick a target and let the pointer decide. Godlies, Chromas and Ancients.",
      },
      { property: "og:title", content: "MysteryDrop – MM2 Skin Upgrader" },
      {
        property: "og:description",
        content: "Stake your MM2 skins, pick a target and let the pointer decide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UpgraderPage,
});

const SPIN_MS = 7000;

function UpgraderPage() {
  const inv = useInventory();
  const { t, fmt } = useLang();
  const [spinStake, setSpinStake] = useState<Skin | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [query, setQuery] = useState("");
  const [lastChance, setLastChance] = useState(0);
  const [sortDesc, setSortDesc] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedItem = selected ? inv.items.find((i) => i.uid === selected) : undefined;
  const selectedSkin = selectedItem ? SKIN_BY_ID[selectedItem.skinId] : undefined;
  const stakeValue = selectedSkin?.value ?? 0;
  // While spinning the stake is already gone from the inventory, so show the snapshot.
  const shownStake = spinning ? spinStake ?? undefined : selectedSkin;
  const visibleItems = inv.items.filter((i) => !hidden.includes(i.uid));
  const totalValue = visibleItems.reduce((s, i) => s + (SKIN_BY_ID[i.skinId]?.value ?? 0), 0);

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

  /** Only one skin can be staked: picking another one swaps it. */
  const toggle = (uid: string) => {
    if (spinning) return;
    reset();
    sfx.click();
    setSelected((prev) => (prev === uid ? null : uid));
  };

  const quickPick = (want: { multiplier: number } | { chance: number }) => {
    if (!stakeValue || spinning) return;
    const best = pickTarget(stakeValue, SKINS, want);
    if (best) {
      reset();
      sfx.click();
      setTargetId(best.id);
    }
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const spin = () => {
    if (!validTarget || spinning || !selected || !selectedSkin) return;
    // The real odds are lower than the shown chance; the pointer then lands to match.
    const won = isWin(Math.random(), realChance(chance));
    const spot = landingSpot(won, chance, Math.random());
    const prize = validTarget;
    // Save the outcome first, then play the animation, so leaving the page can't lose or dupe skins.
    setSpinStake(selectedSkin);
    inv.remove([selected]);
    setSelected(null);
    const newUid = won ? inv.add(prize.id) : null;
    logHistory({ kind: "upgrade", stake: [selectedSkin.id], targetId: prize.id, chance, won });
    setHidden(newUid ? [newUid] : []);
    reset();
    setLastChance(chance);
    setSpinning(true);
    sfx.open();
    setRotation((prev) => nextRotation(prev, spot));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSpinning(false);
      setSpinStake(null);
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
    <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
      {/* Upgrade stage */}
      <section className="stage grid grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-5 md:grid-cols-[1fr_minmax(0,340px)_1fr] md:items-center md:p-6">
        <ItemSlot
          className="order-1"
          icon={<Backpack className="h-3.5 w-3.5" />}
          label={t("up.stake")}
          skin={shownStake}
          empty={t("up.pickSkins")}
          onClear={selected && !spinning ? () => (setSelected(null), reset()) : undefined}
          clearLabel={t("up.clear")}
        />

        {/* Wheel */}
        <div className="order-3 col-span-2 flex w-full flex-col items-center gap-3 md:order-2 md:col-span-1">
          <div className="w-full max-w-[300px] md:max-w-[340px]">
            <UpgradeWheel
              chance={spinning || result ? lastChance : chance}
              rotation={rotation}
              spinning={spinning}
              target={target}
              result={result}
              spinMs={SPIN_MS}
            />
          </div>
          <div className="grid w-full max-w-[340px] grid-cols-6 gap-1.5">
            {QUICK_MULTIPLIERS.map((m) => (
              <Button
                key={`x${m}`}
                size="sm"
                variant="chip"
                className="h-8 px-0 font-display tabular-nums"
                disabled={!stakeValue || spinning}
                onClick={() => quickPick({ multiplier: m })}
              >
                x{m}
              </Button>
            ))}
            {QUICK_CHANCES.map((c) => (
              <Button
                key={`p${c}`}
                size="sm"
                variant="chip"
                className="h-8 px-0 font-display tabular-nums"
                disabled={!stakeValue || spinning}
                onClick={() => quickPick({ chance: c })}
              >
                {Math.round(c * 100)}%
              </Button>
            ))}
          </div>
          <Button
            variant="gold"
            size="xl"
            className="w-full max-w-[340px]"
            disabled={!validTarget || !selected || spinning}
            onClick={spin}
          >
            <Zap /> {spinning ? t("up.spinning") : t("up.upgrade")}
            {validTarget && !spinning && (
              <span className="ml-1 rounded bg-background/25 px-1.5 py-0.5 text-xs tabular-nums">
                x{multiplier.toFixed(2)}
              </span>
            )}
          </Button>
        </div>

        <ItemSlot
          className="order-2 md:order-3"
          icon={<Target className="h-3.5 w-3.5" />}
          label={t("up.target")}
          skin={target}
          empty={t("up.pickTarget")}
          onClear={target && !spinning ? () => (setTargetId(null), reset()) : undefined}
          clearLabel={t("up.clear")}
        />
      </section>

      {target && !validTarget && stakeValue > 0 && !spinning && (
        <p className="mt-3 text-center text-sm text-lose">{t("up.targetTooLow")}</p>
      )}

      {/* Lists */}
      <section className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
        <div className="panel p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 text-base">
                <Backpack className="h-4 w-4 text-gold" /> {t("up.inventory")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {visibleItems.length} {t("common.skins")} · <Robux className="inline h-3 w-3" /> {fmt(totalValue)}
              </p>
            </div>
          </div>
          {inv.ready && visibleItems.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t("up.invEmpty")}
            </div>
          ) : (
            <div className="scrollbar-thin grid max-h-[560px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {[...visibleItems]
                .sort((a, b) => (SKIN_BY_ID[b.skinId]?.value ?? 0) - (SKIN_BY_ID[a.skinId]?.value ?? 0))
                .map((item) => {
                  const skin = SKIN_BY_ID[item.skinId];
                  if (!skin) return null;
                  return (
                    <SkinCard
                      key={item.uid}
                      skin={skin}
                      active={selected === item.uid}
                      disabled={spinning}
                      onClick={() => toggle(item.uid)}
                    />
                  );
                })}
            </div>
          )}
        </div>

        <div className="panel p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
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
                  className="h-8 pl-8"
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
          <div className="scrollbar-thin grid max-h-[560px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
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
                    sfx.click();
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
    </main>
  );
}

/** Big skin display for the stake or the target: picture, then name and value right under it. */
function ItemSlot({
  icon,
  label,
  skin,
  empty,
  onClear,
  clearLabel,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  skin: Skin | undefined;
  empty: string;
  onClear?: (() => void) | undefined;
  clearLabel: string;
  className?: string;
}) {
  const { fmt } = useLang();
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-2", className)}>
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {icon} {label}
        </span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label={clearLabel}
            className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div
        data-tier={skin?.tier}
        className={cn("slot relative grid aspect-square w-full max-w-[240px] place-items-center", skin && "slot-filled")}
      >
        {skin ? (
          <img
            key={skin.id}
            src={skin.image}
            alt={skin.name}
            className="animate-pop-in h-[72%] w-[72%] -rotate-12 object-contain drop-shadow-[0_10px_14px_rgb(0_0_0/0.55)]"
          />
        ) : (
          <span className="px-4 text-center text-xs text-muted-foreground">{empty}</span>
        )}
      </div>
      <div data-tier={skin?.tier} className="flex min-h-[54px] w-full flex-col items-center text-center">
        {skin && (
          <>
            <span className="tier-text text-[10px] font-semibold uppercase tracking-wider">{TIER_LABEL[skin.tier]}</span>
            <span className="w-full truncate font-display text-sm font-semibold leading-tight sm:text-base">{skin.name}</span>
            <span className="mt-0.5 flex items-center gap-1 font-display text-sm font-semibold tabular-nums text-gold">
              <Robux className="h-3.5 w-3.5" /> {fmt(skin.value)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
