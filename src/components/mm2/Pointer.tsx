import { cn } from "@/lib/utils";

/** Slim two-tone pointer that sits on the ring and points at it. */
export function Pointer({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" preserveAspectRatio="none" className={cn("drop-shadow-lg", className)} aria-hidden="true">
      <polygon points="10,6 30,22 30,94" fill="var(--pointer-deep)" />
      <polygon points="30,22 50,6 30,94" fill="var(--pointer)" />
      <polygon
        points="10,6 30,22 50,6 30,94"
        fill="none"
        stroke="var(--outline-ink)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small triangle marker for the case reel; `dir="down"` sits on top, `dir="up"` at the bottom. */
export function ReelMarker({ dir, className }: { dir: "down" | "up"; className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={cn("drop-shadow-[0_0_6px_var(--pointer)]", className)} aria-hidden="true">
      <polygon
        points={dir === "down" ? "2,2 22,2 12,14" : "2,14 22,14 12,2"}
        fill="var(--pointer)"
        stroke="var(--outline-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
