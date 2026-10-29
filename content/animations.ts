import type { AnimationMeta } from "./types";

// Registry of the required animations. Entries are added as each module ships.
export const animations: AnimationMeta[] = [
  {
    id: "swift-vs-stablecoin",
    number: 11,
    title: "SWIFT vs stablecoin race",
    caption: "The same $200 payment travels both routes, with a running clock and fee counter.",
    whyItMatters:
      "The cost gap is real, but it sits mostly in the on- and off-ramps, so that's where a payments startup competes.",
    module: "old-vs-new",
    quiz: [
      {
        id: "anim11-1",
        prompt: "Which leg has historically been the slowest part of a correspondent-banking payment?",
        options: ["The sending bank", "The receiving bank crediting the customer", "The SWIFT network itself"],
        answer: 1,
        explain: "The FSB found faster processing at the beneficiary leg drove most recent speed gains.",
      },
      {
        id: "anim11-2",
        prompt: "In the stablecoin route, what can't be undone once it happens?",
        options: ["The on-ramp purchase", "The on-chain transfer", "The identity check"],
        answer: 1,
        explain: "On-chain transfers are final. There is no recall, so address and network checks matter.",
      },
    ],
  },
];

export const animationById = Object.fromEntries(animations.map((a) => [a.id, a]));
