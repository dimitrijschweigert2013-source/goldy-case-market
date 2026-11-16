import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Backpack, CheckSquare, Coins, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Robux } from "@/components/mm2/Robux";
import { SkinCard } from "@/components/mm2/SkinCard";
import { useInventory } from "@/hooks/use-inventory";
import { useWallet } from "@/hooks/use-wallet";
import { sellPrice } from "@/lib/sell";
import { sfx } from "@/lib/sound";
import { SKIN_BY_ID, type Skin } from "@/lib/skins";

export const Route = createFileRoute("/inventar")({
  head: () => ({
    meta: [
      { title: "Mein Inventar | MysteryDrop" },
      { name: "description", content: "Alle deine gezogenen MM2 Skins – verkaufe sie für Robux." },
      { property: "og:title", content: "Mein Inventar | MysteryDrop" },
      { property: "og:description", content: "Deine MM2 Skins, das teuerste zuerst – verkaufe sie für Robux." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InventoryPage,
});

const fmt = (n: number) => n.toLocaleString("de-DE");

function InventoryPage() {
  const inv = useInventory();
  const wallet = useWallet();
  const [selected, setSelected] = useState<string[]>([]);

  const list = inv.items
    .map((i) => ({ uid: i.uid, skin: SKIN_BY_ID[i.skinId] }))
    .filter((x): x is { uid: string; skin: Skin } => Boolean(x.skin))
    .sort((a, b) => b.skin.value - a.skin.value);
  const total = list.reduce((s, x) => s + x.skin.value, 0);

  const picked = list.filter((x) => selected.includes(x.uid));
  const pickedValue = sellPrice(picked.map((x) => x.skin.id));

  const toggle = (uid: string) =>
    setSelected((prev) => (prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]));

  const sell = (items: { uid: string; skin: Skin }[]) => {
    if (!items.length) return;
    const amount = sellPrice(items.map((x) => x.skin.id));
    inv.remove(items.map((x) => x.uid));
    wallet.earn(amount);
    setSelected([]);
    sfx.win();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl">
            <Backpack className="h-7 w-7 text-gold" /> Inventar
          </h1>
          <p className="mt-2 flex items-center gap-1 text-muted-foreground">
            {list.length} Skins · <Robux className="h-4 w-4" /> {fmt(total)}
          </p>
        </div>
        {list.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {selected.length > 0 ? (
              <Button variant="chip" onClick={() => setSelected([])}>
                <X /> Abwählen
              </Button>
            ) : (
              <Button variant="chip" onClick={() => setSelected(list.map((x) => x.uid))}>
                <CheckSquare /> Alle auswählen
              </Button>
            )}
            <Button variant="gold" disabled={!picked.length} onClick={() => sell(picked)}>
              <Coins />
              {picked.length ? (
                <>
                  {picked.length} verkaufen für <Robux className="h-4 w-4" /> {fmt(pickedValue)}
                </>
              ) : (
                "Skins auswählen zum Verkaufen"
              )}
            </Button>
          </div>
        )}
      </div>

      {inv.ready && list.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-border p-10 text-center text-muted-foreground">
          Noch leer – öffne ein Case.
        </div>
      ) : (
        <>
          <p className="mt-4 text-xs text-muted-foreground">Tippe auf Skins, um sie auszuwählen.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {list.map((x) => (
              <SkinCard
                key={x.uid}
                skin={x.skin}
                active={selected.includes(x.uid)}
                onClick={() => toggle(x.uid)}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
