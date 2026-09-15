import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { services } from "@/data/services";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { SplitReveal } from "@/components/ui/split-reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBlock } from "@/components/home/cta-block";

export const metadata = pageMetadata({
  title: "Web, App, Social Media & Software Services",
  description:
    "Website development, Android and iOS apps, social media marketing and custom software development by Crayora, for businesses in India and abroad.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Crayora services",
          itemListElement: services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: absoluteUrl(`/services/${s.slug}`),
          })),
        }}
      />
      <div className="shell pb-24 pt-32 md:pb-32 md:pt-40">
        <Breadcrumbs items={[["Home", "/"], ["Services", "/services"]]} />
        <SplitReveal as="h1" by="chars" onIntro delay={0.3} className="display-xl mt-8">
          Our <span className="text-outline">services.</span>
        </SplitReveal>
        <p className="mt-8 max-w-[56ch] text-lg text-mute md:text-xl">
          Four disciplines under one roof: websites, mobile apps, social media and custom software, planned, designed and
          delivered by the same team.
        </p>

        <ul className="mt-16 border-t border-line-strong md:mt-24">
          {services.map((s) => (
            <li key={s.key} className="border-b border-line-strong">
              <TransitionLink
                href={`/services/${s.slug}`}
                className="group grid gap-6 py-10 md:grid-cols-12 md:items-center md:gap-10 md:py-14"
              >
                <h2 className="display-md transition-transform duration-500 ease-[var(--ease-crayora)] group-hover:translate-x-3 md:col-span-6">
                  {s.name}
                </h2>
                <div className="md:col-span-5">
                  <p className="text-lg leading-relaxed text-mute">{s.pitch}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="chip">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="grid size-14 place-items-center justify-self-start rounded-full border border-line-strong transition-colors duration-500 group-hover:border-indigo group-hover:bg-indigo group-hover:text-white md:col-span-1 md:justify-self-end">
                  <ArrowUpRight weight="bold" className="size-5 transition-transform duration-500 group-hover:rotate-45" />
                  <span className="sr-only">Explore {s.name}</span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
      <CtaBlock />
    </>
  );
}
