"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { animations } from "@/content/animations";
import { moduleBySlug, modules, paths } from "@/content/modules";
import { moduleIcons } from "@/components/shell/icons";
import { resetProgress, useProgress } from "@/lib/progress";

const learnable = modules.filter((m) => m.slug !== "dashboard");

export function Dashboard() {
  const progress = useProgress();
  const [pathId, setPathId] = useState(paths[1].id);
  const path = paths.find((p) => p.id === pathId)!;

  const doneCount = learnable.filter((m) => progress.modules[m.slug]).length;
  const pathModules = path.steps.flatMap((s) => s.modules);
  const nextSlug = pathModules.find((s) => !progress.modules[s]);
  const nextMod = nextSlug ? moduleBySlug[nextSlug] : undefined;
  const quizScores = Object.values(progress.quizzes);
  const quizAvg = quizScores.length ? Math.round((quizScores.reduce((a, b) => a + b, 0) / quizScores.length) * 100) : null;
  const animPlayed = animations.filter((a) => progress.animations[a.id]).length;

  return (
    <div className="flex flex-col gap-12">
      {/* Start here */}
      <section aria-labelledby="start" className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4 rounded-2xl border border-rule bg-panel p-6 sm:p-8">
          <h2 id="start" className="text-sm font-medium text-accent">
            {doneCount === 0 ? "Start here" : "Pick up where you left off"}
          </h2>
          {nextMod ? (
            <>
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {nextMod.number}. {nextMod.title}
              </p>
              <p className="prose-qc text-muted">{nextMod.summary}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={nextMod.href}
                  className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-ink hover:opacity-90"
                >
                  Open {nextMod.title}
                </Link>
                <span className="text-sm text-muted">
                  About {nextMod.minutes} minutes
                  {nextMod.status === "building" && ", content in progress"}
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold">You&rsquo;ve finished the {path.title.toLowerCase()}.</p>
              <Link href="/opportunities" className="text-accent underline">
                Build your CEO brief
              </Link>
            </>
          )}
        </div>

        <dl className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          {[
            ["Modules complete", `${doneCount} of ${learnable.length}`],
            ["Animations played", `${animPlayed} of 12`],
            ["Quiz average", quizAvg === null ? "No quizzes yet" : `${quizAvg}%`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-rule bg-panel px-4 py-3">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="text-lg font-semibold tabular-nums sm:text-xl">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Learning paths */}
      <section aria-labelledby="paths" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="paths" className="text-xl font-semibold">
            Learning paths
          </h2>
          <div role="radiogroup" aria-label="Choose a path" className="flex rounded-lg border border-rule p-0.5">
            {paths.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={p.id === pathId}
                onClick={() => setPathId(p.id)}
                className={`rounded-md px-3 py-1.5 text-sm ${p.id === pathId ? "bg-accent-soft font-medium text-ink" : "text-muted"}`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
        <p className="prose-qc text-muted">{path.description}</p>
        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {path.steps.map((step) => (
            <li key={step.label} className="rounded-xl border border-rule bg-panel p-4">
              <p className="font-semibold">{step.label}</p>
              <p className="text-sm text-muted">About {step.hours} hours</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {step.modules.map((s) => {
                  const m = moduleBySlug[s];
                  const done = progress.modules[s];
                  return (
                    <li key={s}>
                      <Link href={m.href} className="flex items-center gap-2 hover:text-accent">
                        {done ? (
                          <CircleCheck aria-label="Completed" className="size-4 text-risk-green" />
                        ) : (
                          <span aria-hidden className="size-4 rounded-full border-[1.5px] border-rule" />
                        )}
                        {m.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* All modules */}
      <section aria-labelledby="all" className="flex flex-col gap-4">
        <h2 id="all" className="text-xl font-semibold">
          All modules
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {learnable.map((m) => {
            const Icon = moduleIcons[m.icon];
            const done = progress.modules[m.slug];
            return (
              <li key={m.slug}>
                <Link
                  href={m.href}
                  className="flex h-full gap-3 rounded-xl border border-rule bg-panel p-4 hover:border-accent"
                >
                  {Icon && <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />}
                  <span className="flex flex-col gap-1">
                    <span className="font-semibold">
                      {m.number}. {m.title}
                    </span>
                    <span className="text-sm text-muted">{m.summary}</span>
                    <span className="mt-1 text-xs text-muted">
                      {done ? "Completed" : m.status === "ready" ? `${m.minutes} min` : "Content in progress"}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear all progress, quiz scores and played animations on this device?")) resetProgress();
          }}
          className="text-sm text-muted underline hover:text-risk-red"
        >
          Reset progress on this device
        </button>
      </div>
    </div>
  );
}
