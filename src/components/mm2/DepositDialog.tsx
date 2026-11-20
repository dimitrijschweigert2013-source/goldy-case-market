import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bitcoin, Clock, Gift, Sword, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Robux } from "./Robux";
import { useWallet } from "@/hooks/use-wallet";
import { usePromo } from "@/hooks/use-promo";
import { logHistory } from "@/hooks/use-history";
import { useLang } from "@/lib/i18n";
import { COINS, MIN_DEPOSIT_EUR, coinsToSend, cryptoDepositRobux, type CoinId } from "@/lib/money";
import { sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";

const QUICK_EUR = [5, 10, 25, 50, 100];

type Rates = Partial<Record<CoinId, number>>;

/** Live euro price per coin from CoinGecko, refreshed every minute. */
function useLiveRates() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const ids = COINS.map((c) => c.gecko).join(",");
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur`);
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as Record<string, { eur?: number }>;
        const next: Rates = {};
        for (const c of COINS) {
          const eur = data[c.gecko]?.eur;
          if (eur) next[c.id] = eur;
        }
        if (alive) {
          setRates(next);
          setFailed(false);
        }
      } catch {
        if (alive) setFailed(true);
      }
    };
    load();
    const timer = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);
  return { rates, failed };
}

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
              <span className="rounded-sm bg-gold/15 px-1 py-px text-[9px] font-bold uppercase leading-none text-gold">{t("dep.soon")}</span>
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
  const { t, fmt, lang } = useLang();
  const wallet = useWallet();
  const { rates, failed } = useLiveRates();
  const [coin, setCoin] = useState<CoinId>("btc");
  const [eur, setEur] = useState("10");
  const amount = Number(eur.replace(",", "."));
  const robux = cryptoDepositRobux(amount);
  const coinInfo = COINS.find((c) => c.id === coin)!;
  const rate = rates?.[coin];
  const send = rate ? coinsToSend(amount, rate) : 0;
  const euro = (n: number, digits = 2) =>
    n.toLocaleString(lang === "en" ? "en-IE" : lang === "de" ? "de-DE" : "ru-RU", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: digits,
    });

  const pay = () => {
    if (!robux) return;
    wallet.earn(robux);
    logHistory({ kind: "deposit", coin: COINS.find((x) => x.id === coin)?.symbol ?? String(coin), amount: robux });
    sfx.coin();
    toast.success(`${t("dep.success")}: +${fmt(robux)} Robux`);
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dep.coin")}</div>
        <div className="grid grid-cols-2 gap-2">
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
          {QUICK_EUR.map((n) => (
            <Button key={n} size="sm" variant="chip" className={cn(amount === n && "border-gold text-foreground")} onClick={() => setEur(String(n))}>
              {euro(n, 0)}
            </Button>
          ))}
        </div>
        <Input
          inputMode="decimal"
          value={eur}
          onChange={(e) => setEur(e.target.value)}
          className="mt-2 h-11 font-display text-lg"
          aria-label={t("dep.amount")}
        />
        <p className="mt-1 text-xs text-muted-foreground">{t("dep.min", { n: euro(MIN_DEPOSIT_EUR, 0) })}</p>
      </div>
      <div className="flex flex-col gap-2 rounded-md border border-border bg-surface px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{t("dep.youSend")}</span>
          <span className="font-display text-lg font-bold tabular-nums">
            {send ? `${send.toFixed(8)} ${coinInfo.symbol}` : "–"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{t("dep.youGet")}</span>
          <span className="flex items-center gap-1 font-display text-xl font-bold text-robux">
            <Robux className="h-5 w-5" /> {fmt(robux)}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {rate
            ? t("dep.livePrice", { coin: coinInfo.symbol, eur: euro(rate) })
            : failed
              ? t("dep.priceError")
              : t("dep.priceLoading")}
        </p>
      </div>
      <Button variant="gold" size="xl" disabled={!robux} onClick={pay}>
        {t("dep.payWith", { coin: coinInfo.symbol })}
      </Button>
    </div>
  );
}

function SkinsTab() {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <Clock className="h-10 w-10 text-gold" />
      <div className="font-display text-2xl font-bold uppercase tracking-wider">{t("dep.skinsSoonTitle")}</div>
      <p className="text-sm text-muted-foreground">{t("dep.skinsSoon")}</p>
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
      logHistory({ kind: "promo", code: code.trim().toUpperCase(), amount: res.amount });
      setCode("");
      sfx.coin();
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
