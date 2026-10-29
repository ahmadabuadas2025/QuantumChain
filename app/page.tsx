import { Dashboard } from "./Dashboard";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 flex flex-col gap-3">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.1]">
          Learn how money, ledgers and cryptography are changing, then decide what to build.
        </h1>
        <p className="prose-qc text-lg text-muted">
          Blockchain rails, stablecoins, the quantum threat to today&rsquo;s encryption, the rules in play, and the
          startup opportunities they open. Visual first, sourced throughout, written for a CEO briefing.
        </p>
      </header>
      <Dashboard />
    </div>
  );
}
