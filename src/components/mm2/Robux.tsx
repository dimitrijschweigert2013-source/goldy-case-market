import { cn } from "@/lib/utils";

/** Robux coin icon (hexagon with a square hole), sized like a lucide icon. */
export function Robux({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("inline-block shrink-0", className)} aria-label="Robux">
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M12 1.5 21.1 6.75v10.5L12 22.5 2.9 17.25V6.75L12 1.5Zm0 3.1L5.6 8.3v7.4l6.4 3.7 6.4-3.7V8.3L12 4.6Zm-3 4.4h6v6H9V9Z"
      />
    </svg>
  );
}
