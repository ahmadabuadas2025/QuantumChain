import { animations } from "@/content/animations";
import { comparisons } from "@/content/comparisons";
import { glossary } from "@/content/glossary";
import { modules } from "@/content/modules";

// One flat index over every content file. New content types add a block here.

export interface SearchEntry {
  title: string;
  text: string;
  href: string;
  kind: "Module" | "Lesson" | "Animation" | "Glossary";
}

export function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const m of modules) {
    out.push({ title: m.title, text: `${m.summary} ${m.ceo.join(" ")}`, href: m.href, kind: "Module" });
  }
  for (const c of comparisons) {
    out.push({
      title: `${c.title}: old vs new`,
      text: [c.question, c.old.title, c.next.title, c.goDeeper, ...c.fits, ...c.doesNotFit].join(" "),
      href: `/old-vs-new#${c.id}`,
      kind: "Lesson",
    });
  }
  for (const a of animations) {
    const mod = modules.find((m) => m.slug === a.module);
    out.push({
      title: a.title,
      text: `${a.caption} ${a.whyItMatters}`,
      href: mod ? mod.href : "/",
      kind: "Animation",
    });
  }
  for (const g of glossary) {
    out.push({ title: g.term, text: g.short, href: `/glossary#${g.id}`, kind: "Glossary" });
  }
  return out;
}

/** Ranks by title match first, then by how many query words appear in the text. */
export function search(index: SearchEntry[], query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  return index
    .map((e) => {
      const title = e.title.toLowerCase();
      const text = e.text.toLowerCase();
      let score = 0;
      if (title.startsWith(q)) score += 10;
      else if (title.includes(q)) score += 6;
      for (const w of words) {
        if (title.includes(w)) score += 3;
        if (text.includes(w)) score += 1;
      }
      return { e, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.e);
}
