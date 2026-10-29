import type { GlossaryTerm } from "./types";

// Hover tooltips use `short`. Module 14 will extend this list to 50+ terms.
export const glossary: GlossaryTerm[] = [
  { id: "hash", term: "Hash", category: "crypto", short: "A fixed-length fingerprint of data. Change one character and the fingerprint changes completely." },
  { id: "private-key", term: "Private key", category: "crypto", short: "A secret number used to sign or decrypt. Whoever holds it controls the account or identity." },
  { id: "public-key", term: "Public key", category: "crypto", short: "The shareable half of a key pair. Others use it to check your signatures or encrypt to you." },
  { id: "digital-signature", term: "Digital signature", category: "crypto", short: "Proof, made with a private key, that a message came from the key holder and wasn't altered." },
  { id: "ecdh", term: "ECDH", category: "crypto", short: "Elliptic-curve Diffie–Hellman: two parties agree a shared secret over an open network. Quantum-vulnerable." },
  { id: "rsa", term: "RSA", category: "crypto", short: "A widely used public-key algorithm based on factoring large numbers. Quantum-vulnerable." },
  { id: "ml-kem", term: "ML-KEM", category: "pqc", short: "NIST's standard post-quantum key-encapsulation method (FIPS 203), used to agree encryption keys." },
  { id: "ml-dsa", term: "ML-DSA", category: "pqc", short: "NIST's main post-quantum digital signature standard (FIPS 204)." },
  { id: "hybrid-mode", term: "Hybrid mode", category: "pqc", short: "Running a classical and a post-quantum algorithm together, so security holds if either one does." },
  { id: "certificate-authority", term: "Certificate authority", category: "crypto", short: "An organisation trusted to vouch, by signature, that a public key belongs to a website or company." },
  { id: "correspondent-bank", term: "Correspondent bank", category: "markets", short: "A bank that holds accounts for other banks so they can make payments in places they don't operate." },
  { id: "swift", term: "SWIFT", category: "markets", short: "The global messaging network banks use to send payment instructions. It carries messages, not money." },
  { id: "stablecoin", term: "Stablecoin", category: "markets", short: "A token designed to hold a steady value, usually one US dollar, backed by reserves." },
  { id: "on-ramp", term: "On-ramp / off-ramp", category: "markets", short: "A service that converts bank money into crypto assets (on) or back again (off)." },
  { id: "finality", term: "Finality", category: "blockchain", short: "The point after which a transaction can't be reversed." },
  { id: "dvp", term: "Delivery versus payment", category: "markets", short: "A settlement rule: securities move only if payment moves, and vice versa." },
  { id: "t-plus-1", term: "T+1", category: "markets", short: "Settlement one business day after the trade date. The US standard since May 2024." },
  { id: "ccp", term: "Central counterparty", category: "markets", short: "A clearing house that stands between buyer and seller and guarantees the trade settles." },
  { id: "tokenization", term: "Tokenization", category: "markets", short: "Recording ownership of a real asset, like a fund share or bond, as a token on a shared ledger." },
  { id: "transfer-agent", term: "Transfer agent", category: "markets", short: "The firm that keeps the official register of who owns a fund's or company's shares." },
  { id: "custodian", term: "Custodian", category: "markets", short: "A regulated firm that safekeeps assets or keys on behalf of clients." },
  { id: "aml", term: "AML", category: "policy", short: "Anti-money laundering: the rules and checks that stop criminal money moving through finance." },
  { id: "kyc", term: "KYC", category: "policy", short: "Know your customer: verifying who a client is before serving them." },
  { id: "travel-rule", term: "Travel Rule", category: "policy", short: "FATF requirement that sender and recipient details travel with a transfer between providers." },
  { id: "smart-contract", term: "Smart contract", category: "blockchain", short: "Code stored on a blockchain that runs exactly as written when called." },
  { id: "wallet", term: "Wallet", category: "blockchain", short: "Software or hardware that holds private keys and signs transactions." },
  { id: "cbom", term: "CBOM", category: "pqc", short: "Cryptography bill of materials: an inventory of every algorithm, key and certificate a system uses." },
];

export const termById = Object.fromEntries(glossary.map((t) => [t.id, t]));
