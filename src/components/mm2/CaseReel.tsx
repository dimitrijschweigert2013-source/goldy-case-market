import { useCallback, useRef, useState } from "react";
import { SkinCard } from "./SkinCard";
import { ReelMarker } from "./Pointer";
import { rollDrop, type CaseDef } from "@/lib/cases";
import type { Skin } from "@/lib/skins";
import { sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";

export const ITEM_W = 132;
const REEL_LEN = 50;
const WIN_INDEX = 42;
export const REEL_MS = 5000;
/** After the main spin the reel glides so the prize sits exactly in the middle. */
const SETTLE_MS = 450;

/** State for one horizontal case reel; `spin(prize)` lines the prize up under the markers. */
export function useCaseReel(c: CaseDef) {
  const [reel, setReel] = useState<Skin[]>(() => Array.from({ length: REEL_LEN }, () => rollDrop(c.drops, Math.random())));
  const [offset, setOffset] = useState(0);
  const [phase, setPhase] = useState<"idle" | "spin" | "settle" | "done">("idle");
  const viewport = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  const spin = useCallback(
    (prize: Skin) => {
      setOffset(0);
      setPhase("idle");
      setReel(Array.from({ length: REEL_LEN }, (_, i) => (i === WIN_INDEX ? prize : rollDrop(c.drops, Math.random()))));
      const w = viewport.current?.clientWidth ?? 800;
      const center = WIN_INDEX * ITEM_W + ITEM_W / 2 - w / 2;
      // stop a bit off-center first, then glide onto the exact middle of the prize
      const jitter = (Math.random() - 0.5) * (ITEM_W * 0.7);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setPhase("spin");
          setOffset(center + jitter);
          // tick sound each time a new item passes the marker
          const t0 = performance.now();
          let last = 0;
          const loop = () => {
            const el = strip.current;
            if (!el) return;
            const x = -new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
            const idx = Math.floor((x + w / 2) / ITEM_W);
            if (idx !== last) {
              last = idx;
              sfx.tick();
            }
            if (performance.now() - t0 < REEL_MS) requestAnimationFrame(loop);
          };
          requestAnimationFrame(loop);
          setTimeout(() => {
            setPhase("settle");
            setOffset(center);
          }, REEL_MS + 60);
        }),
      );
      return new Promise<void>((res) =>
        setTimeout(() => {
          setPhase("done");
          res();
        }, REEL_MS + SETTLE_MS + 120),
      );
    },
    [c],
  );

  const spinning = phase === "spin" || phase === "settle";
  const transition =
    phase === "spin"
      ? `transform ${REEL_MS}ms cubic-bezier(0.12, 0.75, 0.1, 1)`
      : phase === "settle"
        ? `transform ${SETTLE_MS}ms cubic-bezier(0.3, 0, 0.2, 1)`
        : "none";

  const view = (
    <div ref={viewport} className="relative w-full overflow-hidden rounded-md border border-border bg-surface py-7">
      <ReelMarker dir="down" className="absolute left-1/2 top-0 z-20 h-4 w-6 -translate-x-1/2" />
      <ReelMarker dir="up" className="absolute bottom-0 left-1/2 z-20 h-4 w-6 -translate-x-1/2" />
      <div ref={strip} className="flex" style={{ transform: `translateX(${-offset}px)`, transition }}>
        {reel.map((s, i) => (
          <div
            key={i}
            className={cn(
              "relative shrink-0 px-1 transition-transform duration-300 ease-out",
              phase === "done" && i === WIN_INDEX && "reel-win",
            )}
            style={{ width: ITEM_W }}
          >
            <SkinCard skin={s} active={phase === "done" && i === WIN_INDEX} />
          </div>
        ))}
      </div>
    </div>
  );

  return { spin, spinning, view };
}
