"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { animationById } from "@/content/animations";
import { comparisons } from "@/content/comparisons";
import { ComparisonRace } from "@/components/anim/ComparisonRace";
import { ClaimList } from "@/components/ui/Claims";
import { FitBox, GoDeeper } from "@/components/ui/Blocks";
import { MiniQuiz } from "@/components/ui/MiniQuiz";

// Pair 1 doubles as required animation #11 (SWIFT vs stablecoin race).
const animFor: Record<string, string> = { "cross-border": "swift-vs-stablecoin" };

export function OldVsNew() {
  const [activeId, setActiveId] = useState(comparisons[0].id);

  // Deep links like /old-vs-new#settlement select a pair.
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.slice(1);
      if (comparisons.some((c) => c.id === h)) setActiveId(h);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = (id: string) => {
    setActiveId(id);
    history.replaceState(null, "", `#${id}`);
  };

  const c = comparisons.find((x) => x.id === activeId) ?? comparisons[0];
  const anim = animationById[animFor[c.id]];

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Comparisons" className="flex gap-2 overflow-x-auto pb-1">
        {comparisons.map((x, i) => (
          <button
            key={x.id}
            id={`tab-${x.id}`}
            role="tab"
            type="button"
            aria-selected={x.id === c.id}
            aria-controls={`panel-${x.id}`}
            tabIndex={x.id === c.id ? 0 : -1}
            onClick={() => select(x.id)}
            onKeyDown={(e) => {
              const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!dir) return;
              const nextIdx = (i + dir + comparisons.length) % comparisons.length;
              select(comparisons[nextIdx].id);
              document.getElementById(`tab-${comparisons[nextIdx].id}`)?.focus();
            }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium ${
              x.id === c.id ? "border-accent bg-accent text-accent-ink" : "border-rule text-muted hover:text-ink"
            }`}
          >
            {i + 1}. {x.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={c.id}
          id={`panel-${c.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${c.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{c.title}</h2>
            <p className="prose-qc mt-1 text-lg text-muted">{c.question}</p>
          </div>

          {anim && (
            <div className="prose-qc">
              <p className="font-medium">{anim.caption}</p>
              <p className="mt-1 text-muted">
                <span className="font-semibold text-ink">Why it matters for business: </span>
                {anim.whyItMatters}
              </p>
            </div>
          )}

          <ComparisonRace key={c.id} comparison={c} animId={anim?.id ?? `race-${c.id}`} />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">Side-by-side summary</caption>
              <thead>
                <tr className="border-b border-rule text-sm text-muted">
                  <th scope="col" className="w-36 py-2 pr-4 font-medium" />
                  <th scope="col" className="py-2 pr-4 font-medium text-old">
                    {c.old.title}
                  </th>
                  <th scope="col" className="py-2 font-medium text-new">
                    {c.next.title}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["Time", c.old.time, c.next.time],
                    ["Cost", c.old.cost, c.next.cost],
                    ["Intermediaries", c.old.intermediaries, c.next.intermediaries],
                    [
                      "Failure points",
                      c.old.hops.filter((h) => h.failure).length,
                      c.next.hops.filter((h) => h.failure).length,
                    ],
                  ] as const
                ).map(([k, a, b]) => (
                  <tr key={k} className="border-b border-rule align-top">
                    <th scope="row" className="py-3 pr-4 font-medium">
                      {k}
                    </th>
                    <td className="py-3 pr-4">{a}</td>
                    <td className="py-3">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {c.claims.length > 0 && (
            <section aria-label="Sourced facts" className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold">The facts behind it</h3>
              <ClaimList claims={c.claims} />
            </section>
          )}

          <FitBox fits={c.fits} doesNotFit={c.doesNotFit} />

          <GoDeeper>
            <p>{c.goDeeper}</p>
          </GoDeeper>

          <div className="grid gap-4 lg:grid-cols-2">
            {anim && <MiniQuiz id={anim.id} title="Race check" questions={anim.quiz} />}
            <MiniQuiz id={`old-vs-new:${c.id}`} questions={c.quiz} />
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
