"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MotionConfig } from "motion/react";
import { Sidebar } from "./Sidebar";
import { SearchPalette } from "./SearchPalette";
import { ThemeToggle } from "./ThemeToggle";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
      {/* Original mark: a chain link crossed by a wave, for chain + quantum. */}
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <rect x="3" y="9" width="15" height="14" rx="7" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        <rect x="14" y="9" width="15" height="14" rx="7" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
        <path d="M2 16c3-5 6-5 9 0s6 5 9 0 6-5 9 0" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      </svg>
      <span>QuantumChain Academy</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-panel focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <aside className="no-print sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-rule bg-panel lg:block">
        <div className="px-5 pb-2 pt-5">
          <Brand />
        </div>
        <Sidebar />
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[min(20rem,85vw)] overflow-y-auto bg-panel">
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <Brand />
              <button type="button" aria-label="Close navigation" onClick={() => setDrawer(false)} className="p-2">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <Sidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-30 flex items-center gap-3 border-b border-rule bg-bg/90 px-4 py-2.5 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setDrawer(true)}
            className="rounded-lg p-1.5 lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <div className="flex-1">
            <SearchPalette />
          </div>
          <ThemeToggle />
        </header>

        <main id="main" className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
          {children}
        </main>

        <footer className="border-t border-rule px-4 py-5 text-sm text-muted sm:px-8 lg:px-12">
          Educational material only. Not legal, political or investment advice. Facts carry a source link and the
          date they were last checked.
        </footer>
      </div>
    </div>
    </MotionConfig>
  );
}
