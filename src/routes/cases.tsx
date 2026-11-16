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
import { CASES, rollDrop, type CaseDef } from "@/lib/cases";
import { useCaseReel } from "@/components/mm2/CaseReel";
import { useLang } from "@/lib/i18n";
import { sfx } from "@/lib/sound";
import type { Skin } from "@/lib/skins";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "Open MM2 Cases | MysteryDrop" },
      { name: "description", content: "Open Penny, Godly, Chroma and Ancient cases and win real MM2 knives and guns." },
      { property: "og:title", content: "Open MM2 Cases | MysteryDrop" },
      { property: "og:description", content: "Open MM2 cases and win Godlies, Chromas and Ancients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CasesPage,
});

function CasesPage() {
  const { t, fmt } = useLang();
  const [openId, setOpenId] = useState<string | null>(null);
  const c = CASES.find((x) => x.id === openId);
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {c ? (
        <CaseOpener c={c} onBack={() => setOpenId(null)} />
      ) : (
        <>
          <h1 className="mb-4 flex items-center gap-2 text-2xl">
            <Box className="h-6 w-6 text-pointer" /> {t("cases.title")}
          </h1>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
  const { t, fmt } = useLang();
  const wallet = useWallet();
  const inv = useInventory();
  const { spin, spinning, view } = useCaseReel(c);
  const [won, setWon] = useState<Skin | null>(null);

  const open = async () => {
    if (spinning) return;
    if (!wallet.spend(c.price)) {
      toast.error(t("cases.notEnough"));
      return;
    }
    sfx.open();
    const prize = rollDrop(c.drops, Math.random());
    setWon(null);
    await spin(prize);
    setWon(prize);
    inv.add(prize.id);
    sfx.win();
    notifySkin("win", t("cases.unboxed"), prize);
  };

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={onBack} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("cases.all")}
      </button>
      <section className="panel flex flex-col items-center gap-4 p-4 md:p-6" data-tier={c.tier}>
        <div className="flex items-center gap-4">
          <CaseArt c={c} className="w-28" />
          <div>
            <h1 className="tier-text text-2xl">{c.name}</h1>
            <p className="text-sm text-muted-foreground">{t("cases.possible", { n: c.drops.length })}</p>
          </div>
        </div>

        {view}

        {won && (
          <p className="animate-pop-in text-center font-display text-lg">
            {t("cases.youWon")} <span className="font-bold text-pointer">{won.name}</span> ·{" "}
            <Robux className="h-4 w-4 text-robux" /> {fmt(won.value)} – {t("cases.inInventory")}
          </p>
        )}

        <Button variant="gold" size="xl" className="w-full max-w-sm" disabled={spinning || wallet.balance < c.price} onClick={open}>
          {spinning ? (
            t("cases.opening")
          ) : (
            <>
              {t("cases.openFor")} <Robux className="h-5 w-5" /> {fmt(c.price)}
            </>
          )}
        </Button>
      </section>

      <section>
        <h2 className="mb-3 text-base">{t("cases.contents")}</h2>
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
