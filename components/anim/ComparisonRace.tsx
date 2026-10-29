"use client";

import type { Comparison, Lane } from "@/content/types";
import { ClaimBadge } from "@/components/ui/Claims";
import { Controls } from "./Controls";
import { useTimeline } from "./useTimeline";

// Wall-clock progress w (0..1) maps to simulated time as total * w^EXP, so the
// time-lapse starts slow and speeds up. The faster lane stays visible long enough to
// follow even when the slower lane takes days.
const EXP = 3;
const SCALE = 1000;

function laneState(lane: Lane, t: number) {
  let cum = 0;
  let fee = 0;
  for (let i = 0; i < lane.hops.length; i++) {
    const h = lane.hops[i];
    if (t < cum + h.minutes) {
      const frac = (t - cum) / h.minutes;
      return { hop: i, frac, elapsed: t, fee: fee + h.cost * frac, done: false };
    }
    cum += h.minutes;
    fee += h.cost;
  }
  return { hop: lane.hops.length - 1, frac: 1, elapsed: cum, fee, done: true };
}

function laneTotal(lane: Lane) {
  return lane.hops.reduce((s, h) => s + h.minutes, 0);
}

export function formatMinutes(m: number) {
  const mins = Math.round(m);
  if (mins < 1) return "under 1 min";
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const mm = mins % 60;
  return [d && `${d}d`, h && `${h}h`, (mm || (!d && !h)) && `${mm}m`].filter(Boolean).join(" ");
}

function money(v: number) {
  return `$${v.toFixed(2)}`;
}

const NODE_H = 46;
const GAP = 40;
const W = 280;

function LaneDiagram({ lane, t, tone }: { lane: Lane; t: number; tone: "old" | "new" }) {
  const s = laneState(lane, t);
  const color = tone === "old" ? "var(--old-lane)" : "var(--new-lane)";
  const H = lane.nodes.length * NODE_H + (lane.nodes.length - 1) * GAP + 8;
  const nodeY = (i: number) => 4 + i * (NODE_H + GAP);
  const started = t > 0;
  // Token sits in the first node, travels down each connector, and rests in the last node.
  const tokenY = !started
    ? nodeY(0) + NODE_H / 2
    : s.done
      ? nodeY(lane.nodes.length - 1) + NODE_H / 2
      : nodeY(s.hop) + NODE_H + s.frac * GAP;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[22rem]" role="img" aria-label={`${lane.title} flow diagram`}>
      {lane.nodes.slice(0, -1).map((n, i) => {
        const reached = started && (i < s.hop || (i === s.hop && s.frac > 0) || s.done);
        const y1 = nodeY(i) + NODE_H;
        return (
          <g key={`edge-${n.id}`}>
            <line x1={W / 2} x2={W / 2} y1={y1} y2={y1 + GAP} stroke="var(--rule)" strokeWidth={3} />
            {reached && (
              <line
                x1={W / 2}
                x2={W / 2}
                y1={y1}
                y2={y1 + GAP * (i < s.hop || s.done ? 1 : s.frac)}
                stroke={color}
                strokeWidth={3}
              />
            )}
            {lane.hops[i]?.failure && (
              <g aria-hidden>
                <circle cx={W / 2 + 22} cy={y1 + GAP / 2} r={8} fill="none" stroke="var(--risk-amber)" strokeWidth={1.5} />
                <text x={W / 2 + 22} y={y1 + GAP / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--risk-amber)">
                  !
                </text>
              </g>
            )}
          </g>
        );
      })}
      {lane.nodes.map((n, i) => {
        const active = started && !s.done && (i === s.hop || i === s.hop + 1);
        const passed = started && (i <= s.hop || s.done);
        return (
          <g key={n.id}>
            <rect
              x={30}
              y={nodeY(i)}
              width={W - 60}
              height={NODE_H}
              rx={10}
              fill="var(--panel)"
              stroke={active || passed ? color : "var(--rule)"}
              strokeWidth={active ? 2.5 : 1.5}
            />
            <text x={W / 2} y={nodeY(i) + 20} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--ink)">
              {n.label}
            </text>
            <text x={W / 2} y={nodeY(i) + 36} textAnchor="middle" fontSize={11.5} fill="var(--muted)">
              {n.role}
            </text>
          </g>
        );
      })}
      {/* On arrival the token parks at the node's left edge so it never covers the label. */}
      <circle cx={s.done ? 48 : W / 2} cy={tokenY} r={7} fill={color} stroke="var(--panel)" strokeWidth={2} />
    </svg>
  );
}

function LaneReadout({ lane, t, tone }: { lane: Lane; t: number; tone: "old" | "new" }) {
  const s = laneState(lane, t);
  const hop = lane.hops[s.hop];
  const status = t <= 0 ? "Waiting to start." : s.done ? "Delivered." : hop.action;
  return (
    <div className="flex flex-col gap-2">
      <dl className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-panel-2 px-3 py-2">
          <dt className="text-xs text-muted">Elapsed</dt>
          <dd className="text-xl font-semibold tabular-nums" data-testid={`${tone}-clock`}>
            {t <= 0 ? "0m" : formatMinutes(s.elapsed)}
          </dd>
        </div>
        <div className="rounded-lg bg-panel-2 px-3 py-2">
          <dt className="text-xs text-muted">Fees so far</dt>
          <dd className="text-xl font-semibold tabular-nums">{money(s.fee)}</dd>
        </div>
      </dl>
      <p className="min-h-[3.2rem] text-[0.95rem]">{status}</p>
      {!s.done && t > 0 && hop.failure && (
        <p className="text-sm text-risk-amber">
          <span className="font-semibold">What can go wrong: </span>
          {hop.failure}
        </p>
      )}
    </div>
  );
}

/** Compact head-to-head view: both lanes as progress tracks, so the race reads on a phone too. */
function RaceBar({ rows, t }: { rows: [string, Lane, string][]; t: number }) {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      {rows.map(([name, lane, color]) => {
        const s = laneState(lane, t);
        const pct = Math.min(100, (s.elapsed / laneTotal(lane)) * 100);
        return (
          <div key={name} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 text-sm">
            <span className="font-medium" style={{ color }}>
              {name}
            </span>
            <span className="h-2 overflow-hidden rounded-full bg-rule">
              <span className="block h-full rounded-full" style={{ width: `${t > 0 ? pct : 0}%`, background: color }} />
            </span>
            <span className="flex justify-end gap-3 tabular-nums">
              <span>{t <= 0 ? "0m" : formatMinutes(s.elapsed)}</span>
              <span className="text-muted">{money(s.fee)}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ComparisonRace({ comparison, animId }: { comparison: Comparison; animId: string }) {
  const { old, next } = comparison;
  const oldTotal = laneTotal(old);
  const newTotal = laneTotal(next);
  const total = Math.max(oldTotal, newTotal);

  const toWall = (sim: number) => Math.pow(sim / total, 1 / EXP) * SCALE;
  const cumulative = (lane: Lane) => {
    let c = 0;
    return lane.hops.map((h) => (c += h.minutes));
  };
  const events = [...cumulative(old), ...cumulative(next)].map(toWall);

  const tl = useTimeline({ id: animId, total: SCALE, events, durationMs: 10000 });
  const sim = total * Math.pow(tl.t / SCALE, EXP);

  const os = laneState(old, sim);
  const ns = laneState(next, sim);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-rule bg-panel p-4 sm:p-6" data-animation={animId}>
      <Controls tl={tl} />
      <p className="text-sm text-muted">The time-lapse speeds up as it runs, so both routes stay easy to follow.</p>

      <RaceBar rows={[["Old world", old, "var(--old-lane)"], ["New world", next, "var(--new-lane)"]]} t={sim} />

      <div className="grid gap-6 md:grid-cols-2">
        {(
          [
            ["old", old, "Old world"],
            ["new", next, "New world"],
          ] as const
        ).map(([tone, lane, heading]) => (
          <section key={tone} aria-label={`${heading}: ${lane.title}`} className="flex flex-col items-center gap-4">
            <header className="w-full">
              <p className="text-sm font-medium" style={{ color: tone === "old" ? "var(--old-lane)" : "var(--new-lane)" }}>
                {heading}
              </p>
              <h4 className="font-semibold">{lane.title}</h4>
            </header>
            <LaneDiagram lane={lane} t={sim} tone={tone} />
            <div className="w-full" aria-live="polite">
              <LaneReadout lane={lane} t={sim} tone={tone} />
            </div>
          </section>
        ))}
      </div>

      {os.done && ns.done && (
        <div className="flex flex-col gap-2 rounded-xl border border-rule p-4 sm:flex-row sm:items-center sm:gap-4" role="status">
          <ClaimBadge label="scenario" />
          <p>
            In this scenario the new route arrived in <strong>{formatMinutes(newTotal)}</strong> for{" "}
            <strong>{money(laneState(next, newTotal).fee)}</strong>; the old route took{" "}
            <strong>{formatMinutes(oldTotal)}</strong> for <strong>{money(laneState(old, oldTotal).fee)}</strong>.
          </p>
        </div>
      )}
      <p className="text-sm text-muted">{comparison.simulationNote}</p>
    </div>
  );
}
