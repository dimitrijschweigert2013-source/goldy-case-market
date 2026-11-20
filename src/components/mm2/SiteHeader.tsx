import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpCircle, Backpack, Box, ChevronDown, History, Plus } from "lucide-react";
import logo from "@/assets/logo-mascot.webp";
import { Robux } from "./Robux";
import { Flag } from "./Flag";
import { DepositDialog } from "./DepositDialog";
import { useWallet } from "@/hooks/use-wallet";
import { LANGS, useLang, type TKey } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV: { to: "/cases" | "/" | "/inventar" | "/history"; label: TKey; icon: typeof Box; exact?: boolean }[] = [
  { to: "/cases", label: "nav.cases", icon: Box },
  { to: "/", label: "nav.upgrader", icon: ArrowUpCircle, exact: true },
  { to: "/inventar", label: "nav.inventory", icon: Backpack },
  { to: "/history", label: "nav.history", icon: History },
];

export function SiteHeader() {
  const { balance } = useWallet();
  const { lang, setLang, t, fmt } = useLang();
  const [depositOpen, setDepositOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img
              src={logo}
              alt="MysteryDrop"
              width={48}
              height={48}
              className="aspect-square h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
            />
            <span className="hidden font-display text-xl font-bold tracking-wide lg:inline">
              Mystery<span className="text-brand">Drop</span>
            </span>
          </Link>

          {/* Desktop / tablet nav */}
          <nav className="hidden h-full items-stretch gap-1 sm:flex">
            {NAV.map(({ to, label, icon: Icon, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: !!exact }}
                className="nav-link flex items-center gap-1.5 px-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "nav-link-active text-foreground" }}
              >
                <Icon className="h-4 w-4" /> {t(label)}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 items-center gap-1">
            <div className="flex items-center overflow-hidden rounded-md border border-border bg-secondary">
              <span className="flex items-center gap-1 px-2 py-1.5 font-display text-sm font-semibold tabular-nums text-robux sm:px-2.5">
                <Robux className="h-4 w-4 shrink-0" /> {fmt(balance)}
              </span>
              <Button variant="gold" size="sm" className="h-8 rounded-none px-2.5 text-xs" onClick={() => setDepositOpen(true)}>
                <Plus /> <span className="hidden md:inline">{t("nav.deposit")}</span>
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={t("nav.language")}
                className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Flag lang={lang} />
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LANGS.map((l) => (
                  <DropdownMenuItem key={l.id} onSelect={() => setLang(l.id)} className={l.id === lang ? "bg-accent" : undefined}>
                    <Flag lang={l.id} /> {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <DepositDialog open={depositOpen} onOpenChange={setDepositOpen} />
      </header>

      {/* Phone nav: fixed tab bar at the bottom */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: !!exact }}
            className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted-foreground"
            activeProps={{ className: "text-gold" }}
          >
            <Icon className="h-5 w-5" />
            {t(label)}
          </Link>
        ))}
      </nav>
    </>
  );
}
