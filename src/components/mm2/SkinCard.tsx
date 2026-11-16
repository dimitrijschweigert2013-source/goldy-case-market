import { Check, Crosshair, Sword } from "lucide-react";
import { cn } from "@/lib/utils";
import { Robux } from "@/components/mm2/Robux";
import { TIER_LABEL, type Skin } from "@/lib/skins";
import { useLang } from "@/lib/i18n";

type Props = {
  skin: Skin;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
};

export function SkinCard({ skin, active, disabled, onClick, badge }: Props) {
  const { fmt } = useLang();
  const Comp = onClick ? "button" : "div";
  const KindIcon = skin.kind === "Waffe" ? Crosshair : Sword;
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      disabled={disabled}
      data-tier={skin.tier}
      className={cn(
        "skin-card group flex w-full flex-col overflow-hidden text-left",
        onClick && "cursor-pointer",
        active && "skin-card-active",
        disabled && "cursor-not-allowed opacity-35",
      )}
    >
      <div className="skin-glow relative grid aspect-[5/4] place-items-center">
        <img
          src={skin.image}
          alt={skin.name}
          loading="lazy"
          width={256}
          height={256}
          className="h-[82%] w-[82%] object-contain drop-shadow-[0_6px_8px_rgb(0_0_0/0.45)] transition-transform duration-200 group-hover:scale-105"
        />
        <KindIcon className="absolute left-1.5 top-1.5 h-3 w-3 text-muted-foreground" />
        {active && (
          <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-sm bg-gold text-primary-foreground">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
        {badge && !active && <span className="absolute right-1.5 top-1.5">{badge}</span>}
      </div>
      <div className="flex flex-col px-2 pb-2 pt-1">
        <span className="tier-text text-[10px] font-semibold uppercase tracking-wider">
          {TIER_LABEL[skin.tier]}
        </span>
        <span className="truncate text-[13px] font-semibold leading-tight">{skin.name}</span>
        <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-gold">
          <Robux className="h-3 w-3" />
          {fmt(skin.value)}
        </span>
      </div>
    </Comp>
  );
}
