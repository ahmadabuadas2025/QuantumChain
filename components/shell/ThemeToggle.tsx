"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { setTheme, useThemeChoice, type ThemeChoice } from "@/lib/theme";

const options: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "system", label: "Match system theme", Icon: Monitor },
  { value: "dark", label: "Dark theme", Icon: Moon },
];

export function ThemeToggle() {
  const choice = useThemeChoice();
  return (
    <div role="radiogroup" aria-label="Colour theme" className="flex rounded-lg border border-rule p-0.5">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={choice === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={`rounded-md p-1.5 ${choice === value ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"}`}
        >
          <Icon aria-hidden className="size-4" />
        </button>
      ))}
    </div>
  );
}
