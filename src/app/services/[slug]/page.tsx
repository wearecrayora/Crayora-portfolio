import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { process, serviceBySlug, services } from "@/data/services";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { absoluteUrl, organizationId, pageMetadata } from "@/lib/seo";
import { SplitReveal } from "@/components/ui/split-reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Faq } from "@/components/seo/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceVisual } from "@/components/home/service-visuals";
import { ProjectCard } from "@/components/work/project-card";
import { CtaBlock } from "@/components/home/cta-block";
import { Sparkle } from "@/components/brand/logo";
import { fitHeading } from "@/lib/fit-heading";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};
  return pageMetadata({ title: service.seoTitle, description: service.metaDescription, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const types = service.projectTypes;
  const related = types ? projects.filter((p) => types.includes(p.type)).slice(0, 4) : [];
  const otherServices = services.filter((s) => s.key !== service.key);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    url: absoluteUrl(path),
    provider: { "@id": organizationId },
    areaServed: ["India", "United Arab Emirates", "United Kingdom", "United States"].map((name) => ({ "@type": "Country", name })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.name,
      itemListElement: service.deliverables.map((d) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d } })),
    },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />

      <header className="shell grid gap-14 pb-20 pt-32 md:pb-28 md:pt-40 lg:grid-cols-12 lg:items-center">
        <div className="@container lg:col-span-7">
          <Breadcrumbs items={[["Home", "/"], ["Services", "/services"], [service.name, path]]} />
          <div style={{ fontSize: fitHeading(service.name, "clamp(2.5rem, 6.4vw, 6.25rem)") }}>
            <SplitReveal as="h1" by="chars" onIntro delay={0.3} className="display-lg mt-8 !text-[1em]">
              {service.name}
            </SplitReveal>
          </div>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-mute md:text-xl">{service.intro}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <TransitionLink href="/contact" className="btn btn-primary">
              Start a project
              <ArrowUpRight weight="bold" className="size-4" />
            </TransitionLink>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="link-underline text-mute hover:text-ink">
              Or message us on WhatsApp
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-lg lg:col-span-5 lg:max-w-none">
          <ServiceVisual kind={service.key} />
        </div>
      </header>

      <section className="py-24 md:py-32" aria-labelledby="included-title">
        <div className="shell">
          <SplitReveal id="included-title" className="display-md max-w-[16ch]">
            What you get
          </SplitReveal>
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {service.features.map((f) => (
              <div key={f.title} className="glass flex flex-col gap-4 rounded-[var(--radius-panel)] p-8 md:p-10">
                <Sparkle className="size-7 text-indigo" />
                <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{f.title}</h3>
                <p className="max-w-[44ch] text-lg leading-relaxed text-mute">{f.body}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-16 font-display text-xl font-bold tracking-tight">Every engagement can include</h3>
          <ul className="mt-5 flex flex-wrap gap-2">
            {service.deliverables.map((d) => (
              <li key={d} className="chip !text-ink">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell py-24 md:py-32" aria-labelledby="how-title">
        <SplitReveal id="how-title" className="display-md">
          How we work
        </SplitReveal>
        <ol className="mt-14 grid gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {process.map((step, i) => (
            <li key={step.title} className="border-t border-line-strong pt-6">
              <span className="font-mono text-sm text-indigo-hi">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-mute">{step.body}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-24 font-display text-2xl font-bold tracking-tight md:text-3xl">Tools and platforms</h2>
        {/* Column count matches the tool count so the grid never has empty cells. */}
        <ul
          className={`mt-8 grid gap-3 ${
            service.tools.length === 6 ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-4 sm:grid-cols-8"
          }`}
        >
          {service.tools.map((t) => (
            <li key={t.file} className="glass group grid aspect-square place-items-center rounded-2xl">
              <span
                role="img"
                aria-label={t.name}
                title={t.name}
                className="logo-mask size-8 text-mute transition-colors duration-300 group-hover:text-ink md:size-10"
                style={{ "--logo": `url(/stack/${t.file}.svg)` } as React.CSSProperties}
              />
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="shell pb-24 md:pb-32" aria-labelledby="work-title">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SplitReveal id="work-title" className="display-md">
              Recent work
            </SplitReveal>
            <TransitionLink href="/work" className="link-underline text-mute hover:text-ink">
              See the work
            </TransitionLink>
          </div>
          <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      <section className="shell pb-24 md:pb-32" aria-labelledby="faq-title">
        <SplitReveal id="faq-title" className="display-md">
          Questions, answered
        </SplitReveal>
        <div className="mt-12">
          <Faq items={service.faqs} />
        </div>
      </section>

      <section className="shell pb-8" aria-labelledby="more-title">
        <h2 id="more-title" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          More from Crayora
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {otherServices.map((s) => (
            <li key={s.key}>
              <TransitionLink
                href={`/services/${s.slug}`}
                className="group flex h-full items-center justify-between gap-4 rounded-[var(--radius-panel)] border glass p-6 transition-colors duration-500 hover:border-indigo hover:bg-indigo hover:text-white"
              >
                <span className="font-display text-xl font-bold tracking-tight">{s.name}</span>
                <ArrowUpRight weight="bold" className="size-5 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
              </TransitionLink>
            </li>
          ))}
        </ul>
      </section>

      <CtaBlock />
    </>
  );
}
