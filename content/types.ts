// Shared content model. Every page renders from these types, so content edits
// never require touching components.

/** How a statement should be read. Rendered as visually distinct badges. */
export type ClaimLabel = "fact" | "estimate" | "position" | "scenario";

/** ISO date (YYYY-MM-DD). */
export type ISODate = string;

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** Publication date of the source, if known. */
  published?: ISODate;
  /** Date we last opened the source and confirmed the claim. */
  verified: ISODate;
}

/** A single sourced statement. */
export interface Claim {
  text: string;
  label: ClaimLabel;
  sourceIds: string[];
}

export type ModuleSlug =
  | "dashboard"
  | "foundations"
  | "old-vs-new"
  | "blockchain"
  | "stablecoins"
  | "quantum-threat"
  | "pqc"
  | "web3-quantum"
  | "problems"
  | "regulators"
  | "policy"
  | "industry"
  | "videos"
  | "opportunities"
  | "glossary";

export interface ModuleMeta {
  slug: ModuleSlug;
  number: number;
  title: string;
  /** One-line purpose shown in nav tooltips and the dashboard. */
  summary: string;
  href: string;
  /** Rough reading + interaction time. */
  minutes: number;
  /** "Explain it to the CEO": exactly three jargon-free bullets. */
  ceo: [string, string, string];
  /** Whether the module's full content has shipped. */
  status: "ready" | "building";
  /** Lucide icon name, resolved in components/shell/icons.ts */
  icon: string;
}

export interface LearningPathStep {
  label: string;
  modules: ModuleSlug[];
  hours: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: LearningPathStep[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

// ---------- Module 2: Old world vs new world ----------

export interface FlowNode {
  id: string;
  label: string;
  /** Short role, e.g. "Correspondent bank". */
  role: string;
}

export interface FlowHop {
  from: string;
  to: string;
  /** What happens on this hop, shown as the step caption. */
  action: string;
  /** Simulated elapsed time added by this hop, in minutes (for the race clock). */
  minutes: number;
  /** Simulated cost added by this hop, in USD, for the fee counter. */
  cost: number;
  /** Things that can go wrong on this hop. */
  failure?: string;
}

export interface Lane {
  title: string;
  nodes: FlowNode[];
  hops: FlowHop[];
  /** Plain-language summary rows rendered beside the diagram. */
  time: string;
  cost: string;
  intermediaries: string;
}

export interface Comparison {
  id: string;
  title: string;
  question: string;
  old: Lane;
  next: Lane;
  /** Basis for the simulated numbers, shown under the race. */
  simulationNote: string;
  claims: Claim[];
  fits: string[];
  doesNotFit: string[];
  goDeeper: string;
  quiz: QuizQuestion[];
}

// ---------- Animations registry ----------

export interface AnimationMeta {
  id: string;
  number: number;
  title: string;
  caption: string;
  whyItMatters: string;
  module: ModuleSlug;
  quiz: [QuizQuestion, QuizQuestion];
}

// ---------- Glossary ----------

export interface GlossaryTerm {
  id: string;
  term: string;
  short: string;
  category: "crypto" | "blockchain" | "quantum" | "pqc" | "markets" | "policy";
  related?: string[];
}
