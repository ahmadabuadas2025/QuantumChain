"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { modules } from "@/content/modules";
import { useProgress } from "@/lib/progress";
import { moduleIcons } from "./icons";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const progress = useProgress();

  return (
    <nav aria-label="Modules" className="flex flex-col gap-0.5 p-3">
      {modules.map((m) => {
        const Icon = moduleIcons[m.icon];
        const active = m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
        const done = progress.modules[m.slug];
        return (
          <Link
            key={m.slug}
            href={m.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[0.95rem] transition-colors ${
              active ? "bg-accent-soft text-ink font-medium" : "text-muted hover:bg-panel-2 hover:text-ink"
            }`}
          >
            <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted">{m.number}</span>
            {Icon && <Icon aria-hidden className={`size-4 shrink-0 ${active ? "text-accent" : ""}`} />}
            <span className="flex-1 leading-snug">{m.title}</span>
            {done ? (
              <CircleCheck aria-label="Completed" className="size-4 shrink-0 text-risk-green" />
            ) : m.status === "building" ? (
              <span className="text-[0.7rem] text-muted" title="Content in progress">
                soon
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
