import { Pointer } from "./Pointer";
import type { Skin } from "@/lib/skins";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

type Props = {
  chance: number;
  rotation: number;
  spinning: boolean;
  target: Skin | undefined;
  result: "win" | "lose" | null;
  spinMs: number;
};

const R = 45;
const C = 2 * Math.PI * R;

/** Fixed ring with the win zone; the pointer travels around the outside of it. */
export function UpgradeWheel({ chance, rotation, spinning, target, result, spinMs }: Props) {
  const { t } = useLang();
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {/* track */}
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--border)" strokeWidth="2.2" />
        {/* win zone, starts at top and runs clockwise */}
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="var(--win)"
          strokeWidth="2.2"
          strokeDasharray={`${chance * C} ${C}`}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.3s ease" }}
        />
        {/* fine inner scale */}
        {Array.from({ length: 72 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1={50 - R + 3}
            x2="50"
            y2={50 - R + (i % 6 === 0 ? 5.5 : 4)}
            stroke="var(--muted-foreground)"
            strokeOpacity={i % 6 === 0 ? 0.5 : 0.22}
            strokeWidth="0.35"
            transform={`rotate(${i * 5} 50 50)`}
          />
        ))}
      </svg>

      {/* pointer orbit: the whole layer rotates, the arrow sits at its top and points at the ring */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          transform: `rotate(${rotation}deg)`,
          // slows down early, then creeps for a long time so the stop is hard to call
          transition: spinning ? `transform ${spinMs}ms cubic-bezier(0.08, 0.82, 0.03, 1)` : "none",
          willChange: "transform",
        }}
      >
        <Pointer className="absolute left-1/2 top-[-0.5%] h-9 w-[30px] -translate-x-1/2" />
      </div>

      <div className="absolute inset-[16%] flex flex-col items-center justify-center rounded-full text-center">
        {target ? (
          <>
            <img
              src={target.image}
              alt={target.name}
              width={256}
              height={256}
              className="h-[46%] w-[46%] object-contain drop-shadow-[0_8px_12px_rgb(0_0_0/0.5)]"
            />
            <div
              key={result ?? "idle"}
              className={cn(
                "mt-1 font-display text-3xl font-bold tabular-nums",
                result && "animate-pop-in",
                result === "win" ? "text-win" : result === "lose" ? "text-lose" : "text-foreground",
              )}
            >
              {result === "win"
                ? t("wheel.won")
                : result === "lose"
                  ? t("wheel.lost")
                  : `${(chance * 100).toFixed(2)}%`}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {result ? target.name : t("up.chance")}
            </div>
          </>
        ) : (
          <div className="px-6 text-xs text-muted-foreground">
            {t("wheel.hint")}
          </div>
        )}
      </div>
    </div>
  );
}
