"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY as KEY } from "./theme-boot";

export type ThemeChoice = "system" | "light" | "dark";

const listeners = new Set<() => void>();

function readChoice(): ThemeChoice {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function apply(choice: ThemeChoice) {
  const dark =
    choice === "dark" || (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function setTheme(choice: ThemeChoice) {
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    // Not persisted; still applied for this page view.
  }
  apply(choice);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (readChoice() === "system") apply("system");
    cb();
  };
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", onChange);
  };
}

export function useThemeChoice(): ThemeChoice {
  return useSyncExternalStore(subscribe, readChoice, () => "system");
}
