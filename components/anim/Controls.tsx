"use client";

import { Pause, Play, RotateCcw, StepBack, StepForward, Turtle } from "lucide-react";
import type { Timeline } from "./useTimeline";

const btn =
  "inline-flex items-center gap-1.5 rounded-lg border border-rule px-3 py-1.5 text-sm font-medium hover:border-accent disabled:opacity-40 disabled:hover:border-rule";

export function Controls({ tl, labels }: { tl: Timeline; labels?: string[] }) {
  return (
    <div className="flex flex-col gap-3" data-anim-controls>
      <div className="flex flex-wrap items-center gap-2">
        {tl.playing ? (
          <button type="button" className={btn} onClick={tl.pause} data-action="pause">
            <Pause aria-hidden className="size-4" /> Pause
          </button>
        ) : (
          <button
            type="button"
            className={`${btn} border-accent bg-accent text-accent-ink hover:opacity-90`}
            onClick={tl.play}
            data-action="play"
          >
            <Play aria-hidden className="size-4" /> {tl.done ? "Play again" : tl.t > 0 ? "Resume" : "Play"}
          </button>
        )}
        <button type="button" className={btn} onClick={tl.stepBack} disabled={tl.t <= 0} aria-label="Step back">
          <StepBack aria-hidden className="size-4" />
        </button>
        <button type="button" className={btn} onClick={tl.stepForward} disabled={tl.done} data-action="step">
          <StepForward aria-hidden className="size-4" /> Step
        </button>
        <button type="button" className={btn} onClick={tl.replay} data-action="replay">
          <RotateCcw aria-hidden className="size-4" /> Replay
        </button>
        <button
          type="button"
          className={`${btn} ${tl.slow ? "border-accent text-accent" : ""}`}
          onClick={tl.toggleSlow}
          aria-pressed={tl.slow}
        >
          <Turtle aria-hidden className="size-4" /> Slow
        </button>
        {tl.reduced && <span className="text-sm text-muted">Reduced motion is on: playback moves step by step.</span>}
      </div>

      {/* Scrubber: one tick per event, clickable. */}
      <ol className="flex gap-1" aria-label="Animation steps">
        {tl.events.map((e, i) => (
          <li key={e} className="flex-1">
            <button
              type="button"
              onClick={() => tl.seekEvent(i)}
              aria-label={`Go to step ${i + 1}${labels?.[i] ? `: ${labels[i]}` : ""}`}
              aria-current={tl.eventIndex === i ? "step" : undefined}
              className={`block h-1.5 w-full rounded-full ${i <= tl.eventIndex ? "bg-accent" : "bg-rule"}`}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
