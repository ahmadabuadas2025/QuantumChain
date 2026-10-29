"use client";

import { useId, useState, type ReactNode } from "react";
import { termById } from "@/content/glossary";

/** Inline glossary term with a hover/focus tooltip. Falls back to plain text if unknown. */
export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const t = termById[id];
  const tipId = useId();
  const [open, setOpen] = useState(false);
  if (!t) return <>{children}</>;

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="cursor-help border-b border-dotted border-accent text-inherit"
      >
        {children ?? t.term}
      </button>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg border border-rule bg-panel p-3 text-left text-sm font-normal text-ink shadow-xl"
        >
          <span className="block font-semibold">{t.term}</span>
          {t.short}
        </span>
      )}
    </span>
  );
}
