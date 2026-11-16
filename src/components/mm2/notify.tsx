import { toast } from "sonner";
import type { Skin } from "@/lib/skins";
import { Robux } from "./Robux";
import { cn } from "@/lib/utils";
import { currentLocale } from "@/lib/i18n";

type Kind = "win" | "lose" | "info";

/** Rich toast with skin image, name and Robux value. */
export function notifySkin(kind: Kind, title: string, skin?: Skin) {
  toast.custom(
    () => (
      <div
        data-tier={skin?.tier}
        className={cn(
          "panel animate-pop-in flex w-[340px] items-center gap-3 overflow-hidden p-3 shadow-2xl",
          kind === "win" && "border-win/60",
          kind === "lose" && "border-lose/60",
        )}
      >
        {skin && (
          <div className="skin-glow flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-surface">
            <img src={skin.image} alt={skin.name} className={cn("h-12 w-12 object-contain", kind === "lose" && "opacity-50 grayscale")} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className={cn("font-display text-sm font-bold uppercase tracking-wider", kind === "win" ? "text-win" : kind === "lose" ? "text-lose" : "text-pointer")}>
            {title}
          </div>
          {skin && (
            <>
              <div className="tier-text truncate font-display font-semibold">{skin.name}</div>
              <div className="flex items-center gap-1 text-xs text-robux">
                <Robux className="h-3.5 w-3.5" /> {skin.value.toLocaleString(currentLocale())}
              </div>
            </>
          )}
        </div>
      </div>
    ),
    { duration: 3500 },
  );
}
