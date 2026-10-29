"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { markAnimationPlayed } from "@/lib/progress";

// Shared engine for every animation. Time `t` runs 0..total in the animation's own
// units (simulated minutes, steps, years...). `events` are the meaningful moments
// that Step forward/back jumps between.

export interface TimelineOptions {
  id: string;
  total: number;
  events: number[];
  /** Wall-clock length of a full play at normal speed. */
  durationMs?: number;
  /** Slow mode multiplies the duration by this. */
  slowFactor?: number;
}

export interface Timeline {
  t: number;
  playing: boolean;
  slow: boolean;
  reduced: boolean;
  done: boolean;
  /** Index of the last event reached, -1 before the first. */
  eventIndex: number;
  events: number[];
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  replay: () => void;
  toggleSlow: () => void;
  seekEvent: (i: number) => void;
}

export function useTimeline({ id, total, events, durationMs = 9000, slowFactor = 2.5 }: TimelineOptions): Timeline {
  const reduced = !!useReducedMotion();
  const [t, setTState] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  // Mirror of t for the playback loop, updated wherever t changes.
  const tRef = useRef(0);
  const setT = useCallback((v: number) => {
    tRef.current = v;
    setTState(v);
  }, []);

  const sorted = [...new Set(events)].filter((e) => e > 0 && e <= total).sort((a, b) => a - b);
  if (sorted[sorted.length - 1] !== total) sorted.push(total);

  const done = t >= total;
  const eventIndex = sorted.reduce((acc, e, i) => (t >= e ? i : acc), -1);

  // Continuous playback, or event-to-event hops when the user prefers reduced motion.
  useEffect(() => {
    if (!playing) return;
    const ms = durationMs * (slow ? slowFactor : 1);
    if (reduced) {
      const timer = window.setInterval(() => {
        const next = sorted.find((e) => e > tRef.current + 1e-9);
        if (next === undefined) {
          setPlaying(false);
          return;
        }
        setT(next);
      }, 1400 * (slow ? slowFactor : 1));
      return () => window.clearInterval(timer);
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const next = Math.min(total, tRef.current + (dt / ms) * total);
      setT(next);
      if (next >= total) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // sorted is derived from events/total; listing them keeps the effect stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, slow, reduced, total, durationMs, slowFactor, events.join(",")]);

  useEffect(() => {
    if (done) markAnimationPlayed(id);
  }, [done, id]);

  const play = useCallback(() => {
    if (tRef.current >= total) setT(0);
    setPlaying(true);
  }, [total, setT]);
  const pause = useCallback(() => setPlaying(false), []);

  const stepForward = () => {
    setPlaying(false);
    const next = sorted.find((e) => e > t + 1e-9);
    setT(next ?? total);
  };
  const stepBack = () => {
    setPlaying(false);
    const prev = [0, ...sorted].filter((e) => e < t - 1e-9).pop();
    setT(prev ?? 0);
  };
  const replay = () => {
    setT(0);
    setPlaying(true);
  };
  const seekEvent = (i: number) => {
    setPlaying(false);
    setT(i < 0 ? 0 : sorted[Math.min(i, sorted.length - 1)]);
  };

  return {
    t,
    playing,
    slow,
    reduced,
    done,
    eventIndex,
    events: sorted,
    play,
    pause,
    stepForward,
    stepBack,
    replay,
    toggleSlow: () => setSlow((s) => !s),
    seekEvent,
  };
}
