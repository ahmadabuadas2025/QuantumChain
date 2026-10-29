import { ExternalLink } from "lucide-react";
import { getSource } from "@/content/sources";
import type { Claim, ClaimLabel } from "@/content/types";

const labelText: Record<ClaimLabel, string> = {
  fact: "Fact",
  estimate: "Estimate",
  position: "Stated position",
  scenario: "Scenario",
};

// Each label has its own colour *and* its own shape, so it reads without colour too.
const labelStyle: Record<ClaimLabel, string> = {
  fact: "border-[var(--label-fact)] text-[var(--label-fact)]",
  estimate: "border-dashed border-[var(--label-estimate)] text-[var(--label-estimate)]",
  position: "border-[var(--label-position)] text-[var(--label-position)] rounded-sm",
  scenario: "border-dotted border-[var(--label-scenario)] text-[var(--label-scenario)] italic",
};

export function ClaimBadge({ label }: { label: ClaimLabel }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border-[1.5px] px-2 py-px text-xs font-medium ${labelStyle[label]}`}
    >
      {labelText[label]}
    </span>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function SourceLink({ id }: { id: string }) {
  const s = getSource(id);
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-baseline gap-1 text-sm text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
    >
      {s.publisher}
      <ExternalLink aria-hidden className="size-3 self-center" />
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
}

export function ClaimList({ claims }: { claims: Claim[] }) {
  if (claims.length === 0) return null;
  return (
    <ul className="flex flex-col gap-3">
      {claims.map((c) => {
        const verified = c.sourceIds.map((id) => getSource(id).verified).sort()[0];
        return (
          <li key={c.text} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
            <ClaimBadge label={c.label} />
            <div>
              <p>{c.text}</p>
              <p className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-muted">
                {c.sourceIds.map((id) => (
                  <SourceLink key={id} id={id} />
                ))}
                <span>Checked {formatDate(verified)}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function LabelLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
      <span>How to read labels:</span>
      {(Object.keys(labelText) as ClaimLabel[]).map((l) => (
        <ClaimBadge key={l} label={l} />
      ))}
    </div>
  );
}
