import { renderOg } from "@/lib/og";
import { projectBySlug, projects } from "@/data/projects";
import { countryByCode } from "@/data/countries";

export const alt = "Crayora case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug) ?? projects[0];
  const country = countryByCode[project.country];
  return renderOg({
    eyebrow: country.code === "global" ? "Case study, global" : `Case study, ${country.short}`,
    title: project.title,
    subtitle: `${project.type} for a client in ${project.location}`,
    screenshot: { slug: project.slug, width: project.image.width, height: project.image.height },
  });
}
