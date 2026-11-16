import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Small rectangular country flag for the language picker. */
export function Flag({ lang, className }: { lang: Lang; className?: string }) {
  const cls = cn("h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-border", className);
  if (lang === "de")
    return (
      <svg viewBox="0 0 5 3" className={cls} aria-hidden="true">
        <rect width="5" height="1" y="0" fill="#000" />
        <rect width="5" height="1" y="1" fill="#DD0000" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
      </svg>
    );
  if (lang === "ru")
    return (
      <svg viewBox="0 0 9 6" className={cls} aria-hidden="true">
        <rect width="9" height="2" y="0" fill="#fff" />
        <rect width="9" height="2" y="2" fill="#0039A6" />
        <rect width="9" height="2" y="4" fill="#D52B1E" />
      </svg>
    );
  return (
    <svg viewBox="0 0 60 30" className={cls} aria-hidden="true">
      <clipPath id="uk-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="uk-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#uk-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
