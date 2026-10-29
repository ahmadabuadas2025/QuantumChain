import type { Metadata } from "next";
import { moduleBySlug } from "@/content/modules";
import { CeoBox, ModuleFooter, ModuleHeader } from "@/components/ui/Blocks";
import { LabelLegend } from "@/components/ui/Claims";
import { Term } from "@/components/ui/Term";
import { OldVsNew } from "./OldVsNew";

const mod = moduleBySlug["old-vs-new"];

export const metadata: Metadata = { title: mod.title, description: mod.summary };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl">
      <ModuleHeader module={mod}>
        <p className="prose-qc">
          Six everyday jobs in finance, each shown two ways: on today&rsquo;s rails and on blockchain rails. Press
          play to race them, step through to see where things break, then read the honest verdict on where a{" "}
          <Term id="stablecoin">stablecoin</Term> or a shared ledger actually helps.
        </p>
        <LabelLegend />
      </ModuleHeader>
      <div className="mb-10">
        <CeoBox bullets={mod.ceo} />
      </div>
      <OldVsNew />
      <ModuleFooter slug={mod.slug} />
    </div>
  );
}
