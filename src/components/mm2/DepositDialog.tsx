import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bitcoin, Gift, Search, Sword, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Robux } from "./Robux";
import { SkinCard } from "./SkinCard";
import { useWallet } from "@/hooks/use-wallet";
import { usePromo } from "@/hooks/use-promo";
import { useLang } from "@/lib/i18n";
import { COINS, MIN_DEPOSIT_USD, cryptoDepositRobux, type CoinId } from "@/lib/money";
import { SKINS, SKIN_BY_ID } from "@/lib/skins";
import { sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";

const QUICK_USD = [5, 10, 25, 50, 100];

export function DepositDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useLang();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Wallet className="h-5 w-5 text-pointer" /> {t("dep.title")}
          </DialogTitle>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Robux className="h-3.5 w-3.5 text-robux" /> {t("dep.rate")}
          </p>
        </DialogHeader>
        <Tabs defaultValue="crypto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="crypto" className="gap-1.5">
              <Bitcoin className="h-4 w-4 shrink-0" /> {t("dep.tabCrypto")}
            </TabsTrigger>
            <TabsTrigger value="skins" className="gap-1.5">
              <Sword className="h-4 w-4 shrink-0" /> {t("dep.tabSkins")}
            </TabsTrigger>
            <TabsTrigger value="promo" className="gap-1.5">
              <Gift className="h-4 w-4 shrink-0" /> {t("dep.tabPromo")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="crypto">
            <CryptoTab />
          </TabsContent>
          <TabsContent value="skins">
            <SkinsTab />
          </TabsContent>
          <TabsContent value="promo">
            <PromoTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function CryptoTab() {
  const { t, fmt } = useLang();
  const wallet = useWallet();
  const [coin, setCoin] = useState<CoinId>("btc");
  const [usd, setUsd] = useState("10");
  const robux = cryptoDepositRobux(Number(usd.replace(",", ".")));
  const coinName = COINS.find((c) => c.id === coin)!.symbol;

  const pay = () => {
    if (!robux) return;
    wallet.earn(robux);
    sfx.win();
    toast.success(`${t("dep.success")}: +${fmt(robux)} Robux`);
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dep.coin")}</div>
        <div className="grid grid-cols-5 gap-2">
          {COINS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCoin(c.id)}
              className={cn("skin-card flex flex-col items-center gap-0.5 px-2 py-2.5", coin === c.id && "skin-card-active")}
            >
              <span className="font-display text-sm font-bold">{c.symbol}</span>
              <span className="text-[10px] text-muted-foreground">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dep.amount")}</div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_USD.map((n) => (
            <Button key={n} size="sm" variant="chip" className={cn(Number(usd) === n && "border-gold text-foreground")} onClick={() => setUsd(String(n))}>
              ${n}
            </Button>
          ))}
        </div>
        <Input
          inputMode="decimal"
          value={usd}
          onChange={(e) => setUsd(e.target.value)}
          className="mt-2 h-11 font-display text-lg"
          aria-label={t("dep.amount")}
        />
        <p className="mt-1 text-xs text-muted-foreground">{t("dep.min", { n: `$${MIN_DEPOSIT_USD}` })}</p>
      </div>
      <div className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3">
        <span className="text-sm text-muted-foreground">{t("dep.youGet")}</span>
        <span className="flex items-center gap-1 font-display text-xl font-bold text-robux">
          <Robux className="h-5 w-5" /> {fmt(robux)}
        </span>
      </div>
      <Button variant="gold" size="xl" disabled={!robux} onClick={pay}>
        {t("dep.payWith", { coin: coinName })}
      </Button>
    </div>
  );
}

function SkinsTab() {
  const { t, fmt } = useLang();
  const wallet = useWallet();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...SKINS].reverse().filter((s) => (q ? s.name.toLowerCase().includes(q) : true));
  }, [query]);
  const total = picked.reduce((sum, id) => sum + (SKIN_BY_ID[id]?.value ?? 0), 0);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const deposit = () => {
    if (!total) return;
    wallet.earn(total);
    setPicked([]);
    sfx.win();
    toast.success(`${t("dep.success")}: +${fmt(total)} Robux`);
  };

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{t("dep.skinsHint")}</p>
        <div className="relative w-40 shrink-0">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("up.search")} className="h-8 pl-8 text-sm" />
        </div>
      </div>
      <div className="scrollbar-thin grid max-h-[320px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-5">
        {list.map((s) => (
          <SkinCard key={s.id} skin={s} active={picked.includes(s.id)} onClick={() => toggle(s.id)} />
        ))}
      </div>
      <Button variant="gold" size="xl" disabled={!total} onClick={deposit}>
        {picked.length ? (
          <>
            {t("dep.depositSkins")} · <Robux className="h-5 w-5" /> {fmt(total)}
          </>
        ) : (
          t("dep.pickSkins")
        )}
      </Button>
      {picked.length > 0 && <p className="-mt-1 text-center text-xs text-muted-foreground">{t("dep.skinsSelected", { n: picked.length })}</p>}
    </div>
  );
}

function PromoTab() {
  const { t, fmt } = useLang();
  const wallet = useWallet();
  const promo = usePromo();
  const [code, setCode] = useState("");

  const redeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const res = promo.redeem(code);
    if (res.ok) {
      wallet.earn(res.amount);
      setCode("");
      sfx.win();
      toast.success(`${t("promo.ok")} +${fmt(res.amount)} Robux`);
    } else {
      toast.error(res.reason === "used" ? t("promo.used") : t("promo.unknown"));
    }
  };

  return (
    <form onSubmit={redeem} className="flex flex-col gap-3 pt-2">
      <p className="text-sm text-muted-foreground">{t("promo.hint")}</p>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("promo.placeholder")}
          className="h-11 font-display text-lg uppercase tracking-widest"
          aria-label={t("promo.placeholder")}
        />
        <Button type="submit" variant="gold" className="h-11 px-6" disabled={!code.trim()}>
          {t("promo.redeem")}
        </Button>
      </div>
    </form>
  );
}
