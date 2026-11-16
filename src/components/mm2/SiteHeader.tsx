import { Link } from "@tanstack/react-router";
import { ArrowUpCircle, Backpack, Box, ChevronDown } from "lucide-react";
import logo from "@/assets/mysterydrop-logo.webp";
import { Robux } from "./Robux";
import { Flag } from "./Flag";
import { useWallet } from "@/hooks/use-wallet";
import { LANGS, useLang } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { balance } = useWallet();
  const { lang, setLang, t, fmt } = useLang();
  const linkCls =
    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const active = { className: "bg-secondary text-foreground" };
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="MysteryDrop Logo" width={40} height={40} className="h-10 w-10" />
          <span className="hidden font-display text-lg font-bold tracking-wide sm:inline">
            Mystery<span className="text-pointer">Drop</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/cases" className={linkCls} activeProps={active}>
            <Box className="h-4 w-4" /> <span className="hidden sm:inline">{t("nav.cases")}</span>
          </Link>
          <Link to="/" className={linkCls} activeProps={active} activeOptions={{ exact: true }}>
            <ArrowUpCircle className="h-4 w-4" /> <span className="hidden sm:inline">{t("nav.upgrader")}</span>
          </Link>
          <Link to="/inventar" className={linkCls} activeProps={active}>
            <Backpack className="h-4 w-4" /> <span className="hidden sm:inline">{t("nav.inventory")}</span>
          </Link>
          <span className="ml-2 flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1.5 font-display text-sm font-semibold tabular-nums text-robux">
            <Robux className="h-4 w-4" /> {fmt(balance)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={t("nav.language")}
              className="ml-1 flex items-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
        </nav>
      </div>
    </header>
  );
}
