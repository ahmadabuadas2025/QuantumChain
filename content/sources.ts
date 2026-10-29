import type { Source } from "./types";

// Every factual claim in the app points at one of these ids.
// `verified` is the date the claim was last checked against the source.

const list: Source[] = [
  {
    id: "fsb-2025-cbp-progress",
    title: "G20 Roadmap for Cross-border Payments: Consolidated progress report for 2025",
    publisher: "Financial Stability Board",
    url: "https://www.fsb.org/2025/10/g20-roadmap-for-cross-border-payments-consolidated-progress-report-for-2025/",
    published: "2025-10-09",
    verified: "2026-10-29",
  },
  {
    id: "fsb-g20-targets",
    title: "G20 targets for enhancing cross-border payments",
    publisher: "Financial Stability Board",
    url: "https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/cross-border-payments/g20-targets-for-enhancing-cross-border-payments-2/",
    verified: "2026-10-29",
  },
  {
    id: "sec-t1-final-rule",
    title: "Shortening the Securities Transaction Settlement Cycle (Release 34-96930)",
    publisher: "U.S. Securities and Exchange Commission",
    url: "https://www.sec.gov/files/rules/final/2023/34-96930.pdf",
    published: "2023-02-15",
    verified: "2026-10-29",
  },
  {
    id: "sec-t1-investor-bulletin",
    title: "New “T+1” Settlement Cycle – What Investors Need To Know",
    publisher: "U.S. Securities and Exchange Commission",
    url: "https://www.sec.gov/oiea/investor-alerts-and-bulletins/new-t1-settlement-cycle-what-investors-need-know-investor",
    verified: "2026-10-29",
  },
  {
    id: "esma-t1-one-year",
    title: "One year to go for T+1 settlement: the regulatory framework is complete",
    publisher: "European Securities and Markets Authority",
    url: "https://www.esma.europa.eu/node/235946",
    published: "2026-10-16",
    verified: "2026-10-29",
  },
  {
    id: "eth-pos",
    title: "Proof-of-stake (PoS)",
    publisher: "ethereum.org",
    url: "https://ethereum.org/developers/docs/consensus-mechanisms/pos/",
    verified: "2026-10-29",
  },
  {
    id: "solana-fees",
    title: "Fee structure",
    publisher: "Solana documentation",
    url: "https://solana.com/docs/core/fees/fee-structure",
    verified: "2026-10-29",
  },
  {
    id: "blackrock-buidl-launch",
    title: "BlackRock Launches Its First Tokenized Fund, BUIDL, on the Ethereum Network",
    publisher: "BlackRock (press release, via Nasdaq)",
    url: "https://www.nasdaq.com/press-release/blackrock-launches-its-first-tokenized-fund-buidl-on-the-ethereum-network-2024-03-20",
    published: "2024-03-20",
    verified: "2026-10-29",
  },
  {
    id: "nist-ir-8547-final",
    title: "NIST IR 8547: Transition to Post-Quantum Cryptography Standards (final)",
    publisher: "NIST Computer Security Resource Center",
    url: "https://csrc.nist.gov/pubs/ir/8547/final",
    published: "2026-10-27",
    verified: "2026-10-29",
  },
  {
    id: "nist-fips-203",
    title: "FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard",
    publisher: "NIST Computer Security Resource Center",
    url: "https://csrc.nist.gov/pubs/fips/203/final",
    published: "2024-08-13",
    verified: "2026-10-29",
  },
  {
    id: "nist-fips-204",
    title: "FIPS 204: Module-Lattice-Based Digital Signature Standard",
    publisher: "NIST Computer Security Resource Center",
    url: "https://csrc.nist.gov/pubs/fips/204/final",
    published: "2024-08-13",
    verified: "2026-10-29",
  },
  {
    id: "fatf-r16-2025",
    title: "Revised Recommendation 16 on payment transparency",
    publisher: "Financial Action Task Force",
    url: "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/update-Recommendation-16-payment-transparency-june-2025.html",
    published: "2025-06-18",
    verified: "2026-10-29",
  },
];

export const sources: Record<string, Source> = Object.fromEntries(list.map((s) => [s.id, s]));

export function getSource(id: string): Source {
  const s = sources[id];
  if (!s) throw new Error(`Unknown source id: ${id}`);
  return s;
}
