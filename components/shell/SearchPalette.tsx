"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { buildIndex, search } from "@/lib/search";

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const index = useMemo(() => buildIndex(), []);
  const results = useMemo(() => search(index, query), [index, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      inputRef.current?.focus();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-rule bg-panel px-3 py-1.5 text-sm text-muted hover:text-ink"
      >
        <Search aria-hidden className="size-4" />
        <span className="flex-1 text-left">Search lessons, terms, rules</span>
        <kbd className="hidden rounded border border-rule px-1.5 text-xs sm:inline">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && setOpen(false)}
        aria-label="Search"
        className="mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] rounded-xl border border-rule bg-panel p-0 text-ink shadow-2xl backdrop:bg-black/50"
      >
        <div className="flex items-center gap-2 border-b border-rule px-4">
          <Search aria-hidden className="size-4 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                go(results[active].href);
              }
            }}
            placeholder="Try “T+1”, “ML-KEM” or “Travel Rule”"
            aria-label="Search query"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${active}` : undefined}
            className="w-full bg-transparent py-3 outline-none placeholder:text-muted"
          />
        </div>
        <ul id="search-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {query && results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">
              Nothing matches “{query}”. Try a shorter word or a glossary term.
            </li>
          )}
          {results.map((r, i) => (
            <li
              key={`${r.href}-${r.title}`}
              id={`sr-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r.href)}
              className={`cursor-pointer rounded-lg px-3 py-2 ${i === active ? "bg-accent-soft" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{r.title}</span>
                <span className="text-xs text-muted">{r.kind}</span>
              </div>
              <p className="line-clamp-1 text-sm text-muted">{r.text}</p>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}
