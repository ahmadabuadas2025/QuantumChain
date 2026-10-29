import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { ModuleMeta } from "@/content/types";
import { ModuleDoneToggle } from "./ModuleDoneToggle";

export function ModuleHeader({ module, children }: { module: ModuleMeta; children?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-3">
      <p className="text-sm text-muted">
        Module {module.number}, about {module.minutes} minutes
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{module.title}</h1>
      <p className="prose-qc text-lg text-muted">{module.summary}</p>
      {children}
    </header>
  );
}

export function CeoBox({ bullets }: { bullets: readonly string[] }) {
  return (
    <section
      aria-labelledby="ceo-box"
      className="rounded-xl border-l-4 border-accent bg-accent-soft/60 px-5 py-4 dark:bg-accent-soft/40"
    >
      <h2 id="ceo-box" className="font-semibold">
        Explain it to the CEO
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}

export function GoDeeper({ title = "Go deeper", children }: { title?: string; children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-rule bg-panel">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium">
        {title}
        <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="prose-qc px-4 pb-4 text-muted">{children}</div>
    </details>
  );
}

export function FitBox({ fits, doesNotFit }: { fits: string[]; doesNotFit: string[] }) {
  return (
    <section aria-label="Where blockchain fits and where it doesn't" className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-rule bg-panel p-4">
        <h3 className="font-semibold text-risk-green">Where blockchain fits</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          {fits.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-rule bg-panel p-4">
        <h3 className="font-semibold text-risk-red">Where it doesn&rsquo;t</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          {doesNotFit.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ModuleFooter({ slug }: { slug: ModuleMeta["slug"] }) {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
      <p className="text-muted">Finished this module? Mark it complete to update your dashboard.</p>
      <ModuleDoneToggle slug={slug} />
    </div>
  );
}
