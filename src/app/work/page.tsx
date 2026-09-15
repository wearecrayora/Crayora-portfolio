import { WorkArchive } from "@/components/work/work-archive";
import { SplitReveal } from "@/components/ui/split-reveal";
import { projects } from "@/data/projects";
import { countries } from "@/data/countries";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata({
  title: "Our Work: Client Projects by Country",
  description:
    "Case studies from Crayora's client work across India, the UAE, the UK and the USA, with the brief, the build and a link to every live project.",
  path: "/work",
});

const countryCount = countries.filter((c) => c.code !== "global").length;

export default function WorkPage() {
  return (
    <div className="shell pb-32 pt-32 md:pb-44 md:pt-40">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Crayora work",
          url: absoluteUrl("/work"),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.title,
              url: absoluteUrl(`/work/${p.slug}`),
            })),
          },
        }}
      />
      <Breadcrumbs items={[["Home", "/"], ["Work", "/work"]]} />
      <SplitReveal as="h1" by="chars" onIntro delay={0.3} className="display-xl mt-8">
        The <span className="text-outline">work.</span>
      </SplitReveal>
      <p className="mt-8 max-w-[52ch] text-lg text-mute md:text-xl">
        {projects.length} projects across {countryCount} countries, grouped by where our clients are. Pick a country to see the
        work we have delivered there.
      </p>

      <div className="mt-16 md:mt-24">
        <WorkArchive />
      </div>
    </div>
  );
}
