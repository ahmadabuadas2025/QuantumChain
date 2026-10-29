"use client";

import { useSyncExternalStore } from "react";

// Per-viewer progress in localStorage. Every access is wrapped: storage can be
// missing or throw (private mode, blocked site data), and the app must still work.

export interface Progress {
  /** Module slug -> marked complete. */
  modules: Record<string, boolean>;
  /** Animation id -> played to the end at least once. */
  animations: Record<string, boolean>;
  /** Quiz id -> best score as a fraction 0..1. */
  quizzes: Record<string, number>;
}

const KEY = "qc:progress:v1";
const EMPTY: Progress = { modules: {}, animations: {}, quizzes: {} };

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Progress>) : {};
    cache = { ...EMPTY, ...parsed };
  } catch {
    cache = { ...EMPTY };
  }
  return cache;
}

function write(next: Progress) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: progress lives for this session only.
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function setModuleDone(slug: string, done: boolean) {
  const p = read();
  write({ ...p, modules: { ...p.modules, [slug]: done } });
}

export function markAnimationPlayed(id: string) {
  const p = read();
  if (p.animations[id]) return;
  write({ ...p, animations: { ...p.animations, [id]: true } });
}

export function recordQuiz(id: string, score: number) {
  const p = read();
  if ((p.quizzes[id] ?? -1) >= score) return;
  write({ ...p, quizzes: { ...p.quizzes, [id]: score } });
}

export function resetProgress() {
  write({ ...EMPTY });
}
