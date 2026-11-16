import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { notifySkin } from "@/components/mm2/notify";
import { ArrowLeft, Box } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CaseArt } from "@/components/mm2/CaseArt";
import { Robux } from "@/components/mm2/Robux";
import { SkinCard } from "@/components/mm2/SkinCard";
import { useInventory } from "@/hooks/use-inventory";
import { useWallet } from "@/hooks/use-wallet";
import { CASES, FREE_CASE, rollDrop, type CaseDef } from "@/lib/cases";
import { useCaseReel } from "@/components/mm2/CaseReel";
import { useFreeCase } from "@/hooks/use-free-case";
import { sfx } from "@/lib/sound";
import type { Skin } from "@/lib/skins";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "MM2 Cases öffnen | MysteryDrop" },
      { name: "description", content: "Öffne Starter, Godly, Chroma und Ancient Cases und gewinne MM2 Skins – nur zum Spaß." },
      { property: "og:title", content: "MM2 Cases öffnen | MysteryDrop" },
      { property: "og:description", content: "Öffne MM2 Cases und gewinne Godlies, Chromas und Ancients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CasesPage,
});

const fmt = (n: number) => n.toLocaleString("de-DE");

function CasesPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const c = [FREE_CASE, ...CASES].find((x) => x.id === openId);
  const free = useFreeCase();
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {c ? (
        <CaseOpener c={c} onBack={() => setOpenId(null)} />
      ) : (
        <>
          <h1 className="mb-4 flex items-center gap-2 text-2xl">
            <Box className="h-6 w-6 text-pointer" /> Cases
          </h1>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <button
              type="button"
              data-tier={FREE_CASE.tier}
              onClick={() => setOpenId(FREE_CASE.id)}
              className="skin-card group relative flex flex-col items-center overflow-hidden p-4 text-center"
            >
              <span className="absolute left-2 top-2 rounded-sm bg-win px-1.5 py-0.5 text-[10px] font-bold uppercase text-background">
                Gratis
              </span>
              <CaseArt c={FREE_CASE} className="transition-transform duration-300 group-hover:scale-105" />
              <span className="tier-text mt-2 font-display text-lg font-bold">{FREE_CASE.name}</span>
              <span className="mt-1 font-display text-sm font-semibold text-muted-foreground">
                {free.used ? "Bereits geöffnet" : "1× gratis · bis Galaxy"}
              </span>
              <div className="tier-bar absolute inset-x-0 bottom-0 h-0.5" />
            </button>
            {CASES.map((x) => (
              <button
                key={x.id}
                type="button"
                data-tier={x.tier}
                onClick={() => setOpenId(x.id)}
                className="skin-card group flex flex-col items-center overflow-hidden p-4 text-center"
              >
                <CaseArt c={x} className="transition-transform duration-300 group-hover:scale-105" />
                <span className="tier-text mt-2 font-display text-lg font-bold">{x.name}</span>
                <span className="mt-1 flex items-center gap-1 font-display font-semibold text-robux">
                  <Robux className="h-4 w-4" /> {fmt(x.price)}
                </span>
                <div className="tier-bar absolute inset-x-0 bottom-0 h-0.5" />
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function CaseOpener({ c, onBack }: { c: CaseDef; onBack: () => void }) {
  const wallet = useWallet();
  const inv = useInventory();
  const free = useFreeCase();
  const isFree = c.id === FREE_CASE.id;
  const locked = isFree && free.used;
  const { spin, spinning, view } = useCaseReel(c);
  const [won, setWon] = useState<Skin | null>(null);

  const open = async () => {
    if (spinning || locked) return;
    if (isFree) free.markUsed();
    else if (!wallet.spend(c.price)) {
      toast.error("Nicht genug Robux");
      return;
    }
    sfx.open();
    const prize = rollDrop(c.drops, Math.random());
    setWon(null);
    await spin(prize);
    setWon(prize);
    inv.add(prize.id);
    sfx.win();
    notifySkin("win", "Gezogen!", prize);
  };

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={onBack} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Alle Cases
      </button>
      <section className="panel flex flex-col items-center gap-4 p-4 md:p-6" data-tier={c.tier}>
        <div className="flex items-center gap-4">
          <CaseArt c={c} className="w-28" />
          <div>
            <h1 className="tier-text text-2xl">{c.name}</h1>
            <p className="text-sm text-muted-foreground">{c.drops.length} mögliche Skins</p>
          </div>
        </div>

        {view}

        {won && (
          <p className="animate-pop-in text-center font-display text-lg">
            Gewonnen: <span className="font-bold text-pointer">{won.name}</span> ·{" "}
            <Robux className="h-4 w-4 text-robux" /> {fmt(won.value)} – liegt jetzt in deinem Inventar
          </p>
        )}

        <Button variant="gold" size="xl" className="w-full max-w-sm" disabled={spinning || locked || (!isFree && wallet.balance < c.price)} onClick={open}>
          {spinning ? "Öffnet…" : locked ? "Bereits geöffnet" : isFree ? "Gratis öffnen" : <>Öffnen für <Robux className="h-5 w-5" /> {fmt(c.price)}</>}
        </Button>
      </section>

      <section>
        <h2 className="mb-3 text-base">Inhalt</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
          {c.drops.map((d) => (
            <SkinCard
              key={d.skin.id}
              skin={d.skin}
              badge={<span className="rounded-sm bg-background/80 px-1 text-[10px] font-semibold tabular-nums">{(d.chance * 100).toFixed(2)}%</span>}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
