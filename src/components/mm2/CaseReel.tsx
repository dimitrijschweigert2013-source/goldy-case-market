import { useCallback, useRef, useState } from "react";
import { SkinCard } from "./SkinCard";
import { rollDrop, type CaseDef } from "@/lib/cases";
import type { Skin } from "@/lib/skins";
import { sfx } from "@/lib/sound";

export const ITEM_W = 132;
const REEL_LEN = 50;
const WIN_INDEX = 42;
export const REEL_MS = 5000;

/** State for one horizontal case reel; `spin(prize)` lines the prize up under the marker. */
export function useCaseReel(c: CaseDef) {
  const [reel, setReel] = useState<Skin[]>(() => Array.from({ length: REEL_LEN }, () => rollDrop(c.drops, Math.random())));
  const [offset, setOffset] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  const spin = useCallback(
    (prize: Skin) => {
      setOffset(0);
      setSpinning(false);
      setReel(Array.from({ length: REEL_LEN }, (_, i) => (i === WIN_INDEX ? prize : rollDrop(c.drops, Math.random()))));
      const w = viewport.current?.clientWidth ?? 800;
      const jitter = (Math.random() - 0.5) * (ITEM_W * 0.7);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setSpinning(true);
          setOffset(WIN_INDEX * ITEM_W + ITEM_W / 2 - w / 2 + jitter);
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
        }),
      );
      return new Promise<void>((res) =>
        setTimeout(() => {
          setSpinning(false);
          res();
        }, REEL_MS + 100),
      );
    },
    [c],
  );

  const view = (
    <div ref={viewport} className="relative w-full overflow-hidden rounded-md border border-border bg-surface py-3">
      <div className="absolute inset-y-0 left-1/2 z-10 w-0.5 -translate-x-1/2 bg-pointer shadow-[0_0_12px_var(--pointer)]" />
      <div
        ref={strip}
        className="flex"
        style={{
          transform: `translateX(${-offset}px)`,
          transition: spinning ? `transform ${REEL_MS}ms cubic-bezier(0.12, 0.75, 0.1, 1)` : "none",
        }}
      >
        {reel.map((s, i) => (
          <div key={i} className="shrink-0 px-1" style={{ width: ITEM_W }}>
            <SkinCard skin={s} />
          </div>
        ))}
      </div>
    </div>
  );

  return { spin, spinning, view };
}
