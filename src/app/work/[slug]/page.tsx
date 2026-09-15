import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { projectBySlug, projects, projectsByCountry } from "@/data/projects";
import { countryByCode } from "@/data/countries";
import { serviceByKey } from "@/data/services";
import { absoluteUrl, organizationId, pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { SplitReveal } from "@/components/ui/split-reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { CaseCover } from "@/components/work/case-cover";
import { ProjectCard } from "@/components/work/project-card";
import { Sparkle } from "@/components/brand/logo";
import { fitHeading } from "@/lib/fit-heading";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.title}: ${project.type} in ${project.location}`,
    description: project.summary,
    path: `/work/${project.slug}`,
    type: "article",
  });
}

const serviceFor = (type: string) => serviceByKey(type === "Web platform" ? "software" : "web");

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const country = countryByCode[project.country];
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const sameCountry = projectsByCountry(project.country).filter((p) => p.slug !== project.slug && p.slug !== next.slug);
  // Two cards: same-country work first, topped up from elsewhere so the grid is never half empty.
  const others = projects.filter((p) => p.country !== project.country && p.slug !== next.slug);
  const related = [...sameCountry, ...others].slice(0, 2);
  const allSameCountry = related.every((p) => p.country === project.country);

  const service = serviceFor(project.type);
  const facts: { label: string; value: string; href?: string }[] = [
    { label: "Client location", value: project.location },
    { label: "Year", value: String(project.year) },
    { label: "Type", value: project.type },
    { label: "Service", value: service.name, href: `/services/${service.slug}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/work/${project.slug}`),
    image: absoluteUrl(project.image.src),
    dateCreated: String(project.year),
    creator: { "@id": organizationId },
    about: { "@type": "Service", name: service.name, url: absoluteUrl(`/services/${service.slug}`) },
    sameAs: project.liveUrl,
    keywords: project.stack.join(", "),
    locationCreated: country.name,
  };

  return (
    <article>
      <JsonLd data={jsonLd} />

      <header className="@container shell pt-32 md:pt-40">
        <Breadcrumbs items={[["Home", "/"], ["Work", "/work"], [project.title, `/work/${project.slug}`]]} />

        <div style={{ fontSize: fitHeading(project.title, "clamp(3rem, 9vw, 9.5rem)") }}>
          <SplitReveal as="h1" by="chars" onIntro delay={0.3} className="display-xl mt-8 max-w-[14ch] !text-[1em]">
            {project.title}
          </SplitReveal>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <p className="max-w-[48ch] text-lg leading-relaxed text-mute md:col-span-7 md:text-xl">{project.summary}</p>
          <div className="md:col-span-5 md:flex md:justify-end">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Visit live site
              <ArrowUpRight weight="bold" className="size-4" />
            </a>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-8 md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="mono-label">{f.label}</dt>
              <dd className="mt-2 text-lg text-ink">
                {f.href ? (
                  <TransitionLink href={f.href} className="link-underline">
                    {f.value}
                  </TransitionLink>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="shell mt-14 md:mt-20">
        <CaseCover project={project} />
      </div>

      <section className="shell grid gap-14 py-24 md:py-36 lg:grid-cols-12" aria-labelledby="brief-title">
        <div className="lg:col-span-7">
          <SplitReveal id="brief-title" className="display-md">
            The brief
          </SplitReveal>
          <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-mute">{project.about ?? project.summary}</p>
        </div>
        <div className="lg:col-span-5">
          <h2 className="font-display text-2xl font-bold tracking-tight">Built with</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="chip !text-ink">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="built-title">
        <div className="shell">
          <SplitReveal id="built-title" className="display-md">
            What we delivered
          </SplitReveal>
          <ul className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
            {project.highlights.map((h) => (
              <li key={h} className="glass-violet flex flex-col gap-5 rounded-[var(--radius-panel)] p-8">
                <Sparkle className="size-7 text-indigo" />
                <p className="text-lg leading-relaxed text-ink">{h}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="shell py-24 md:py-32" aria-labelledby="related-title">
          <h2 id="related-title" className="display-md">
            {allSameCountry ? `More from ${country.code === "global" ? "our products" : country.name}` : "More work"}
          </h2>
          <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      <TransitionLink
        href={`/work/${next.slug}`}
        className="group relative block overflow-hidden border-t border-line py-24 md:py-36"
        aria-label={`Next project: ${next.title}`}
      >
        <Image
          src={next.image.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-0 transition-opacity duration-700 group-hover:opacity-25"
        />
        <div className="@container shell relative">
          <span className="mono-label">Next project</span>
          {/* The trailing W reserves room for the arrow beside the last word. */}
          <span
            className="display-lg mt-4 flex items-center gap-6"
            style={{ fontSize: fitHeading(`${next.title}W`, "clamp(2.5rem, 6.4vw, 6.25rem)") }}
          >
            {next.title}
            <ArrowUpRight weight="bold" className="size-12 shrink-0 text-indigo transition-transform duration-500 group-hover:rotate-45 md:size-20" />
          </span>
        </div>
      </TransitionLink>
    </article>
  );
}
