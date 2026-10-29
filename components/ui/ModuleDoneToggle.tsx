"use client";

import { Check } from "lucide-react";
import { setModuleDone, useProgress } from "@/lib/progress";

export function ModuleDoneToggle({ slug }: { slug: string }) {
  const done = !!useProgress().modules[slug];
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() => setModuleDone(slug, !done)}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium ${
        done ? "border border-risk-green text-risk-green" : "bg-accent text-accent-ink hover:opacity-90"
      }`}
    >
      {done && <Check aria-hidden className="size-4" />}
      {done ? "Completed" : "Mark module complete"}
    </button>
  );
}
