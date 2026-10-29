import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { glossary } from "@/content/glossary";
import { modules } from "@/content/modules";
import { CeoBox, ModuleHeader } from "@/components/ui/Blocks";

// Holding page for modules still being built. Built modules have their own folder,
// which takes precedence over this dynamic route.

const pending = modules.filter((m) => m.status === "building");

export function generateStaticParams() {
  return pending.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[module]">): Promise<Metadata> {
  const { module } = await params;
  const m = pending.find((x) => x.slug === module);
  return m ? { title: m.title, description: m.summary } : {};
}

export default async function Page({ params }: PageProps<"/[module]">) {
  const { module } = await params;
  const m = pending.find((x) => x.slug === module);
  if (!m) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <ModuleHeader module={m} />
      <CeoBox bullets={m.ceo} />
      <p className="prose-qc mt-8 text-muted">
        The lessons, animations and quizzes for this module are being built next. Meanwhile, the{" "}
        <Link href="/old-vs-new" className="text-accent underline">
          Old World vs New World
        </Link>{" "}
        module is ready.
      </p>

      {m.slug === "glossary" && (
        <section aria-labelledby="terms" className="mt-10">
          <h2 id="terms" className="text-xl font-semibold">
            Terms so far
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {glossary.map((g) => (
              <div key={g.id} id={g.id} className="scroll-mt-20 rounded-xl border border-rule bg-panel p-4">
                <dt className="font-semibold">{g.term}</dt>
                <dd className="mt-1 text-muted">{g.short}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
