import type { CaseDef } from "@/lib/cases";
import { cn } from "@/lib/utils";

const POSES = [
  { left: "50%", bottom: "40%", size: "50%", r: "20deg", delay: "0s", z: 3 },
  { left: "26%", bottom: "38%", size: "40%", r: "-20deg", delay: "0.4s", z: 2 },
  { left: "74%", bottom: "38%", size: "40%", r: "20deg", delay: "0.8s", z: 2 },
];

/** Open box with glowing rays and its top 3 skins floating above it, tilted and fully visible. */
export function CaseArt({ c, className }: { c: CaseDef; className?: string }) {
  const top = c.drops.slice(0, 3).map((d) => d.skin);
  return (
    <div data-tier={c.tier} className={cn("relative aspect-square w-full", className)}>
      <div className="case-rays absolute inset-[-10%] rounded-full" />
      <div className="case-glow absolute inset-[18%] rounded-full blur-xl" />
      {/* back of the box */}
      <img src={c.image} alt={c.name} className="absolute inset-[12%] h-[76%] w-[76%] object-contain" />
      {/* skins floating out, never cut off */}
      {top.map((s, i) => {
        const p = POSES[i] ?? POSES[0]!;
        return (
          <img
            key={s.id}
            src={s.image}
            alt={s.name}
            className="case-float absolute -translate-x-1/2 object-contain drop-shadow-[0_6px_10px_rgb(0_0_0/0.6)]"
            style={{
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              zIndex: p.z,
              animationDelay: p.delay,
              ["--r" as string]: p.r,
            }}
          />
        );
      })}
      {[18, 38, 62, 82].map((x, i) => (
        <span
          key={x}
          className="case-spark absolute z-20 h-1.5 w-1.5 rounded-full"
          style={{ left: `${x}%`, top: "48%", animationDelay: `${i * 0.6}s` }}
        />
      ))}
    </div>
  );
}
