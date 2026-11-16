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
